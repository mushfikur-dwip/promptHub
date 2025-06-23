import { NextRequest, NextResponse } from 'next/server';
import { FirebaseService } from '@/lib/firebase-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stats = await FirebaseService.getRatingStats(params.id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}