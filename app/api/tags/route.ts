import { NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/firebase-service';

export async function GET() {
  try {
    const tags = await FirebaseService.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}