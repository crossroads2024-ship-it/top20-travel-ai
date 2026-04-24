import { SearchQuery, AIRankingResponse, Destination, SafetyLevel } from '@/types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function rankDestinations(query: SearchQuery): Promise<AIRankingResponse> {
  const prompt = buildPrompt(query);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);
    return {
      destinations: parsed.destinations || [],
      reasoning: parsed.reasoning || '',
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return getFallbackDestinations(query);
  }
}

const SYSTEM_PROMPT = `You are Top20 Travel Intelligence AI. Your job is to rank the best travel destinations for a user based on their preferences.

You MUST respond with ONLY valid JSON in this exact format:
{
  "destinations": [
    {
      "id": "unique-slug",
      "name": "City Name",
      "country": "Country Name",
      "countryCode": "XX",
      "region": "Region/Continent",
      "imageUrl": "https://images.unsplash.com/photo-[relevant-id]?w=800&q=80",
      "tagline": "One compelling sentence about this destination",
      "score": 87,
      "rank": 1,
      "scores": { "price": 85, "safety": 90, "weather": 88, "interest": 86 },
      "safety": "safe",
      "visaType": "free",
      "avgFlightPrice": 320,
      "currency": "USD",
      "weather": { "temp": 24, "condition": "Sunny", "icon": "sun" }
    }
  ],
  "reasoning": "Brief explanation of ranking logic"
}

Safety levels: "safe", "caution", "high_risk", "do_not_travel"
Visa types: "free", "evisa", "embassy"
Weather icons: "sun", "cloud", "rain", "snow", "storm", "partly-cloudy"

Score each destination 0-100 based on:
- price_score: 35% weight (lower cost = higher score)
- safety_score: 25% weight
- weather_score: 20% weight
- interest_score: 20% weight (match to user interests)

Return exactly 20 destinations ranked 1-20. All scores must be realistic.`;

function buildPrompt(query: SearchQuery): string {
  const parts: string[] = [];

  if (query.freeText) parts.push(`User request: "${query.freeText}"`);
  if (query.from) parts.push(`Traveling from: ${query.from}`);
  if (query.destination) parts.push(`Preferred destination area: ${query.destination}`);
  if (query.budget) parts.push(`Budget: $${query.budget} USD total`);
  if (query.departDate) parts.push(`Departing: ${query.departDate}`);
  if (query.returnDate) parts.push(`Returning: ${query.returnDate}`);
  if (query.interests?.length) parts.push(`Interests: ${query.interests.join(', ')}`);
  if (query.travelType) parts.push(`Travel type: ${query.travelType}`);
  if (query.travelers) parts.push(`Number of travelers: ${query.travelers}`);

  return parts.join('\n') || 'Show me the best travel destinations right now';
}

