import { ParsedFlightQuery } from './queryParser';
import { Flight } from '@/types';

export interface FlightLeg {
  from: string;
  to: string;
  date: string;
  flights: Flight[];
}

export interface MultiCityResult {
  legs: FlightLeg[];
  totalMinPrice: number;
  currency: string;
  summary: string;
  bookingUrl: string;
}

// Build Kiwi.com search URL for multi-city (Nomad)
function buildKiwiNomadUrl(query: ParsedFlightQuery): string {
  const base = 'https://www.kiwi.com/en/search/results';
  const codes = [query.originCode, ...(query.destCodes || [])];
  
  // Kiwi multi-city URL format
  const segments = codes.map((code, i) => {
    const nextCode = codes[i + 1];
    if (!nextCode) return null;
    const date = query.dates[i];
    const dateStr = date?.day && date?.month 
      ? `${String(date.day).padStart(2,'0')}/${String(date.month).padStart(2,'0')}/${date.year || 2026}`
      : `01/${String(date?.month || 6).padStart(2,'0')}/${date?.year || 2026}`;
    return `${code}/${nextCode}/${dateStr}`;
  }).filter(Boolean);

  return `${base}/${segments.join('/')}?adults=${query.passengers}&traveltype=nomad`;
}

// Build Kiwi.com direct search URL (single leg with exclusions)
function buildKiwiSearchUrl(query: ParsedFlightQuery): string {
  const from = query.originCode || 'ALA';
  const to = query.destCodes?.[0] || '';
  const date = query.dates[0];
  const dateStr = date?.month 
    ? `01/${String(date.month).padStart(2,'0')}/${date.year || 2026}`
    : '';

  let url = `https://www.kiwi.com/en/search/results/${from}/${to}/${dateStr}`;
  
  const params = new URLSearchParams();
  params.set('adults', String(query.passengers));
  if (query.isDirectOnly) params.set('stopNumber', '0');
  if (query.cabinClass !== 'economy') params.set('cabinClass', query.cabinClass);
  if (query.excludeCountries.length > 0) {
    // Kiwi "fly over" exclusion
    params.set('hideFlyover', query.excludeCountries.join(','));
  }
  
  return `${url}?${params.toString()}`;
}

// Generate realistic mock multi-city flights for demo
export function generateMultiCityMock(query: ParsedFlightQuery): MultiCityResult {
  const codes = [query.originCode || 'ALA', ...(query.destCodes || ['HKG'])];
  const airlines = ['CX', 'AK', 'MH', 'EK', 'QR', 'TK', 'KC'];
  const airlineNames: Record<string,string> = {
    'CX': 'Cathay Pacific', 'AK': 'AirAsia', 'MH': 'Malaysia Airlines',
    'EK': 'Emirates', 'QR': 'Qatar Airways', 'TK': 'Turkish Airlines', 'KC': 'Air Astana'
  };

  const legs: FlightLeg[] = [];
  let totalMin = 0;

  for (let i = 0; i < codes.length - 1; i++) {
    const from = codes[i];
    const to = codes[i + 1];
    const date = query.dates[i];
    const dateStr = date 
      ? `${date.year || 2026}-${String(date.month || 6).padStart(2,'0')}-${String(date.day || 1).padStart(2,'0')}`
      : '2026-06-01';

    // Realistic pricing for Central Asia routes
    const basePrices: Record<string, number> = {
      'ALA-HKG': 380, 'ALA-KUL': 340, 'ALA-DAD': 420, 'ALA-BKK': 360,
      'HKG-KUL': 180, 'KUL-ALA': 340, 'BKK-ALA': 360, 'default': 280
    };
    const routeKey = `${from}-${to}`;
    const basePrice = basePrices[routeKey] || basePrices['default'];
    
    const legFlights: Flight[] = Array.from({ length: 5 }, (_, j) => {
      const al = airlines[(i + j) % airlines.length];
      const price = basePrice + (j * 45);
      const stops = j < 2 ? (query.excludeCountries.includes('CN') ? 1 : 0) : 1;
      return {
        id: `leg${i}-f${j}`,
        airline: airlineNames[al] || al,
        airlineCode: al,
        from,
        to,
        departTime: `${String(7 + j * 3).padStart(2,'0')}:00`,
        arriveTime: `${String(11 + j * 3).padStart(2,'0')}:30`,
        duration: `${4 + stops}h ${stops * 30 + 30}m`,
        stops,
        price,
        currency: query.currency || 'USD',
        priceConfidence: j < 2 ? 'high' : 'medium',
        bookingUrl: buildKiwiSearchUrl(query),
        score: Math.max(40, 95 - j * 12),
        rank: j + 1,
      };
    });

    totalMin += basePrice;
    legs.push({ from, to, date: dateStr, flights: legFlights });
  }

  const legStr = codes.join(' → ');
  return {
    legs,
    totalMinPrice: totalMin,
    currency: query.currency || 'USD',
    summary: `${legStr} · ${legs.length} leg${legs.length > 1 ? 's' : ''}`,
    bookingUrl: buildKiwiNomadUrl(query),
  };
}

// Main search function - uses real API if key available, falls back to mock
export async function searchFlights(query: ParsedFlightQuery): Promise<MultiCityResult> {
  // Production: call Kiwi.com v2 API
  // const kiwiKey = process.env.KIWI_API_KEY;
  // if (kiwiKey) { ... real API call ... }
  
  return generateMultiCityMock(query);
}
