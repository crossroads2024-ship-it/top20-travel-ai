import { NextRequest, NextResponse } from 'next/server';
import { parseFlightQuery, formatQuerySummary } from '@/lib/queryParser';
import { searchFlights } from '@/lib/flightEngine';

export async function POST(req: NextRequest) {
  try {
    const { query, structured } = await req.json();

    // Parse natural language query
    const parsed = parseFlightQuery(query || '');
    
    // Override with structured fields if provided
    if (structured?.origin) parsed.originCode = structured.origin;
    if (structured?.destination) parsed.destCodes = [structured.destination];
    if (structured?.excludeTransit) parsed.excludeCountries = structured.excludeTransit;
    if (structured?.directOnly) parsed.isDirectOnly = structured.directOnly;

    // Execute flight search
    const result = await searchFlights(parsed);

    const { summary: _s, ...restResult } = result as any;
    return NextResponse.json({
      parsed,
      summary: formatQuerySummary(parsed),
      ...restResult,
    });
  } catch (err) {
    console.error('Flight search error:', err);
    return NextResponse.json({ error: 'Flight search failed' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';
  const parsed = parseFlightQuery(query);
  const result = await searchFlights(parsed);
  const { summary: _s2, ...rest } = result as any;
  return NextResponse.json({ parsed, summary: formatQuerySummary(parsed), ...rest });
}
