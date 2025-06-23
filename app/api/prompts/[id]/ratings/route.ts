import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/firebase-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ratings = await FirebaseService.getRatings(params.id);
    return NextResponse.json(ratings || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { user_id, rating, comment } = body;

    if (!user_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating data' }, { status: 400 });
    }

    const newRating = await FirebaseService.addRating({
      prompt_id: params.id,
      user_id,
      rating,
      comment: comment || null
    });

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'You have already rated this prompt') {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}