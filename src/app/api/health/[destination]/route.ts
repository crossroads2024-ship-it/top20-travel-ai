import { NextRequest, NextResponse } from 'next/server';
import { getMockHealth } from '@/lib/mockData';

export async function GET(_req: NextRequest, { params }: { params: { destination: string } }) {
  try {
    return NextResponse.json(getMockHealth(params.destination));
  } catch {
    return NextResponse.json({ error: 'Health data unavailable' }, { status: 500 });
  }
}
