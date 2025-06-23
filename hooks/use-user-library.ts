import { useState, useEffect } from 'react';
import { UserLibrary, type SavedPrompt } from '@/lib/user-library';
import { toast } from 'sonner';

export function useUserLibrary() {
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{ count: number; oldestDate: string | null }>({
    count: 0,
    oldestDate: null
  });

  const loadLibrary = async () => {
    setIsLoading(true);
    try {
      const [prompts, libraryStats] = await Promise.all([
        UserLibrary.getSavedPrompts(),
        UserLibrary.getLibraryStats()
      ]);
      setSavedPrompts(prompts);
      setStats(libraryStats);
    } catch (error) {
      console.error('Failed to load library:', error);
      toast.error('Failed to load your library');
    } finally {
      setIsLoading(false);
    }
  };

  const savePrompt = async (prompt: Omit<SavedPrompt, 'saved_at'>) => {
    try {
      const success = await UserLibrary.savePrompt(prompt);
      if (success) {
        await loadLibrary(); // Refresh the list
        toast.success('Prompt saved to your library!');
        return true;
      } else {
        toast.info('Prompt is already in your library');
        return false;
      }
    } catch (error) {
      console.error('Failed to save prompt:', error);
      toast.error('Failed to save prompt');
      return false;
    }
  };

  const removePrompt = async (promptId: string) => {
    try {
      const success = await UserLibrary.removePrompt(promptId);
      if (success) {
        await loadLibrary(); // Refresh the list
        toast.success('Prompt removed from library');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove prompt:', error);
      toast.error('Failed to remove prompt');
      return false;
    }
  };

  const exportLibrary = async () => {
    try {
      const jsonData = await UserLibrary.exportLibrary();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prompt-library-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Library exported successfully!');
    } catch (error) {
      console.error('Failed to export library:', error);
      toast.error('Failed to export library');
    }
  };

  const isPromptSaved = (promptId: string) => {
    return savedPrompts.some(p => p.id === promptId);
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  return {
    savedPrompts,
    isLoading,
    stats,
    savePrompt,
    removePrompt,
    exportLibrary,
    isPromptSaved,
    refresh: loadLibrary
  };
}