export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  language: string;
  creator_name: string;
  creator_avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  prompt_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface PromptWithTags extends Prompt {
  tags: Tag[];
  rating_stats: {
    average_rating: number;
    total_ratings: number;
  };
}

// Sample data
const tags: Tag[] = [
  { id: '1', name: 'SEO', created_at: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Copywriting', created_at: '2024-01-01T00:00:00Z' },
  { id: '3', name: 'Bengali', created_at: '2024-01-01T00:00:00Z' },
  { id: '4', name: 'Funny', created_at: '2024-01-01T00:00:00Z' },
  { id: '5', name: 'Business', created_at: '2024-01-01T00:00:00Z' },
  { id: '6', name: 'Creative Writing', created_at: '2024-01-01T00:00:00Z' },
  { id: '7', name: 'Marketing', created_at: '2024-01-01T00:00:00Z' },
  { id: '8', name: 'Education', created_at: '2024-01-01T00:00:00Z' },
  { id: '9', name: 'Technical', created_at: '2024-01-01T00:00:00Z' },
  { id: '10', name: 'Social Media', created_at: '2024-01-01T00:00:00Z' },
  { id: '11', name: 'Email', created_at: '2024-01-01T00:00:00Z' },
  { id: '12', name: 'Content Strategy', created_at: '2024-01-01T00:00:00Z' },
  { id: '13', name: 'Productivity', created_at: '2024-01-01T00:00:00Z' },
  { id: '14', name: 'Analysis', created_at: '2024-01-01T00:00:00Z' },
  { id: '15', name: 'Translation', created_at: '2024-01-01T00:00:00Z' },
];

const prompts: Prompt[] = [
  {
    id: '1',
    title: 'SEO Blog Post Generator',
    description: 'Create engaging, SEO-optimized blog posts on any topic with proper structure and keywords.',
    content: `Write a comprehensive, SEO-optimized blog post about [TOPIC]. Include:

1. An attention-grabbing headline
2. Meta description (150-160 characters)
3. Introduction with hook
4. 3-4 main sections with H2 subheadings
5. Conclusion with call-to-action
6. Naturally integrate the keyword "[KEYWORD]" 3-5 times
7. Use a conversational yet professional tone
8. Target 1000-1500 words

Make it valuable for readers while being search engine friendly.`,
    language: 'en',
    creator_name: 'Sarah Johnson',
    creator_avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'বাংলা কবিতা লেখক',
    description: 'বিভিন্ন বিষয়ে সুন্দর বাংলা কবিতা রচনা করুন।',
    content: `[বিষয়] নিয়ে একটি সুন্দর বাংলা কবিতা লিখুন। কবিতাটি যেন:

১. ১২-১৬ লাইনের হয়
২. উপযুক্ত ছন্দ ও মিল থাকে
৩. বাংলা সাহিত্যের ঐতিহ্য বজায় রাখে
৪. আবেগপূর্ণ ও হৃদয়স্পর্শী হয়
৫. সহজ ও সুন্দর ভাষায় রচিত হয়

কবিতার শেষে একটি সংক্ষিপ্ত ব্যাখ্যাও দিন।`,
    language: 'bn',
    creator_name: 'রাহুল দাস',
    creator_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    title: 'Social Media Caption Creator',
    description: 'Generate engaging captions for social media posts that drive engagement and conversions.',
    content: `Create 5 different engaging social media captions for [PLATFORM] about [TOPIC/PRODUCT]. Each caption should:

1. Be platform-appropriate length
2. Include relevant hashtags (3-5 for Instagram, 1-2 for others)
3. Have a clear call-to-action
4. Use emojis strategically
5. Match the brand voice: [BRAND_VOICE]

Variations to include:
- Question-based caption
- Story/narrative caption  
- List/tip-based caption
- Behind-the-scenes caption
- User-generated content style

Make them thumb-stopping and engagement-driving!`,
    language: 'en',
    creator_name: 'Mike Chen',
    creator_avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z'
  },
  {
    id: '4',
    title: 'Email Marketing Template',
    description: 'Professional email templates for various marketing campaigns with high conversion rates.',
    content: `Write a compelling marketing email for [CAMPAIGN_TYPE] with the following structure:

Subject Line: Create 3 options (A/B test ready)
Preview Text: Compelling 40-50 characters

Email Body:
1. Personal greeting
2. Opening hook (problem/pain point)
3. Solution presentation with benefits
4. Social proof (testimonial/stats)
5. Clear call-to-action button
6. Urgency/scarcity element
7. Professional closing

Requirements:
- Keep paragraphs short (2-3 sentences)
- Use conversational tone
- Include [COMPANY_NAME] and [OFFER_DETAILS]
- Mobile-friendly formatting
- Compliance with email marketing laws`,
    language: 'en',
    creator_name: 'Emma Rodriguez',
    creator_avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-12T14:10:00Z',
    updated_at: '2024-01-12T14:10:00Z'
  },
  {
    id: '5',
    title: 'Code Documentation Writer',
    description: 'Generate comprehensive technical documentation for code projects and APIs.',
    content: `Create detailed technical documentation for [PROJECT/API_NAME]. Include:

## Overview
- Brief description and purpose
- Key features and capabilities
- Target audience

## Getting Started
- Prerequisites and requirements
- Installation steps
- Quick start guide with examples

## API Reference (if applicable)
- Endpoint listings
- Request/response formats
- Authentication methods
- Error codes and handling

## Code Examples
- Common use cases with code snippets
- Best practices
- Common pitfalls to avoid

## Configuration
- Environment setup
- Configuration options
- Deployment considerations

Use clear, concise language. Include code blocks with syntax highlighting. Make it beginner-friendly while being comprehensive.`,
    language: 'en',
    creator_name: 'Alex Kumar',
    creator_avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-11T11:30:00Z',
    updated_at: '2024-01-11T11:30:00Z'
  },
  {
    id: '6',
    title: 'Product Description Optimizer',
    description: 'Create compelling product descriptions that convert browsers into buyers.',
    content: `Write a persuasive product description for [PRODUCT_NAME]. Structure it as follows:

**Headline**: Benefit-focused title (5-8 words)

**Opening Hook**: Address the main problem this product solves

**Key Features** (3-5 bullet points):
- Feature → Benefit format
- Focus on outcomes, not just specs
- Use power words and emotional triggers

**Social Proof**: Include testimonial placeholder or trust signals

**Technical Details**: 
- Specifications in easy-to-scan format
- Compatibility information
- What's included in the package

**Call-to-Action**: Create urgency and remove purchase friction

**SEO Keywords**: Naturally integrate [PRIMARY_KEYWORD] and [SECONDARY_KEYWORDS]

Tone: [BRAND_VOICE] | Target: [TARGET_AUDIENCE] | Price Point: [PRICE_RANGE]`,
    language: 'en',
    creator_name: 'Lisa Park',
    creator_avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
    created_at: '2024-01-10T16:45:00Z',
    updated_at: '2024-01-10T16:45:00Z'
  }
];

const promptTags: { prompt_id: string; tag_id: string }[] = [
  { prompt_id: '1', tag_id: '1' }, // SEO Blog Post - SEO
  { prompt_id: '1', tag_id: '2' }, // SEO Blog Post - Copywriting
  { prompt_id: '1', tag_id: '7' }, // SEO Blog Post - Marketing
  { prompt_id: '2', tag_id: '3' }, // Bengali Poetry - Bengali
  { prompt_id: '2', tag_id: '6' }, // Bengali Poetry - Creative Writing
  { prompt_id: '3', tag_id: '10' }, // Social Media - Social Media
  { prompt_id: '3', tag_id: '7' }, // Social Media - Marketing
  { prompt_id: '3', tag_id: '2' }, // Social Media - Copywriting
  { prompt_id: '4', tag_id: '11' }, // Email Marketing - Email
  { prompt_id: '4', tag_id: '7' }, // Email Marketing - Marketing
  { prompt_id: '4', tag_id: '2' }, // Email Marketing - Copywriting
  { prompt_id: '5', tag_id: '9' }, // Code Documentation - Technical
  { prompt_id: '6', tag_id: '2' }, // Product Description - Copywriting
  { prompt_id: '6', tag_id: '7' }, // Product Description - Marketing
  { prompt_id: '6', tag_id: '1' }, // Product Description - SEO
];

const ratings: Rating[] = [
  {
    id: '1',
    prompt_id: '1',
    user_id: 'user_123',
    rating: 5,
    comment: 'Excellent prompt! Helped me create amazing blog posts that rank well on Google.',
    created_at: '2024-01-16T08:30:00Z'
  },
  {
    id: '2',
    prompt_id: '1',
    user_id: 'user_456',
    rating: 4,
    comment: 'Very detailed and professional. Just what I needed for my content strategy.',
    created_at: '2024-01-16T10:15:00Z'
  },
  {
    id: '3',
    prompt_id: '2',
    user_id: 'user_789',
    rating: 5,
    comment: 'চমৎকার! এই প্রম্পট দিয়ে অনেক সুন্দর কবিতা লিখতে পেরেছি।',
    created_at: '2024-01-15T14:20:00Z'
  },
  {
    id: '4',
    prompt_id: '3',
    user_id: 'user_101',
    rating: 4,
    comment: 'Great for social media content creation. Saves me so much time!',
    created_at: '2024-01-14T12:45:00Z'
  },
  {
    id: '5',
    prompt_id: '4',
    user_id: 'user_202',
    rating: 5,
    comment: 'My email open rates improved significantly after using this template structure.',
    created_at: '2024-01-13T16:30:00Z'
  },
  {
    id: '6',
    prompt_id: '6',
    user_id: 'user_303',
    rating: 4,
    comment: 'Really helpful for e-commerce product descriptions. Increased our conversion rate!',
    created_at: '2024-01-12T09:15:00Z'
  }
];

// Local storage keys
const PROMPTS_KEY = 'local_prompts';
const RATINGS_KEY = 'local_ratings';
const NEXT_ID_KEY = 'next_prompt_id';

// Initialize data in localStorage if not exists
if (typeof window !== 'undefined') {
  if (!localStorage.getItem(PROMPTS_KEY)) {
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  }
  if (!localStorage.getItem(RATINGS_KEY)) {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  }
  if (!localStorage.getItem(NEXT_ID_KEY)) {
    localStorage.setItem(NEXT_ID_KEY, '7');
  }
}

export class LocalDataService {
  // Get all prompts with tags and ratings
  static async getPrompts(filters: { tags?: string[]; language?: string } = {}): Promise<PromptWithTags[]> {
    if (typeof window === 'undefined') return [];
    
    const storedPrompts = JSON.parse(localStorage.getItem(PROMPTS_KEY) || '[]') as Prompt[];
    const storedRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]') as Rating[];
    
    let filteredPrompts = storedPrompts;
    
    // Apply language filter
    if (filters.language) {
      filteredPrompts = filteredPrompts.filter(p => p.language === filters.language);
    }
    
    // Transform prompts with tags and ratings
    const promptsWithTags: PromptWithTags[] = filteredPrompts.map(prompt => {
      // Get tags for this prompt
      const promptTagIds = promptTags
        .filter(pt => pt.prompt_id === prompt.id)
        .map(pt => pt.tag_id);
      const promptTagsData = tags.filter(tag => promptTagIds.includes(tag.id));
      
      // Get ratings for this prompt
      const promptRatings = storedRatings.filter(r => r.prompt_id === prompt.id);
      const totalRatings = promptRatings.length;
      const averageRating = totalRatings > 0 
        ? promptRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0;
      
      return {
        ...prompt,
        tags: promptTagsData,
        rating_stats: {
          average_rating: averageRating,
          total_ratings: totalRatings
        }
      };
    });
    
    // Apply tag filters (AND logic)
    if (filters.tags && filters.tags.length > 0) {
      return promptsWithTags.filter(prompt => 
        filters.tags!.every(filterTag => 
          prompt.tags.some(promptTag => 
            promptTag.name.toLowerCase() === filterTag.toLowerCase()
          )
        )
      );
    }
    
    return promptsWithTags.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  
  // Get single prompt by ID
  static async getPrompt(id: string): Promise<PromptWithTags | null> {
    const prompts = await this.getPrompts();
    return prompts.find(p => p.id === id) || null;
  }
  
  // Create new prompt
  static async createPrompt(promptData: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>, tagNames: string[] = []): Promise<Prompt> {
    if (typeof window === 'undefined') throw new Error('Not in browser environment');
    
    const storedPrompts = JSON.parse(localStorage.getItem(PROMPTS_KEY) || '[]') as Prompt[];
    const nextId = localStorage.getItem(NEXT_ID_KEY) || '7';
    
    const newPrompt: Prompt = {
      ...promptData,
      id: nextId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    storedPrompts.push(newPrompt);
    localStorage.setItem(PROMPTS_KEY, JSON.stringify(storedPrompts));
    localStorage.setItem(NEXT_ID_KEY, (parseInt(nextId) + 1).toString());
    
    // Add tags if provided
    if (tagNames.length > 0) {
      tagNames.forEach(tagName => {
        const normalizedName = tagName.trim().toLowerCase();
        let tag = tags.find(t => t.name.toLowerCase() === normalizedName);
        
        if (!tag) {
          // Create new tag
          tag = {
            id: (tags.length + 1).toString(),
            name: tagName.trim(),
            created_at: new Date().toISOString()
          };
          tags.push(tag);
        }
        
        // Add prompt-tag association
        if (!promptTags.some(pt => pt.prompt_id === newPrompt.id && pt.tag_id === tag!.id)) {
          promptTags.push({
            prompt_id: newPrompt.id,
            tag_id: tag.id
          });
        }
      });
    }
    
    return newPrompt;
  }
  
  // Get all tags with usage count
  static async getTags(): Promise<(Tag & { count: number })[]> {
    const tagsWithCount = tags.map(tag => ({
      ...tag,
      count: promptTags.filter(pt => pt.tag_id === tag.id).length
    }));
    
    return tagsWithCount
      .filter(tag => tag.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }
  
  // Get ratings for a prompt
  static async getRatings(promptId: string): Promise<Rating[]> {
    if (typeof window === 'undefined') return [];
    
    const storedRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]') as Rating[];
    return storedRatings
      .filter(r => r.prompt_id === promptId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  // Add rating
  static async addRating(ratingData: Omit<Rating, 'id' | 'created_at'>): Promise<Rating> {
    if (typeof window === 'undefined') throw new Error('Not in browser environment');
    
    const storedRatings = JSON.parse(localStorage.getItem(RATINGS_KEY) || '[]') as Rating[];
    
    // Check if user already rated this prompt
    const existingRating = storedRatings.find(r => 
      r.prompt_id === ratingData.prompt_id && r.user_id === ratingData.user_id
    );
    
    if (existingRating) {
      throw new Error('You have already rated this prompt');
    }
    
    const newRating: Rating = {
      ...ratingData,
      id: (storedRatings.length + 1).toString(),
      created_at: new Date().toISOString()
    };
    
    storedRatings.push(newRating);
    localStorage.setItem(RATINGS_KEY, JSON.stringify(storedRatings));
    
    return newRating;
  }
  
  // Get rating stats for a prompt
  static async getRatingStats(promptId: string): Promise<{
    average_rating: number;
    total_ratings: number;
    ratings_distribution: Record<number, number>;
  }> {
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
  }
}