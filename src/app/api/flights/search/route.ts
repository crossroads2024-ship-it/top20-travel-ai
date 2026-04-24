import { NextRequest, NextResponse } from 'next/server';
import { getMockFlights } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') || 'London';
  const to = searchParams.get('to') || 'Lisbon';
  const date = searchParams.get('date') || '';

  try {
    // Production: call Amadeus API here
    // const amadeusRes = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${date}&adults=1`, { headers: { Authorization: `Bearer ${amadeusToken}` }});
    const flights = getMockFlights(from, to);
    return NextResponse.json({ flights, meta: { from, to, date, total: flights.length } });
  } catch (err) {
    return NextResponse.json({ error: 'Flight search failed' }, { status: 500 });
  }
}
