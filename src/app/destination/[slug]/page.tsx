'use client';
import { useEffect, useState } from 'react';
import { SafetyModule } from '@/components/modules/SafetyModule';
import { VisaModule, HealthModule, WeatherModule, CultureModule, SimModule } from '@/components/modules/DataModules';
import { FlightCard } from '@/components/modules/FlightCard';
import { ModuleCardSkeleton, FlightCardSkeleton } from '@/components/ui/Skeletons';
import { getMockSafety, getMockVisa, getMockHealth, getMockWeather, getMockCulture, getMockSim, getMockHotels, getMockPlaces, getMockFlights } from '@/lib/mockData';
import type { SafetyData, VisaData, HealthData, WeatherData, CultureData, SimData, Hotel, Place, Flight, UserTier } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plane, Shield, CloudSun, Stamp, Syringe, Languages, Wifi, BedDouble, MapPin, ArrowLeft, Share2, Star } from 'lucide-react';
import Link from 'next/link';

type Tab = 'overview' | 'flights' | 'stay' | 'explore';

export default function DestinationPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const dest = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [tier] = useState<UserTier>('free');

  const [safety, setSafety] = useState<SafetyData | null>(null);
  const [visa, setVisa] = useState<VisaData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [culture, setCulture] = useState<CultureData | null>(null);
  const [sim, setSim] = useState<SimData | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [hotels] = useState<Hotel[]>(getMockHotels());
  const [places] = useState<Place[]>(getMockPlaces());

  useEffect(() => {
    setLoading(true);
    // Parallel data fetch
    setSafety(getMockSafety(slug));
    setVisa(getMockVisa(slug));
    setHealth(getMockHealth(slug));
    setWeather(getMockWeather(slug));
    setCulture(getMockCulture(slug));
    setSim(getMockSim(slug));
    setFlights(getMockFlights('London', dest));
    setTimeout(() => setLoading(false), 600);
  }, [slug]);

  const tabs: { id: Tab; label: string; icon: typeof Plane }[] = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'flights', label: 'Flights', icon: Plane },
    { id: 'stay', label: 'Hotels', icon: BedDouble },
    { id: 'explore', label: 'Explore', icon: MapPin },
  ];

  const FREE_FLIGHT_LIMIT = tier === 'free' ? 5 : 20;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/search" className="btn-ghost p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{dest}</h1>
          {safety && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`badge border text-xs ${safety.level === 'safe' ? 'text-green-700 bg-green-100 border-green-200' : 'text-amber-700 bg-amber-100 border-amber-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${safety.level === 'safe' ? 'bg-green-500' : 'bg-amber-500'}`} />
                {safety.level === 'safe' ? 'Safe to visit' : 'Exercise caution'}
              </span>
              {weather && <span className="text-sm text-gray-500">{weather.current.temp}°C · {weather.current.condition}</span>}
            </div>
          )}
        </div>
        <button onClick={() => navigator.share?.({ title: dest, url: window.location.href })}
          className="btn-ghost p-2">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
              tab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ModuleCardSkeleton key={i} />)
          ) : (
            <>
              {safety && <SafetyModule data={safety} />}
              {visa && <VisaModule data={visa} />}
              {health && <HealthModule data={health} />}
              {weather && <WeatherModule data={weather} />}
              {culture && <CultureModule data={culture} />}
              {sim && <SimModule data={sim} />}
            </>
          )}
        </div>
      )}

      {/* Flights tab */}
      {tab === 'flights' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Top {FREE_FLIGHT_LIMIT} flights to {dest}</h2>
            {tier === 'free' && (
              <a href="/pricing" className="text-xs text-brand-600 font-medium hover:underline">Unlock all 20 →</a>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <FlightCardSkeleton key={i} />)
              : flights.slice(0, 20).map((f, i) => (
                <FlightCard key={f.id} flight={f} tier={tier} locked={tier === 'free' && i >= 5} />
              ))
            }
          </div>
        </div>
      )}

      {/* Hotels tab */}
      {tab === 'stay' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map(h => (
            <div key={h.id} className="card overflow-hidden card-hover">
              <img src={h.imageUrl} alt={h.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{h.name}</h3>
                  <div className="flex items-center gap-0.5">
                    {'★'.repeat(h.stars).split('').map((s, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <span className="font-bold text-green-700 text-sm">{h.rating}</span>
                  <span className="text-xs text-gray-500">({h.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {h.amenities.slice(0, 3).map(a => (
                    <span key={a} className="badge bg-gray-100 text-gray-600 text-xs">{a}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900">{formatPrice(h.pricePerNight)}</span>
                    <span className="text-xs text-gray-500"> /night</span>
                  </div>
                  <a href={h.bookingUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs btn-primary py-1.5 px-3">Book →</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Explore tab */}
      {tab === 'explore' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {places.map(p => (
            <div key={p.id} className="card overflow-hidden flex gap-0">
              <img src={p.imageUrl} alt={p.name} className="w-32 h-full object-cover flex-shrink-0" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-brand-100 text-brand-700 text-xs">{p.type}</span>
                  <span className="text-xs text-amber-600 font-medium">★ {p.rating}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
