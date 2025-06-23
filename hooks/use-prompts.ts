import useSWR from 'swr';
import { type PromptWithStats } from '@/lib/firebase-service';

interface UsePromptsParams {
  tags?: string[];
  language?: string;
}

const fetcher = async (url: string): Promise<PromptWithStats[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch prompts');
  }
  return response.json();
};

export function usePrompts({ tags = [], language = '' }: UsePromptsParams = {}) {
  // Build query parameters
  const params = new URLSearchParams();
  if (tags.length > 0) {
    params.append('tags', tags.join(','));
  }
  if (language) {
    params.append('language', language);
  }
  
  const url = `/api/prompts${params.toString() ? `?${params.toString()}` : ''}`;
  
  return useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute
  });
}