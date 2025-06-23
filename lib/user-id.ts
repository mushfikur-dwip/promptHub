// Generate and manage anonymous user IDs for ratings
const USER_ID_KEY = 'prompt_app_user_id';

export function getUserId(): string {
  if (typeof window === 'undefined') {
    return 'server_user'; // Server-side fallback
  }

  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    // Generate a new anonymous user ID
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

export function hasRated(promptId: string, ratings: any[]): boolean {
  const userId = getUserId();
  return ratings.some((rating: any) => rating.user_id === userId);
}