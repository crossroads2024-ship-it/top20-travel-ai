import { NextRequest, NextResponse } from 'next/server';
import { getMockCulture } from '@/lib/mockData';

export async function GET(_req: NextRequest, { params }: { params: { destination: string } }) {
  try {
    return NextResponse.json(getMockCulture(params.destination));
  } catch {
    return NextResponse.json({ error: 'Culture data unavailable' }, { status: 500 });
  }
}
