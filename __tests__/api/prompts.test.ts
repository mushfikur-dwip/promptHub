import { GET } from '@/app/api/prompts/route';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase');

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('/api/prompts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns prompts successfully', async () => {
    const mockPrompts = [
      {
        id: '1',
        title: 'Test Prompt',
        description: 'Test Description',
        content: 'Test Content',
        language: 'en',
        creator_name: 'Test Creator',
        creator_avatar: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        tags: [
          { tag: { id: '1', name: 'Test', created_at: '2024-01-01T00:00:00Z' } }
        ]
      }
    ];

    const mockRatings = [
      { prompt_id: '1', rating: 5 },
      { prompt_id: '1', rating: 4 }
    ];

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockPrompts,
          error: null
        })
      })
    } as any);

    // Mock ratings query
    mockSupabase.from.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockPrompts,
          error: null
        })
      })
    } as any).mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        in: jest.fn().mockResolvedValue({
          data: mockRatings,
          error: null
        })
      })
    } as any);

    const request = new NextRequest('http://localhost:3000/api/prompts');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Test Prompt');
    expect(data[0].rating_stats.average_rating).toBe(4.5);
    expect(data[0].rating_stats.total_ratings).toBe(2);
  });

  it('filters prompts by language', async () => {
    const mockPrompts = [
      {
        id: '1',
        title: 'English Prompt',
        language: 'en',
        tags: []
      },
      {
        id: '2',
        title: 'Bengali Prompt',
        language: 'bn',
        tags: []
      }
    ];

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [mockPrompts[1]], // Only Bengali prompt
            error: null
          })
        })
      })
    } as any);

    const request = new NextRequest('http://localhost:3000/api/prompts?language=bn');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Bengali Prompt');
  });

  it('filters prompts by tags', async () => {
    const mockPrompts = [
      {
        id: '1',
        title: 'SEO Prompt',
        tags: [
          { tag: { id: '1', name: 'SEO', created_at: '2024-01-01T00:00:00Z' } }
        ]
      },
      {
        id: '2',
        title: 'Marketing Prompt',
        tags: [
          { tag: { id: '2', name: 'Marketing', created_at: '2024-01-01T00:00:00Z' } }
        ]
      }
    ];

    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockPrompts,
          error: null
        })
      })
    } as any);

    const request = new NextRequest('http://localhost:3000/api/prompts?tags=seo');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('SEO Prompt');
  });

  it('handles database errors', async () => {
    mockSupabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' }
        })
      })
    } as any);

    const request = new NextRequest('http://localhost:3000/api/prompts');
    const response = await GET(request);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch prompts' });
  });
});