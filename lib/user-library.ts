import localforage from 'localforage';

export interface SavedPrompt {
  id: string;
  title: string;
  description: string;
  content: string;
  language: string;
  creator_name: string;
  creator_avatar: string | null;
  saved_at: string;
}

const LIBRARY_KEY = 'prompt_library';
const LIBRARY_EXPIRY_DAYS = 30;

// Initialize localforage
const library = localforage.createInstance({
  name: 'PromptLibrary',
  storeName: 'saved_prompts'
});

export class UserLibrary {
  static async getSavedPrompts(): Promise<SavedPrompt[]> {
    try {
      const saved = await library.getItem<SavedPrompt[]>(LIBRARY_KEY) || [];
      
      // Auto-purge old prompts (>30 days)
      const now = new Date();
      const validPrompts = saved.filter(prompt => {
        const savedDate = new Date(prompt.saved_at);
        const daysDiff = (now.getTime() - savedDate.getTime()) / (1000 * 3600 * 24);
        return daysDiff <= LIBRARY_EXPIRY_DAYS;
      });

      // Update storage if we removed any
      if (validPrompts.length !== saved.length) {
        await library.setItem(LIBRARY_KEY, validPrompts);
      }

      return validPrompts;
    } catch (error) {
      console.error('Error getting saved prompts:', error);
      return [];
    }
  }

  static async savePrompt(prompt: Omit<SavedPrompt, 'saved_at'>): Promise<boolean> {
    try {
      const saved = await this.getSavedPrompts();
      
      // Check if already saved (prevent duplicates)
      if (saved.some(p => p.id === prompt.id)) {
        return false; // Already saved
      }

      const newPrompt: SavedPrompt = {
        ...prompt,
        saved_at: new Date().toISOString()
      };

      saved.push(newPrompt);
      await library.setItem(LIBRARY_KEY, saved);
      return true;
    } catch (error) {
      console.error('Error saving prompt:', error);
      return false;
    }
  }

  static async removePrompt(promptId: string): Promise<boolean> {
    try {
      const saved = await this.getSavedPrompts();
      const filtered = saved.filter(p => p.id !== promptId);
      
      await library.setItem(LIBRARY_KEY, filtered);
      return true;
    } catch (error) {
      console.error('Error removing prompt:', error);
      return false;
    }
  }

  static async exportLibrary(): Promise<string> {
    try {
      const saved = await this.getSavedPrompts();
      return JSON.stringify(saved, null, 2);
    } catch (error) {
      console.error('Error exporting library:', error);
      return '[]';
    }
  }

  static async getLibraryStats(): Promise<{ count: number; oldestDate: string | null }> {
    try {
      const saved = await this.getSavedPrompts();
      const oldestDate = saved.length > 0 
        ? saved.reduce((oldest, prompt) => 
            prompt.saved_at < oldest ? prompt.saved_at : oldest, 
            saved[0].saved_at
          )
        : null;

      return {
        count: saved.length,
        oldestDate
      };
    } catch (error) {
      console.error('Error getting library stats:', error);
      return { count: 0, oldestDate: null };
    }
  }
}