import { NextRequest, NextResponse } from 'next/server';
import { getMockSafety } from '@/lib/mockData';

export async function GET(_req: NextRequest, { params }: { params: { destination: string } }) {
  try {
    const data = getMockSafety(params.destination);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Safety data unavailable' }, { status: 500 });
  }
}
