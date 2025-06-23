import useSWR from 'swr';
import { FirebaseService, type Tag } from '@/lib/firebase-service';

interface TagWithCount extends Tag {
  count: number;
}

const getTagsFromPrompts = async (): Promise<TagWithCount[]> => {
  const prompts = await FirebaseService.getPrompts();
  const tagCounts: Record<string, number> = {};

  prompts.forEach(prompt => {
    prompt.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts).map(([name, count]) => ({
    id: name,
    name,
    count,
    created_at: new Date().toISOString(), // Placeholder for created_at
  }));
};
const fetcher = async (): Promise<TagWithCount[]> => {
  return getTagsFromPrompts();
};

export function useTags() {
  return useSWR('tags', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });
}