import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/firebase-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const language = searchParams.get('language') || '';

    const prompts = await FirebaseService.getPrompts({ tags, language });
    return NextResponse.json(prompts);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const language = formData.get('language') as string || 'en';
    const creator_name = formData.get('creator_name') as string || 'Anonymous';
    const creator_avatar = formData.get('creator_avatar') as string || null;
    const image_url = formData.get('image_url') as string || null;
    const tags = JSON.parse(formData.get('tags') as string || '[]');

    // Validation
    if (!title?.trim() || !description?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Title, description, and content are required' }, { status: 400 });
    }

    if (description.length > 200) {
      return NextResponse.json({ error: 'Description must be 200 characters or less' }, { status: 400 });
    }

    // Validate image URL if provided
    if (image_url && image_url.trim()) {
      try {
        new URL(image_url.trim());
      } catch {
        return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 });
      }
    }

    const promptData = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      language,
      creator_name: creator_name.trim(),
      creator_avatar: creator_avatar?.trim() || null,
      image_url: image_url?.trim() || null,
      tags: tags || []
    };

    const prompt = await FirebaseService.createPrompt(promptData);
    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}