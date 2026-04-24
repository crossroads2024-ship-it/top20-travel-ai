import { SafetyData, VisaData, HealthData, WeatherData, CultureData, SimData, Hotel, Place, Flight } from '@/types';

// In production: replace each function with a real API call

export function getMockSafety(destination: string): SafetyData {
  const safeDestinations = ['lisbon', 'tokyo', 'barcelona', 'amsterdam', 'rome', 'prague', 'vienna', 'singapore', 'sydney', 'dubai'];
  const isSafe = safeDestinations.some(d => destination.toLowerCase().includes(d));
  return {
    destination,
    level: isSafe ? 'safe' : 'caution',
    score: isSafe ? 88 : 68,
    summary: isSafe
      ? 'This destination is generally safe for tourists. Normal precautions apply.'
      : 'Exercise increased caution. Petty crime in tourist areas. Avoid poorly-lit streets at night.',
    advisories: isSafe
      ? ['Pickpocketing in crowded areas — keep valuables secure', 'Standard travel insurance recommended']
      : ['Petty theft reported in tourist zones', 'Avoid displaying expensive items', 'Use official taxis only', 'Keep copies of travel documents'],
    embassyPresent: true,
    entryRestrictions: ['Valid passport required (6 months validity)', 'Return ticket may be requested on arrival'],
    source: 'UK FCDO / US State Department',
    updatedAt: new Date().toISOString(),
  };
}

export function getMockVisa(destination: string): VisaData {
  const visaFree = ['lisbon', 'barcelona', 'rome', 'amsterdam', 'prague', 'vienna', 'tokyo', 'singapore', 'cape-town', 'marrakech', 'mexico', 'medellin', 'chiang-mai', 'bangkok', 'santorini'];
  const eVisa = ['bali', 'dubai', 'istanbul', 'new-york', 'sydney'];
  const isVisaFree = visaFree.some(d => destination.toLowerCase().includes(d));
  const isEVisa = eVisa.some(d => destination.toLowerCase().includes(d));
  return {
    destination,
    requirement: isVisaFree ? 'free' : isEVisa ? 'evisa' : 'embassy',
    simplicity: isVisaFree ? 'free' : isEVisa ? 'evisa' : 'embassy',
    maxStayDays: isVisaFree ? 90 : 30,
    processingDays: isVisaFree ? 0 : isEVisa ? 2 : 14,
    cost: isVisaFree ? 0 : isEVisa ? 35 : 80,
    currency: 'USD',
    notes: isVisaFree
      ? 'No visa required for most Western passport holders for stays up to 90 days.'
      : isEVisa
      ? 'Apply online before travel at the official government portal. Usually processed within 48 hours.'
      : 'Visa application at embassy required. Allow 10-14 working days.',
    applyUrl: isEVisa ? 'https://www.evisa.gov' : undefined,
    source: 'Sherpa / Official Embassy Data',
    updatedAt: new Date().toISOString(),
  };
}

export function getMockHealth(destination: string): HealthData {
  const tropical = ['bangkok', 'bali', 'chiang-mai', 'marrakech', 'cape-town', 'medellin', 'mexico'];
  const isTropical = tropical.some(d => destination.toLowerCase().includes(d));
  return {
    destination,
    vaccinations: [
      { name: 'Hepatitis A', required: false, recommended: true },
      { name: 'Typhoid', required: false, recommended: isTropical },
      { name: 'Tetanus / Diphtheria', required: false, recommended: true },
      { name: 'COVID-19', required: false, recommended: true },
      { name: 'Yellow Fever', required: isTropical, recommended: isTropical },
    ],
    diseaseRisk: isTropical ? 'medium' : 'low',
    waterSafety: isTropical ? 'caution' : 'safe',
    medicines: isTropical
      ? ['Malaria prophylaxis (consult doctor)', 'Antihistamines', 'Oral rehydration sachets', 'Broad-spectrum antibiotics (prescription)', 'SPF 50+ sunscreen']
      : ['Antihistamines', 'Pain relief', 'Blister plasters', 'SPF 30+ sunscreen'],
    source: 'WHO / CDC Traveler Health',
    updatedAt: new Date().toISOString(),
  };
}

