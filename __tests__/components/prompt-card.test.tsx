import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PromptCard } from '@/components/prompt-card';
import { useUserLibrary } from '@/hooks/use-user-library';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/hooks/use-user-library');
jest.mock('sonner');
jest.mock('next/navigation');

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

const mockPrompt = {
  id: '1',
  title: 'Test Prompt',
  description: 'This is a test prompt description',
  content: 'This is the test prompt content',
  language: 'en',
  creator_name: 'Test Creator',
  creator_avatar: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  tags: [
    { id: '1', name: 'Test', created_at: '2024-01-01T00:00:00Z' },
    { id: '2', name: 'Example', created_at: '2024-01-01T00:00:00Z' },
  ],
  rating_stats: {
    average_rating: 4.5,
    total_ratings: 10,
  },
};

const mockUseUserLibrary = {
  savePrompt: jest.fn(),
  isPromptSaved: jest.fn(() => false),
};

beforeEach(() => {
  (useUserLibrary as jest.Mock).mockReturnValue(mockUseUserLibrary);
  jest.clearAllMocks();
});

describe('PromptCard', () => {
  it('renders prompt information correctly', () => {
    render(<PromptCard prompt={mockPrompt} />);
    
    expect(screen.getByText('Test Prompt')).toBeInTheDocument();
    expect(screen.getByText('This is a test prompt description')).toBeInTheDocument();
    expect(screen.getByText('Test Creator')).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('shows rating information when available', () => {
    render(<PromptCard prompt={mockPrompt} />);
    
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });

  it('copies content to clipboard when copy button is clicked', async () => {
    render(<PromptCard prompt={mockPrompt} />);
    
    const copyButton = screen.getByTitle('Copy to clipboard').closest('button');
    fireEvent.click(copyButton!);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockPrompt.content);
      expect(toast.success).toHaveBeenCalledWith('Copied to clipboard!', expect.any(Object));
    });
  });

  it('saves prompt to library when save button is clicked', async () => {
    render(<PromptCard prompt={mockPrompt} />);
    
    const saveButton = screen.getByTitle('Save to library').closest('button');
    fireEvent.click(saveButton!);
    
    await waitFor(() => {
      expect(mockUseUserLibrary.savePrompt).toHaveBeenCalledWith({
        id: mockPrompt.id,
        title: mockPrompt.title,
        description: mockPrompt.description,
        content: mockPrompt.content,
        language: mockPrompt.language,
        creator_name: mockPrompt.creator_name,
        creator_avatar: mockPrompt.creator_avatar,
      });
    });
  });

  it('opens ChatGPT when try button is clicked', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    
    render(<PromptCard prompt={mockPrompt} />);
    
    const tryButton = screen.getByTitle('Try in ChatGPT').closest('button');
    fireEvent.click(tryButton!);
    
    expect(openSpy).toHaveBeenCalledWith(
      `https://chat.openai.com/?q=${encodeURIComponent(mockPrompt.content)}`,
      '_blank',
      'noopener,noreferrer'
    );
    
    openSpy.mockRestore();
  });

  it('shows expand/collapse button for long content', () => {
    const longPrompt = {
      ...mockPrompt,
      content: 'A'.repeat(400), // Long content
    };
    
    render(<PromptCard prompt={longPrompt} />);
    
    expect(screen.getByText('Show More')).toBeInTheDocument();
  });

  it('expands content when show more is clicked', () => {
    const longPrompt = {
      ...mockPrompt,
      content: 'A'.repeat(400),
    };
    
    render(<PromptCard prompt={longPrompt} />);
    
    const showMoreButton = screen.getByText('Show More');
    fireEvent.click(showMoreButton);
    
    expect(screen.getByText('Show Less')).toBeInTheDocument();
  });

  it('indicates when prompt is already saved', () => {
    mockUseUserLibrary.isPromptSaved.mockReturnValue(true);
    
    render(<PromptCard prompt={mockPrompt} />);
    
    expect(screen.getByTitle('Already saved')).toBeInTheDocument();
  });
});