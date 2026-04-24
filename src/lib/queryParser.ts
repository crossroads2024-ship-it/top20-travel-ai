// NLP Flight Query Parser
// Converts natural language like "cheapest Almaty to Da Nang June no China transit"
// into a structured FlightQuery object

export interface ParsedFlightQuery {
  origin: string;         // IATA code or city name
  originCode?: string;    // resolved IATA
  destinations: string[]; // one or more destinations
  destCodes?: string[];
  dates: ParsedDate[];
  returnDate?: ParsedDate;
  isMultiCity: boolean;
  isDirectOnly: boolean;
  excludeCountries: string[];  // e.g. ["CN"] for no China transit
  excludeAirlines?: string[];
  budget?: number;
  currency: string;
  passengers: number;
  cabinClass: 'economy' | 'business' | 'first';
  flexibleDates: boolean;
  flexDays: number;
  tripType: 'oneway' | 'roundtrip' | 'multicity';
  rawQuery: string;
}

export interface ParsedDate {
  day?: number;
  month?: number;
  year?: number;
  monthName?: string;
  raw: string;
}

// Airport/city code lookup table
const CITY_TO_IATA: Record<string, string> = {
  'almaty': 'ALA', 'almatы': 'ALA', 'алматы': 'ALA',
  'hong kong': 'HKG', 'hongkong': 'HKG', 'hk': 'HKG',
  'kuala lumpur': 'KUL', 'kl': 'KUL', 'malaysia': 'KUL',
  'da nang': 'DAD', 'danang': 'DAD', 'đà nẵng': 'DAD',
  'hanoi': 'HAN', 'ho chi minh': 'SGN', 'saigon': 'SGN',
  'bangkok': 'BKK', 'bkk': 'BKK',
  'tokyo': 'NRT', 'osaka': 'KIX',
  'singapore': 'SIN', 'sgp': 'SIN',
  'dubai': 'DXB', 'uae': 'DXB',
  'london': 'LHR', 'paris': 'CDG', 'rome': 'FCO',
  'barcelona': 'BCN', 'amsterdam': 'AMS', 'berlin': 'BER',
  'istanbul': 'IST', 'moscow': 'SVO', 'астана': 'NQZ',
  'astana': 'NQZ', 'nur-sultan': 'NQZ', 'нур-султан': 'NQZ',
  'bishkek': 'FRU', 'tashkent': 'TAS', 'baku': 'GYD',
  'tbilisi': 'TBS', 'yerevan': 'EVN',
  'new york': 'JFK', 'nyc': 'JFK', 'los angeles': 'LAX',
  'sydney': 'SYD', 'melbourne': 'MEL',
  'beijing': 'PEK', 'shanghai': 'PVG', 'guangzhou': 'CAN',
  'seoul': 'ICN', 'busan': 'PUS',
  'taipei': 'TPE', 'bali': 'DPS', 'jakarta': 'CGK',
  'phuket': 'HKT', 'chiang mai': 'CNX',
  'colombo': 'CMB', 'delhi': 'DEL', 'mumbai': 'BOM',
  'kathmandu': 'KTM', 'dhaka': 'DAC',
  'doha': 'DOH', 'riyadh': 'RUH', 'abu dhabi': 'AUH',
  'cairo': 'CAI', 'nairobi': 'NBO', 'cape town': 'CPT',
  'johannesburg': 'JNB',
};

// Country exclusion keywords
const COUNTRY_EXCLUSIONS: Record<string, string[]> = {
  'china': ['CN'],
  'chinese': ['CN'],
  'russia': ['RU'],
  'russian': ['RU'],
  'iran': ['IR'],
  'north korea': ['KP'],
};

// Month name to number
const MONTH_MAP: Record<string, number> = {
  jan: 1, january: 1, янв: 1, январь: 1,
  feb: 2, february: 2, фев: 2, февраль: 2,
  mar: 3, march: 3, мар: 3, март: 3,
  apr: 4, april: 4, апр: 4, апрель: 4,
  may: 5, май: 5,
  jun: 6, june: 6, июн: 6, июнь: 6,
  jul: 7, july: 7, июл: 7, июль: 7,
  aug: 8, august: 8, авг: 8, август: 8,
  sep: 9, september: 9, сен: 9, сентябрь: 9,
  oct: 10, october: 10, окт: 10, октябрь: 10,
  nov: 11, november: 11, ноя: 11, ноябрь: 11,
  dec: 12, december: 12, дек: 12, декабрь: 12,
};

