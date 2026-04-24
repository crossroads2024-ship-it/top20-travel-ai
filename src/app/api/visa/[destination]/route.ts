import { NextRequest, NextResponse } from 'next/server';
import { getMockVisa } from '@/lib/mockData';

export async function GET(_req: NextRequest, { params }: { params: { destination: string } }) {
  try {
    const data = getMockVisa(params.destination);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Visa data unavailable' }, { status: 500 });
  }
}