export function getMockWeather(destination: string): WeatherData {
  return {
    destination,
    current: { temp: 22, feelsLike: 20, condition: 'Partly Cloudy', humidity: 65, icon: 'partly-cloudy' },
    forecast: [
      { day: 'Mon', high: 24, low: 16, condition: 'Sunny', icon: 'sun' },
      { day: 'Tue', high: 22, low: 15, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
      { day: 'Wed', high: 19, low: 13, condition: 'Rain', icon: 'rain' },
      { day: 'Thu', high: 21, low: 14, condition: 'Cloudy', icon: 'cloud' },
      { day: 'Fri', high: 25, low: 17, condition: 'Sunny', icon: 'sun' },
    ],
  };
}

export function getMockCulture(destination: string): CultureData {
  return {
    destination,
    language: 'Local language',
    currency: 'Local currency',
    timezone: 'UTC+1',
    phrases: [
      { english: 'Hello', local: 'Olá', pronunciation: 'Oh-LAH' },
      { english: 'Thank you', local: 'Obrigado', pronunciation: 'Oh-bree-GAH-doo' },
      { english: 'Please', local: 'Por favor', pronunciation: 'Por fah-VOR' },
      { english: 'Excuse me', local: 'Com licença', pronunciation: 'Kom lee-SEN-sah' },
      { english: 'Where is...?', local: 'Onde fica...?', pronunciation: 'ON-deh FEE-kah' },
      { english: 'How much?', local: 'Quanto custa?', pronunciation: 'KWAN-too KOO-stah' },
    ],
    etiquette: [
      'Greet with a light handshake or kiss on both cheeks with acquaintances',
      'Dress modestly when visiting religious sites',
      'Tipping is appreciated but not mandatory',
      'Punctuality is flexible — being 15-30 mins late is culturally normal',
    ],
    taboos: [
      'Avoid discussing politics with strangers',
      'Do not photograph people without asking permission',
      'Don\'t be loud or disruptive in residential areas at night',
    ],
    tipping: '10% in restaurants is appreciated. Round up taxi fares.',
    dressCode: 'Smart casual in most settings. Cover shoulders and knees in churches.',
    greetings: 'A warm handshake is standard. Close friends kiss on both cheeks.',
  };
}

export function getMockSim(destination: string): SimData {
  return {
    destination,
    eSimAvailable: true,
    wifiQuality: 'good',
    options: [
      { provider: 'Airalo eSIM', type: 'esim', dataGB: 3, durationDays: 30, price: 9, currency: 'USD', coverage: 'good', buyUrl: 'https://www.airalo.com' },
      { provider: 'Airalo eSIM', type: 'esim', dataGB: 10, durationDays: 30, price: 18, currency: 'USD', coverage: 'excellent', buyUrl: 'https://www.airalo.com' },
      { provider: 'Holafly eSIM', type: 'esim', dataGB: 999, durationDays: 7, price: 19, currency: 'USD', coverage: 'good', buyUrl: 'https://www.holafly.com' },
      { provider: 'Local SIM (airport)', type: 'physical', dataGB: 5, durationDays: 30, price: 12, currency: 'USD', coverage: 'excellent', buyUrl: undefined },
    ],
  };
}

export function getMockHotels(): Hotel[] {
  return [
    { id: 'h1', name: 'The Grand Boutique Hotel', stars: 5, rating: 9.2, reviews: 1840, pricePerNight: 185, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', address: 'City Centre', amenities: ['Pool', 'Spa', 'Free WiFi', 'Breakfast'], bookingUrl: 'https://booking.com', rank: 1 },
    { id: 'h2', name: 'Riverside Retreat Hotel', stars: 4, rating: 8.8, reviews: 3210, pricePerNight: 125, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80', address: 'Old Town', amenities: ['Free WiFi', 'Bar', 'Restaurant', 'Gym'], bookingUrl: 'https://booking.com', rank: 2 },
    { id: 'h3', name: 'Urban Design Suites', stars: 4, rating: 8.5, reviews: 980, pricePerNight: 98, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', address: 'Arts District', amenities: ['Free WiFi', 'Breakfast', 'Rooftop terrace'], bookingUrl: 'https://booking.com', rank: 3 },
    { id: 'h4', name: 'Harbour View Apartments', stars: 3, rating: 8.1, reviews: 2450, pricePerNight: 72, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80', address: 'Waterfront', amenities: ['Free WiFi', 'Kitchen', 'Laundry'], bookingUrl: 'https://booking.com', rank: 4 },
    { id: 'h5', name: 'The Budget Traveler Hostel', stars: 2, rating: 7.8, reviews: 5600, pricePerNight: 32, currency: 'USD', imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80', address: 'Backpacker Zone', amenities: ['Free WiFi', 'Bar', 'Lockers', 'Tours desk'], bookingUrl: 'https://booking.com', rank: 5 },
  ];
}

export function getMockPlaces(): Place[] {
  return [
    { id: 'p1', name: 'Historic Old Town', type: 'Landmark', description: 'UNESCO-listed medieval quarter with centuries of history', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80', rank: 1 },
    { id: 'p2', name: 'Central Market Hall', type: 'Market', description: 'Vibrant indoor market with local produce, crafts and street food', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80', rank: 2 },
    { id: 'p3', name: 'National Museum', type: 'Museum', description: 'World-class collection spanning 3,000 years of civilisation', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80', rank: 3 },
    { id: 'p4', name: 'Sunset Viewpoint', type: 'Natural', description: 'Panoramic views over the city — best at golden hour', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', rank: 4 },
    { id: 'p5', name: 'Botanical Gardens', type: 'Park', description: 'Sprawling gardens with rare specimens from around the world', rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80', rank: 5 },
  ];
}

export function getMockFlights(from: string, to: string): Flight[] {
  const airlines = [
    { name: 'British Airways', code: 'BA' },
    { name: 'Ryanair', code: 'FR' },
    { name: 'EasyJet', code: 'U2' },
    { name: 'Lufthansa', code: 'LH' },
    { name: 'Emirates', code: 'EK' },
    { name: 'KLM', code: 'KL' },
    { name: 'Turkish Airlines', code: 'TK' },
  ];
  return Array.from({ length: 20 }, (_, i) => {
    const airline = airlines[i % airlines.length];
    const basePrice = 180 + (i * 35);
    const stops = i < 8 ? 0 : i < 14 ? 1 : 2;
    return {
      id: `f${i + 1}`,
      airline: airline.name,
      airlineCode: airline.code,
      from,
      to,
      departTime: `${String(6 + i).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
      arriveTime: `${String(10 + i).padStart(2, '0')}:${i % 2 === 0 ? '45' : '15'}`,
      duration: `${2 + stops}h ${stops * 30 + 45}m`,
      stops,
      price: basePrice,
      currency: 'USD',
      priceConfidence: i < 5 ? 'high' : i < 12 ? 'medium' : 'low',
      bookingUrl: 'https://amadeus.com',
      score: Math.max(30, 95 - (i * 4)),
      rank: i + 1,
    };
  });
}