function resolveIATA(city: string): string {
  const key = city.toLowerCase().trim();
  return CITY_TO_IATA[key] || city.toUpperCase().substring(0, 3);
}

export function parseFlightQuery(input: string): ParsedFlightQuery {
  const raw = input;
  const text = input.toLowerCase();
  const year = new Date().getFullYear();

  // ── Trip type detection ──────────────────────────────────────
  const isMultiCity = 
    (text.match(/then|→|->|after that|next|followed by/g) || []).length >= 1 ||
    (text.match(/\bto\b/g) || []).length >= 2;

  const isReturn = /return|back|round.?trip|roundtrip|обратно|туда.?обратно/.test(text);

  // ── Origin extraction ────────────────────────────────────────
  let origin = 'ALA'; // default to Almaty for Kazakhstan users
  const fromMatch = text.match(/from\s+([a-zA-Zа-яА-Я\s]+?)(?:\s+to|\s+→|\s+->|\s+on|\s+in|\s+,|$)/);
  if (fromMatch) origin = fromMatch[1].trim();
  
  // Check for city names directly
  for (const [city] of Object.entries(CITY_TO_IATA)) {
    if (text.startsWith(city) || text.includes('from ' + city)) {
      origin = city;
      break;
    }
  }

  // ── Destination extraction ───────────────────────────────────
  const destinations: string[] = [];

  // Multi-city: "to X then Y then Z" or "X → Y → Z"
  const arrowPattern = /([a-zA-Zа-яА-Я\s]+?)\s*(?:→|->)\s*([a-zA-Zа-яА-Я\s]+?)(?:\s*(?:→|->)\s*([a-zA-Zа-яА-Я\s]+?))?/;
  const arrowMatch = input.match(arrowPattern);
  if (arrowMatch) {
    if (arrowMatch[1]) destinations.push(arrowMatch[1].trim());
    if (arrowMatch[2]) destinations.push(arrowMatch[2].trim());
    if (arrowMatch[3]) destinations.push(arrowMatch[3].trim());
  }

  if (destinations.length === 0) {
    // Single destination "to X"
    const toMatch = text.match(/to\s+([a-zA-Zа-яА-Я\s]+?)(?:\s+on|\s+in|\s+then|\s+,|$)/);
    if (toMatch) destinations.push(toMatch[1].trim());
  }

  // ── Date extraction ──────────────────────────────────────────
  const dates: ParsedDate[] = [];

  // "on 3rd July", "July 3", "3 July", "3 июля"
  const datePatterns = [
    /(?:on\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)/gi,
    /(?:on\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?/gi,
    /(\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/g,
  ];

  for (const pattern of datePatterns) {
    let m;
    while ((m = pattern.exec(text)) !== null) {
      const isMonthFirst = isNaN(Number(m[1]));
      const monthStr = isMonthFirst ? m[1].toLowerCase() : m[2].toLowerCase();
      const dayNum = isMonthFirst ? parseInt(m[2]) : parseInt(m[1]);
      const monthNum = MONTH_MAP[monthStr] || parseInt(monthStr);
      
      if (monthNum) {
        dates.push({
          day: dayNum || undefined,
          month: monthNum,
          year,
          monthName: monthStr,
          raw: m[0],
        });
      }
    }
  }

  // Month-only: "in June", "June", "в июне"
  if (dates.length === 0) {
    for (const [monthKey, monthNum] of Object.entries(MONTH_MAP)) {
      if (text.includes(monthKey)) {
        dates.push({ month: monthNum, year, monthName: monthKey, raw: monthKey });
        break;
      }
    }
  }

  // ── Return date ──────────────────────────────────────────────
  let returnDate: ParsedDate | undefined;
  if (dates.length >= 2) {
    returnDate = dates[dates.length - 1];
  }
  if (isReturn && !returnDate && dates.length === 1) {
    returnDate = { month: (dates[0].month || 1) + 1, year, raw: 'auto' };
  }

  // ── Transit exclusions ───────────────────────────────────────
  const excludeCountries: string[] = [];
  for (const [keyword, codes] of Object.entries(COUNTRY_EXCLUSIONS)) {
    if (text.includes(keyword) && (
      text.includes('no ' + keyword) ||
      text.includes('not via ' + keyword) ||
      text.includes('avoid ' + keyword) ||
      text.includes('without ' + keyword) ||
      text.includes('skip ' + keyword) ||
      text.includes('no transit via ' + keyword) ||
      text.includes('not through ' + keyword)
    )) {
      excludeCountries.push(...codes);
    }
  }

  // ── Direct flights ───────────────────────────────────────────
  const isDirectOnly = /direct|non.?stop|nonstop|без пересадок|прямой/.test(text);

  // ── Budget ───────────────────────────────────────────────────
  const budgetMatch = text.match(/(?:\$|usd|kzt|тенге|£|€)\s*(\d+(?:[,\s]\d+)?)/);
  const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/[,\s]/g, '')) : undefined;

  // ── Currency ─────────────────────────────────────────────────
  const currency = 
    text.includes('kzt') || text.includes('тенге') || text.includes('тг') ? 'KZT' :
    text.includes('£') ? 'GBP' :
    text.includes('€') ? 'EUR' : 'USD';

  // ── Cabin class ──────────────────────────────────────────────
  const cabinClass: 'economy' | 'business' | 'first' =
    text.includes('business') ? 'business' :
    text.includes('first class') ? 'first' : 'economy';

  // ── Passengers ───────────────────────────────────────────────
  const passMatch = text.match(/(\d+)\s*(?:passengers?|adults?|people|persons?|человек|взрослых)/);
  const passengers = passMatch ? parseInt(passMatch[1]) : 1;

  // ── Flexible dates ───────────────────────────────────────────
  const flexibleDates = /flexible|±|plus.?minus|around|approximately|±\s*\d/.test(text);
  const flexMatch = text.match(/±\s*(\d+)/);
  const flexDays = flexMatch ? parseInt(flexMatch[1]) : 3;

  // ── Trip type ────────────────────────────────────────────────
  const tripType: 'oneway' | 'roundtrip' | 'multicity' =
    isMultiCity && destinations.length > 1 ? 'multicity' :
    isReturn ? 'roundtrip' : 'oneway';

  // ── Resolve IATA codes ───────────────────────────────────────
  const originCode = resolveIATA(origin);
  const destCodes = (destinations || []).map(resolveIATA);

  return {
    origin,
    originCode,
    destinations,
    destCodes,
    dates,
    returnDate,
    isMultiCity: tripType === 'multicity',
    isDirectOnly,
    excludeCountries,
    budget,
    currency,
    passengers,
    cabinClass,
    flexibleDates,
    flexDays,
    tripType,
    rawQuery: raw,
  };
}

// Format parsed query back to human-readable summary
export function formatQuerySummary(q: ParsedFlightQuery): string {
  const parts: string[] = [];
  
  if (q.tripType === 'multicity') {
    const legs = [q.originCode, ...(q.destCodes ?? [])].join(' → ');
    parts.push(legs);
  } else {
    parts.push(`${q.originCode} → ${(q.destCodes ?? [])[0] || '?'}`);
  }

  if (q.dates.length > 0) {
    const d = q.dates[0];
    parts.push(d.day ? `${d.day} ${d.monthName}` : d.monthName || '');
  }

  if (q.returnDate) {
    parts.push(`→ back ${q.returnDate.day ? q.returnDate.day + ' ' : ''}${q.returnDate.monthName || ''}`);
  }

  if (q.excludeCountries.length > 0) parts.push(`(no ${q.excludeCountries.join('/')} transit)`);
  if (q.isDirectOnly) parts.push('direct only');
  if (q.budget) parts.push(`budget $${q.budget}`);
  if (q.passengers > 1) parts.push(`${q.passengers} passengers`);

  return parts.filter(Boolean).join(' · ');
}
