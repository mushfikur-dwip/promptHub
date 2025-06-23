import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Tag {
  id: string;
  name: string;
  created_at: Timestamp;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  language: string;
  creator_name: string;
  creator_avatar: string | null;
  image_url: string | null;
  tags: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface Rating {
  id: string;
  prompt_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: Timestamp;
}

export interface PromptWithStats extends Prompt {
  rating_stats: {
    average_rating: number;
    total_ratings: number;
  };
}

export class FirebaseService {
  // Prompts
  static async getPrompts(filters: { tags?: string[]; language?: string } = {}): Promise<PromptWithStats[]> {
    try {
      let promptQuery = query(
        collection(db, 'prompts'),
        orderBy('created_at', 'desc')
      );

      if (filters.language) {
        promptQuery = query(
          collection(db, 'prompts'),
          where('language', '==', filters.language),
          orderBy('created_at', 'desc')
        );
      }

      const promptSnapshot = await getDocs(promptQuery);
      const prompts: Prompt[] = promptSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Prompt));

      // Filter by tags if provided
      let filteredPrompts = prompts;
      if (filters.tags && filters.tags.length > 0) {
        filteredPrompts = prompts.filter(prompt =>
          filters.tags!.every(tag =>
            prompt.tags.some(promptTag =>
              promptTag.toLowerCase() === tag.toLowerCase()
            )
          )
        );
      }

      // Get rating stats for each prompt
      const promptsWithStats: PromptWithStats[] = await Promise.all(
        filteredPrompts.map(async (prompt) => {
          const stats = await this.getRatingStats(prompt.id);
          return {
            ...prompt,
            rating_stats: stats
          };
        })
      );

      return promptsWithStats;
    } catch (error) {
      console.error('Error fetching prompts:', error);
      return [];
    }
  }

  static async getPrompt(id: string): Promise<PromptWithStats | null> {
    try {
      const promptDoc = await getDoc(doc(db, 'prompts', id));
      if (!promptDoc.exists()) {
        return null;
      }

      const promptData = { id: promptDoc.id, ...promptDoc.data() } as Prompt;
      const stats = await this.getRatingStats(id);

      return {
        ...promptData,
        rating_stats: stats
      };
    } catch (error) {
      console.error('Error fetching prompt:', error);
      return null;
    }
  }

  static async createPrompt(
    promptData: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Prompt> {
    try {
      const docRef = await addDoc(collection(db, 'prompts'), {
        ...promptData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });

      const newPrompt = await getDoc(docRef);
      return { id: newPrompt.id, ...newPrompt.data() } as Prompt;
    } catch (error) {
      console.error('Error creating prompt:', error);
      throw error;
    }
  }

  static async updatePrompt(
    id: string,
    updates: Partial<Omit<Prompt, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<void> {
    try {
      const promptRef = doc(db, 'prompts', id);
      await updateDoc(promptRef, {
        ...updates,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  }

  static async deletePrompt(id: string): Promise<void> {
    try {
      const promptRef = doc(db, 'prompts', id);
      await deleteDoc(promptRef);
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  }

  // Tags
  static async getTags(): Promise<(Tag & { count: number })[]> {
    try {
      const tagsSnapshot = await getDocs(collection(db, 'tags'));
      const tags: Tag[] = tagsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Tag));

      // Get usage count for each tag
      const tagsWithCount = await Promise.all(
        tags.map(async (tag) => {
          const promptsQuery = query(
            collection(db, 'prompts'),
            where('tags', 'array-contains', tag.name)
          );
          const promptsSnapshot = await getDocs(promptsQuery);
          return {
            ...tag,
            count: promptsSnapshot.size
          };
        })
      );

      return tagsWithCount
        .filter(tag => tag.count > 0)
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  static async createTag(name: string): Promise<Tag> {
    try {
      const docRef = await addDoc(collection(db, 'tags'), {
        name,
        created_at: serverTimestamp()
      });

      const newTag = await getDoc(docRef);
      return { id: newTag.id, ...newTag.data() } as Tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Ratings
  static async getRatings(promptId: string): Promise<Rating[]> {
    try {
      const ratingsQuery = query(
        collection(db, 'ratings'),
        where('prompt_id', '==', promptId),
        orderBy('created_at', 'desc')
      );

      const ratingsSnapshot = await getDocs(ratingsQuery);
      return ratingsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Rating));
    } catch (error) {
      console.error('Error fetching ratings:', error);
      return [];
    }
  }

  static async addRating(ratingData: Omit<Rating, 'id' | 'created_at'>): Promise<Rating> {
    try {
      // Check if user already rated this prompt
      const existingRatingQuery = query(
        collection(db, 'ratings'),
        where('prompt_id', '==', ratingData.prompt_id),
        where('user_id', '==', ratingData.user_id)
      );

      const existingRatingSnapshot = await getDocs(existingRatingQuery);
      if (!existingRatingSnapshot.empty) {
        throw new Error('You have already rated this prompt');
      }

      const docRef = await addDoc(collection(db, 'ratings'), {
        ...ratingData,
        created_at: serverTimestamp()
      });

      const newRating = await getDoc(docRef);
      return { id: newRating.id, ...newRating.data() } as Rating;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  static async getRatingStats(promptId: string): Promise<{
    average_rating: number;
    total_ratings: number;
    ratings_distribution: Record<number, number>;
  }> {
    try {
      const ratings = await this.getRatings(promptId);
      const totalRatings = ratings.length;

      const ratingsDistribution: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
      let averageRating = 0;

      if (totalRatings > 0) {
        const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
        averageRating = sum / totalRatings;

        ratings.forEach(r => {
          ratingsDistribution[r.rating]++;
        });
      }

      return {
        average_rating: averageRating,
        total_ratings: totalRatings,
        ratings_distribution: ratingsDistribution
      };
    } catch (error) {
      console.error('Error getting rating stats:', error);
      return {
        average_rating: 0,
        total_ratings: 0,
        ratings_distribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
      };
    }
  }
}
export { db };
