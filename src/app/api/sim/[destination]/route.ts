import { NextRequest, NextResponse } from 'next/server';
import { getMockSim } from '@/lib/mockData';

export async function GET(_req: NextRequest, { params }: { params: { destination: string } }) {
  try {
    return NextResponse.json(getMockSim(params.destination));
  } catch {
    return NextResponse.json({ error: 'SIM data unavailable' }, { status: 500 });
  }
}
