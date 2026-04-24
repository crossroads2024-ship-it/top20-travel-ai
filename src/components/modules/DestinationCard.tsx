'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Plane, Lock } from 'lucide-react';
import { Destination } from '@/types';
import { safetyColor, safetyLabel, visaColor, visaLabel, weatherIcon, formatPrice, scoreBar } from '@/lib/utils';
import { PaywallModal } from '@/components/ui/PaywallModal';
import { UserTier } from '@/types';

interface Props {
  destination: Destination;
  tier: UserTier;
  isFree: boolean; // locked?
}

export function DestinationCard({ destination: d, tier, isFree }: Props) {
  const [showPaywall, setShowPaywall] = useState(false);

  const card = (
    <div className={`card overflow-hidden group transition-all duration-200 ${!isFree ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'cursor-pointer'}`}>
      {/* Image */}
      <div className="relative h-44 bg-gray-200 overflow-hidden">
        <img src={d.imageUrl} alt={d.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Rank badge */}
        <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow font-bold text-brand-600 text-sm">
          #{d.rank}
        </div>
        {/* Score */}
        <div className="absolute top-3 right-3 bg-white/95 rounded-lg px-2 py-1 text-xs font-bold text-gray-800">
          {d.score}/100
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-lg leading-tight">{d.name}</h3>
          <p className="text-white/80 text-xs">{d.country}</p>
        </div>
        {/* Lock overlay */}
        {isFree && (
          <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center">
            <div className="bg-white/95 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
              <Lock className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-semibold text-gray-800">Unlock result</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">{d.tagline}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`badge border ${safetyColor(d.safety)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {safetyLabel(d.safety)}
          </span>
          <span className={`badge ${visaColor(d.visaType)}`}>
            {visaLabel(d.visaType)}
          </span>
          <span className="badge bg-gray-100 text-gray-600">
            {weatherIcon(d.weather.icon)} {d.weather.temp}°C
          </span>
        </div>

        {/* Score bars */}
        <div className="space-y-1.5 mb-3">
          {([['Price', d.scores.price], ['Safety', d.scores.safety], ['Weather', d.scores.weather]] as [string, number][]).map(([label, score]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-12">{label}</span>
              <div className="flex-1 score-bar">
                <div className={`h-full rounded-full transition-all ${scoreBar(score)}`} style={{ width: `${score}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-700 w-6 text-right">{score}</span>
            </div>
          ))}
        </div>

        {/* Flight price */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Plane className="w-3 h-3" />
            Flights from
          </div>
          <span className="font-bold text-gray-900">{formatPrice(d.avgFlightPrice)}</span>
        </div>
      </div>
    </div>
  );

  if (isFree) return (
    <>
      <div onClick={() => setShowPaywall(true)}>{card}</div>
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} feature="Full destination details" />}
    </>
  );

  return <Link href={`/destination/${d.id}`}>{card}</Link>;
}
