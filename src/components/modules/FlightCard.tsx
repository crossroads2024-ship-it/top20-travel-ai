'use client';
import { useState } from 'react';
import { Plane, Clock, ExternalLink, Lock } from 'lucide-react';
import { Flight, UserTier } from '@/types';
import { formatPrice, confidenceBadge } from '@/lib/utils';
import { PaywallModal } from '@/components/ui/PaywallModal';

interface Props {
  flight: Flight;
  tier: UserTier;
  locked: boolean;
}

export function FlightCard({ flight: f, tier, locked }: Props) {
  const [showPaywall, setShowPaywall] = useState(false);
  const conf = confidenceBadge(f.priceConfidence);

  const handleBook = () => {
    if (locked) { setShowPaywall(true); return; }
    const consent = localStorage.getItem('top20_cookie_consent');
    const prefs = consent ? JSON.parse(consent) : {};
    const url = prefs.marketing ? `${f.bookingUrl}?ref=top20travel` : f.bookingUrl;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <>
      <div className={`card p-4 transition-all duration-150 ${locked ? 'opacity-60' : 'hover:shadow-md'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">
              {f.airlineCode}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{f.airline}</p>
              <p className="text-xs text-gray-500">{f.stops === 0 ? 'Direct' : `${f.stops} stop${f.stops > 1 ? 's' : ''}`}</p>
            </div>
          </div>
          {locked ? (
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <Lock className="w-4 h-4" /> Locked
            </div>
          ) : (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{formatPrice(f.price)}</div>
              <span className={`badge text-xs ${conf.color}`}>{conf.label}</span>
            </div>
          )}
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 mb-3">
          <div className="text-center">
            <p className="font-bold text-gray-900">{f.departTime}</p>
            <p className="text-xs text-gray-500">{f.from}</p>
          </div>
          <div className="flex-1 flex items-center gap-1">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" /> {f.duration}
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <Plane className="w-3 h-3 text-brand-500 rotate-90" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">{f.arriveTime}</p>
            <p className="text-xs text-gray-500">{f.to}</p>
          </div>
        </div>

        <button onClick={handleBook}
          className={`w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
            locked
              ? 'bg-gray-100 text-gray-500 cursor-pointer'
              : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}>
          {locked ? <><Lock className="w-3.5 h-3.5" /> Unlock to Book</> : <><ExternalLink className="w-3.5 h-3.5" /> Book Now</>}
        </button>
      </div>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} feature="All 20 flights" />}
    </>
  );
}
