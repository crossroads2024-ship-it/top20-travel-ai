import { NextRequest, NextResponse } from 'next/server';
import { getMockHotels } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get('destination') || '';
  const checkin = searchParams.get('checkin') || '';
  const checkout = searchParams.get('checkout') || '';

  try {
    // Production: call Amadeus Hotels or Booking.com Affiliate API
    const hotels = getMockHotels();
    return NextResponse.json({ hotels, destination });
  } catch {
    return NextResponse.json({ error: 'Hotel search failed' }, { status: 500 });
  }
}