// Fallback when API key not set or fails
function getFallbackDestinations(query: SearchQuery): AIRankingResponse {
  const destinations: Destination[] = [
    { id: 'lisbon-portugal', name: 'Lisbon', country: 'Portugal', countryCode: 'PT', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80', tagline: 'Charming hilltop city with pastel buildings and world-class cuisine', score: 91, rank: 1, scores: { price: 88, safety: 92, weather: 90, interest: 93 }, safety: 'safe', visaType: 'free', avgFlightPrice: 280, currency: 'USD', weather: { temp: 22, condition: 'Sunny', icon: 'sun' } },
    { id: 'bangkok-thailand', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80', tagline: 'Vibrant megacity of temples, street food and endless energy', score: 89, rank: 2, scores: { price: 95, safety: 78, weather: 82, interest: 91 }, safety: 'caution', visaType: 'free', avgFlightPrice: 520, currency: 'USD', weather: { temp: 32, condition: 'Partly cloudy', icon: 'partly-cloudy' } },
    { id: 'tokyo-japan', name: 'Tokyo', country: 'Japan', countryCode: 'JP', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', tagline: 'Where ancient tradition meets neon-lit futurism', score: 88, rank: 3, scores: { price: 72, safety: 98, weather: 80, interest: 95 }, safety: 'safe', visaType: 'free', avgFlightPrice: 750, currency: 'USD', weather: { temp: 18, condition: 'Clear', icon: 'sun' } },
    { id: 'barcelona-spain', name: 'Barcelona', country: 'Spain', countryCode: 'ES', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', tagline: 'Gaudí architecture, beaches and legendary nightlife', score: 87, rank: 4, scores: { price: 80, safety: 88, weather: 92, interest: 89 }, safety: 'safe', visaType: 'free', avgFlightPrice: 310, currency: 'USD', weather: { temp: 25, condition: 'Sunny', icon: 'sun' } },
    { id: 'bali-indonesia', name: 'Bali', country: 'Indonesia', countryCode: 'ID', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', tagline: 'Sacred temples, rice terraces and spiritual serenity', score: 86, rank: 5, scores: { price: 92, safety: 80, weather: 85, interest: 88 }, safety: 'caution', visaType: 'evisa', avgFlightPrice: 620, currency: 'USD', weather: { temp: 29, condition: 'Partly cloudy', icon: 'partly-cloudy' } },
    { id: 'amsterdam-netherlands', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&q=80', tagline: 'Canal-laced city of world-class museums and cycling culture', score: 85, rank: 6, scores: { price: 74, safety: 93, weather: 72, interest: 90 }, safety: 'safe', visaType: 'free', avgFlightPrice: 290, currency: 'USD', weather: { temp: 15, condition: 'Cloudy', icon: 'cloud' } },
    { id: 'marrakech-morocco', name: 'Marrakech', country: 'Morocco', countryCode: 'MA', region: 'Africa', imageUrl: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80', tagline: 'Ancient medina of souks, riads and Saharan mystique', score: 84, rank: 7, scores: { price: 91, safety: 76, weather: 88, interest: 85 }, safety: 'caution', visaType: 'free', avgFlightPrice: 250, currency: 'USD', weather: { temp: 28, condition: 'Sunny', icon: 'sun' } },
    { id: 'new-york-usa', name: 'New York City', country: 'USA', countryCode: 'US', region: 'Americas', imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', tagline: 'The city that never sleeps — culture, food and ambition at max volume', score: 83, rank: 8, scores: { price: 60, safety: 82, weather: 78, interest: 96 }, safety: 'safe', visaType: 'evisa', avgFlightPrice: 480, currency: 'USD', weather: { temp: 20, condition: 'Clear', icon: 'sun' } },
    { id: 'dubai-uae', name: 'Dubai', country: 'UAE', countryCode: 'AE', region: 'Middle East', imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', tagline: 'Ultra-modern skyline rising from the desert — luxury redefined', score: 82, rank: 9, scores: { price: 65, safety: 95, weather: 78, interest: 88 }, safety: 'safe', visaType: 'evisa', avgFlightPrice: 450, currency: 'USD', weather: { temp: 35, condition: 'Sunny', icon: 'sun' } },
    { id: 'cape-town-south-africa', name: 'Cape Town', country: 'South Africa', countryCode: 'ZA', region: 'Africa', imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80', tagline: 'Table Mountain, vineyards and the meeting of two oceans', score: 81, rank: 10, scores: { price: 82, safety: 65, weather: 90, interest: 89 }, safety: 'caution', visaType: 'free', avgFlightPrice: 680, currency: 'USD', weather: { temp: 20, condition: 'Clear', icon: 'sun' } },
    { id: 'rome-italy', name: 'Rome', country: 'Italy', countryCode: 'IT', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', tagline: '2,800 years of history on every cobblestone', score: 80, rank: 11, scores: { price: 75, safety: 88, weather: 88, interest: 92 }, safety: 'safe', visaType: 'free', avgFlightPrice: 320, currency: 'USD', weather: { temp: 24, condition: 'Sunny', icon: 'sun' } },
    { id: 'medellin-colombia', name: 'Medellín', country: 'Colombia', countryCode: 'CO', region: 'Americas', imageUrl: 'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800&q=80', tagline: 'City of Eternal Spring — tech hub meets tropical mountain beauty', score: 79, rank: 12, scores: { price: 95, safety: 68, weather: 92, interest: 84 }, safety: 'caution', visaType: 'free', avgFlightPrice: 420, currency: 'USD', weather: { temp: 22, condition: 'Partly cloudy', icon: 'partly-cloudy' } },
    { id: 'prague-czech-republic', name: 'Prague', country: 'Czech Republic', countryCode: 'CZ', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80', tagline: 'Fairy-tale medieval city with craft beer and baroque spires', score: 78, rank: 13, scores: { price: 84, safety: 90, weather: 70, interest: 86 }, safety: 'safe', visaType: 'free', avgFlightPrice: 270, currency: 'USD', weather: { temp: 16, condition: 'Cloudy', icon: 'cloud' } },
    { id: 'sydney-australia', name: 'Sydney', country: 'Australia', countryCode: 'AU', region: 'Oceania', imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80', tagline: 'Opera House, Bondi Beach and some of the world\'s best seafood', score: 77, rank: 14, scores: { price: 58, safety: 94, weather: 88, interest: 90 }, safety: 'safe', visaType: 'evisa', avgFlightPrice: 980, currency: 'USD', weather: { temp: 20, condition: 'Sunny', icon: 'sun' } },
    { id: 'istanbul-turkey', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', region: 'Europe/Asia', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80', tagline: 'The crossroads of civilisations — bazaars, domes and Bosphorus sunsets', score: 76, rank: 15, scores: { price: 88, safety: 70, weather: 78, interest: 88 }, safety: 'caution', visaType: 'evisa', avgFlightPrice: 340, currency: 'USD', weather: { temp: 20, condition: 'Partly cloudy', icon: 'partly-cloudy' } },
    { id: 'santorini-greece', name: 'Santorini', country: 'Greece', countryCode: 'GR', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80', tagline: 'White-washed cliffside villages above a volcano-formed caldera', score: 75, rank: 16, scores: { price: 62, safety: 92, weather: 95, interest: 90 }, safety: 'safe', visaType: 'free', avgFlightPrice: 380, currency: 'USD', weather: { temp: 26, condition: 'Sunny', icon: 'sun' } },
    { id: 'singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80', tagline: 'Immaculate global city-state — the gateway to Southeast Asia', score: 74, rank: 17, scores: { price: 60, safety: 99, weather: 74, interest: 85 }, safety: 'safe', visaType: 'free', avgFlightPrice: 680, currency: 'USD', weather: { temp: 30, condition: 'Partly cloudy', icon: 'partly-cloudy' } },
    { id: 'mexico-city-mexico', name: 'Mexico City', country: 'Mexico', countryCode: 'MX', region: 'Americas', imageUrl: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80', tagline: 'One of the world\'s great food cities with 3,000 years of history', score: 73, rank: 18, scores: { price: 90, safety: 62, weather: 80, interest: 88 }, safety: 'caution', visaType: 'free', avgFlightPrice: 380, currency: 'USD', weather: { temp: 22, condition: 'Clear', icon: 'sun' } },
    { id: 'vienna-austria', name: 'Vienna', country: 'Austria', countryCode: 'AT', region: 'Europe', imageUrl: 'https://images.unsplash.com/photo-1516550893885-985c836c5903?w=800&q=80', tagline: 'Imperial palaces, coffee houses and the world\'s finest classical music', score: 72, rank: 19, scores: { price: 70, safety: 95, weather: 68, interest: 84 }, safety: 'safe', visaType: 'free', avgFlightPrice: 295, currency: 'USD', weather: { temp: 14, condition: 'Cloudy', icon: 'cloud' } },
    { id: 'chiang-mai-thailand', name: 'Chiang Mai', country: 'Thailand', countryCode: 'TH', region: 'Asia', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', tagline: 'Ancient walled city, jungle treks and 300 Buddhist temples', score: 71, rank: 20, scores: { price: 96, safety: 76, weather: 80, interest: 83 }, safety: 'caution', visaType: 'free', avgFlightPrice: 540, currency: 'USD', weather: { temp: 28, condition: 'Partly cloudy', icon: 'partly-cloudy' } },
  ];

  return { destinations, reasoning: 'Showing curated top destinations. Add your API key for personalised AI rankings.', generatedAt: new Date().toISOString() };
}
