import { renderHook, act } from '@testing-library/react';
import { useUserLibrary } from '@/hooks/use-user-library';
import { UserLibrary } from '@/lib/user-library';
import { toast } from 'sonner';

jest.mock('@/lib/user-library');
jest.mock('sonner');

const mockUserLibrary = UserLibrary as jest.Mocked<typeof UserLibrary>;

const mockPrompt = {
  id: '1',
  title: 'Test Prompt',
  description: 'Test Description',
  content: 'Test Content',
  language: 'en',
  creator_name: 'Test Creator',
  creator_avatar: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUserLibrary', () => {
  it('loads saved prompts on mount', async () => {
    const mockSavedPrompts = [{ ...mockPrompt, saved_at: '2024-01-01T00:00:00Z' }];
    const mockStats = { count: 1, oldestDate: '2024-01-01T00:00:00Z' };
    
    mockUserLibrary.getSavedPrompts.mockResolvedValue(mockSavedPrompts);
    mockUserLibrary.getLibraryStats.mockResolvedValue(mockStats);
    
    const { result } = renderHook(() => useUserLibrary());
    
    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.savedPrompts).toEqual(mockSavedPrompts);
    expect(result.current.stats).toEqual(mockStats);
  });

  it('saves a prompt successfully', async () => {
    mockUserLibrary.getSavedPrompts.mockResolvedValue([]);
    mockUserLibrary.getLibraryStats.mockResolvedValue({ count: 0, oldestDate: null });
    mockUserLibrary.savePrompt.mockResolvedValue(true);
    
    const { result } = renderHook(() => useUserLibrary());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      const success = await result.current.savePrompt(mockPrompt);
      expect(success).toBe(true);
    });
    
    expect(mockUserLibrary.savePrompt).toHaveBeenCalledWith(mockPrompt);
    expect(toast.success).toHaveBeenCalledWith('Prompt saved to your library!');
  });

  it('handles duplicate save attempts', async () => {
    mockUserLibrary.getSavedPrompts.mockResolvedValue([]);
    mockUserLibrary.getLibraryStats.mockResolvedValue({ count: 0, oldestDate: null });
    mockUserLibrary.savePrompt.mockResolvedValue(false);
    
    const { result } = renderHook(() => useUserLibrary());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      const success = await result.current.savePrompt(mockPrompt);
      expect(success).toBe(false);
    });
    
    expect(toast.info).toHaveBeenCalledWith('Prompt is already in your library');
  });

  it('removes a prompt successfully', async () => {
    const mockSavedPrompts = [{ ...mockPrompt, saved_at: '2024-01-01T00:00:00Z' }];
    
    mockUserLibrary.getSavedPrompts.mockResolvedValue(mockSavedPrompts);
    mockUserLibrary.getLibraryStats.mockResolvedValue({ count: 1, oldestDate: '2024-01-01T00:00:00Z' });
    mockUserLibrary.removePrompt.mockResolvedValue(true);
    
    const { result } = renderHook(() => useUserLibrary());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    await act(async () => {
      const success = await result.current.removePrompt('1');
      expect(success).toBe(true);
    });
    
    expect(mockUserLibrary.removePrompt).toHaveBeenCalledWith('1');
    expect(toast.success).toHaveBeenCalledWith('Prompt removed from library');
  });

  it('correctly identifies saved prompts', async () => {
    const mockSavedPrompts = [{ ...mockPrompt, saved_at: '2024-01-01T00:00:00Z' }];
    
    mockUserLibrary.getSa
  }
  )
}
)