// ─── User / Auth ─────────────────────────────────────────────────────────────
export type UserTier = 'free' | 'basic' | 'pro';

export interface UserSession {
  token: string;
  tier: UserTier;
  email?: string;
  createdAt: number;
  expiresAt: number;
}

// ─── Search ───────────────────────────────────────────────────────────────────
export interface SearchQuery {
  from?: string;
  destination?: string;
  budget?: number;
  currency?: string;
  departDate?: string;
  returnDate?: string;
  interests?: string[];
  travelers?: number;
  travelType?: 'solo' | 'couple' | 'family' | 'group' | 'business';
  freeText?: string;
}

// ─── Flights ─────────────────────────────────────────────────────────────────
export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  stops: number;
  price: number;
  currency: string;
  priceConfidence: 'low' | 'medium' | 'high';
  bookingUrl: string;
  score: number;
  rank: number;
}

// ─── Destination ─────────────────────────────────────────────────────────────
export type SafetyLevel = 'safe' | 'caution' | 'high_risk' | 'do_not_travel';

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  region: string;
  imageUrl: string;
  tagline: string;
  score: number;
  rank: number;
  scores: {
    price: number;
    safety: number;
    weather: number;
    interest: number;
  };
  safety: SafetyLevel;
  visaType: 'free' | 'evisa' | 'embassy';
  avgFlightPrice: number;
  currency: string;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
}

// ─── Safety ───────────────────────────────────────────────────────────────────
export interface SafetyData {
  destination: string;
  level: SafetyLevel;
  score: number;
  summary: string;
  advisories: string[];
  embassyPresent: boolean;
  entryRestrictions: string[];
  source: string;
  updatedAt: string;
}

// ─── Visa ─────────────────────────────────────────────────────────────────────
export interface VisaData {
  destination: string;
  requirement: 'free' | 'evisa' | 'embassy' | 'restricted';
  simplicity: 'free' | 'evisa' | 'embassy';
  maxStayDays: number;
  processingDays?: number;
  cost?: number;
  currency?: string;
  notes: string;
  applyUrl?: string;
  source: string;
  updatedAt: string;
}

// ─── Health ───────────────────────────────────────────────────────────────────
export interface HealthData {
  destination: string;
  vaccinations: { name: string; required: boolean; recommended: boolean }[];
  diseaseRisk: 'low' | 'medium' | 'high';
  waterSafety: 'safe' | 'caution' | 'unsafe';
  medicines: string[];
  source: string;
  updatedAt: string;
}

// ─── Weather ─────────────────────────────────────────────────────────────────
export interface WeatherData {
  destination: string;
  current: { temp: number; feelsLike: number; condition: string; humidity: number; icon: string };
  forecast: { day: string; high: number; low: number; condition: string; icon: string }[];
}

// ─── Culture ─────────────────────────────────────────────────────────────────
export interface CultureData {
  destination: string;
  language: string;
  currency: string;
  timezone: string;
  phrases: { english: string; local: string; pronunciation: string }[];
  etiquette: string[];
  taboos: string[];
  tipping: string;
  dressCode: string;
  greetings: string;
}

// ─── SIM ─────────────────────────────────────────────────────────────────────
export interface SimOption {
  provider: string;
  type: 'physical' | 'esim';
  dataGB: number;
  durationDays: number;
  price: number;
  currency: string;
  coverage: 'excellent' | 'good' | 'fair';
  buyUrl?: string;
}

export interface SimData {
  destination: string;
  options: SimOption[];
  eSimAvailable: boolean;
  wifiQuality: 'excellent' | 'good' | 'fair' | 'poor';
}

// ─── Hotels ──────────────────────────────────────────────────────────────────
export interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  reviews: number;
  pricePerNight: number;
  currency: string;
  imageUrl: string;
  address: string;
  amenities: string[];
  bookingUrl: string;
  rank: number;
}

// ─── Places ──────────────────────────────────────────────────────────────────
export interface Place {
  id: string;
  name: string;
  type: string;
  description: string;
  rating: number;
  imageUrl: string;
  rank: number;
}

// ─── Comparison ──────────────────────────────────────────────────────────────
export interface ComparisonResult {
  destinations: Destination[];
  winner: { overall: string; budget: string; safety: string; weather: string };
}

// ─── AI Response ─────────────────────────────────────────────────────────────
export interface AIRankingResponse {
  destinations: Destination[];
  reasoning: string;
  generatedAt: string;
}
