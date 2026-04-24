import { NextRequest, NextResponse } from 'next/server';
import { rankDestinations } from '@/lib/ai';
import { SearchQuery } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: SearchQuery = await req.json();
    const result = await rankDestinations(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('AI rank error:', err);
    return NextResponse.json({ error: 'Failed to rank destinations' }, { status: 500 });
  }
}
