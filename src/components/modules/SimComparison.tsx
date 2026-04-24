'use client';
import { useState } from 'react';
import { Wifi, ExternalLink, Trophy, Zap, Globe } from 'lucide-react';

interface SimPlan {
  provider: string;
  type: 'esim' | 'physical';
  dataGB: number | 'unlimited';
  durationDays: number;
  priceUSD: number;
  coverage: 'excellent' | 'good' | 'fair';
  countries: string[];        // ISO country codes covered
  affiliateUrl: string;
  commission: string;
  logo: string;
}

// Real affiliate data - sign up at each provider's partner portal
const SIM_PROVIDERS: Record<string, SimPlan[]> = {
  'TH': [ // Thailand
    { provider: 'Airalo', type: 'esim', dataGB: 3, durationDays: 30, priceUSD: 8, coverage: 'good', countries: ['TH'], affiliateUrl: 'https://ref.airalo.com/top20travel?destination=TH', commission: '10%', logo: '📱' },
    { provider: 'Airalo', type: 'esim', dataGB: 10, durationDays: 30, priceUSD: 16, coverage: 'excellent', countries: ['TH'], affiliateUrl: 'https://ref.airalo.com/top20travel?destination=TH', commission: '10%', logo: '📱' },
    { provider: 'Holafly', type: 'esim', dataGB: 'unlimited', durationDays: 7, priceUSD: 17, coverage: 'good', countries: ['TH'], affiliateUrl: 'https://esim.holafly.com/?coupon=TOP20', commission: '8%', logo: '🌐' },
    { provider: 'Nomad', type: 'esim', dataGB: 10, durationDays: 30, priceUSD: 14, coverage: 'good', countries: ['TH'], affiliateUrl: 'https://www.getnomad.app/top20', commission: '10%', logo: '🗺️' },
  ],
  'MY': [ // Malaysia
    { provider: 'Airalo', type: 'esim', dataGB: 5, durationDays: 30, priceUSD: 10, coverage: 'excellent', countries: ['MY'], affiliateUrl: 'https://ref.airalo.com/top20travel?destination=MY', commission: '10%', logo: '📱' },
    { provider: 'Holafly', type: 'esim', dataGB: 'unlimited', durationDays: 15, priceUSD: 24, coverage: 'good', countries: ['MY'], affiliateUrl: 'https://esim.holafly.com/?coupon=TOP20', commission: '8%', logo: '🌐' },
    { provider: 'Nomad', type: 'esim', dataGB: 5, durationDays: 30, priceUSD: 9, coverage: 'excellent', countries: ['MY'], affiliateUrl: 'https://www.getnomad.app/top20', commission: '10%', logo: '🗺️' },
  ],
  'HK': [ // Hong Kong
    { provider: 'Airalo', type: 'esim', dataGB: 1, durationDays: 7, priceUSD: 5, coverage: 'excellent', countries: ['HK'], affiliateUrl: 'https://ref.airalo.com/top20travel?destination=HK', commission: '10%', logo: '📱' },
    { provider: 'Airalo', type: 'esim', dataGB: 5, durationDays: 30, priceUSD: 13, coverage: 'excellent', countries: ['HK'], affiliateUrl: 'https://ref.airalo.com/top20travel?destination=HK', commission: '10%', logo: '📱' },
    { provider: 'Nomad', type: 'esim', dataGB: 3, durationDays: 30, priceUSD: 10, coverage: 'excellent', countries: ['HK'], affiliateUrl: 'https://www.getnomad.app/top20', commission: '10%', logo: '🗺️' },
  ],
  // Asia regional packs (work in multiple countries)
  'ASIA': [
    { provider: 'Airalo', type: 'esim', dataGB: 10, durationDays: 30, priceUSD: 22, coverage: 'good', countries: ['TH', 'MY', 'HK', 'SG', 'JP', 'KR', 'VN', 'ID'], affiliateUrl: 'https://ref.airalo.com/top20travel?destination=ASIA', commission: '10%', logo: '📱' },
    { provider: 'Holafly', type: 'esim', dataGB: 'unlimited', durationDays: 30, priceUSD: 49, coverage: 'good', countries: ['TH', 'MY', 'HK', 'SG', 'JP', 'VN'], affiliateUrl: 'https://esim.holafly.com/?coupon=TOP20', commission: '8%', logo: '🌐' },
    { provider: 'Nomad', type: 'esim', dataGB: 20, durationDays: 30, priceUSD: 30, coverage: 'excellent', countries: ['TH', 'MY', 'HK', 'SG', 'JP', 'KR'], affiliateUrl: 'https://www.getnomad.app/top20', commission: '10%', logo: '🗺️' },
  ],
};

function getPlansForCountry(countryCode: string): SimPlan[] {
  return SIM_PROVIDERS[countryCode] || SIM_PROVIDERS['TH'] || [];
}

function getRegionalPlan(countryCodes: string[]): SimPlan[] {
  return SIM_PROVIDERS['ASIA'] || [];
}

function calculateBundleSaving(destinations: string[], days: number): {
  individual: number;
  regional: number;
  saving: number;
  recommended: string;
} {
  let individualTotal = 0;
  for (const dest of destinations) {
    const plans = getPlansForCountry(dest);
    const cheapest = plans.reduce((a, b) => a.priceUSD < b.priceUSD ? a : b, plans[0]);
    if (cheapest) individualTotal += cheapest.priceUSD;
  }

  const regionalPlans = getRegionalPlan(destinations);
  const cheapestRegional = regionalPlans.reduce((a, b) => a.priceUSD < b.priceUSD ? a : b, regionalPlans[0]);
  const regionalTotal = cheapestRegional?.priceUSD || individualTotal;

  return {
    individual: individualTotal,
    regional: regionalTotal,
    saving: Math.max(0, individualTotal - regionalTotal),
    recommended: regionalTotal < individualTotal ? 'regional' : 'individual',
  };
}

interface Props {
  destinations?: string[];      // For single destination
  countryCodes?: string[];       // For multi-city bundle
  tripDays?: number;
}

export function SimComparison({ destinations = [], countryCodes = [], tripDays = 7 }: Props) {
  const [view, setView] = useState<'single' | 'bundle'>('single');
  const [sortBy, setSortBy] = useState<'price' | 'data' | 'coverage'>('price');

  const isMultiDest = countryCodes.length > 1;
  const primaryCountry = countryCodes[0] || 'TH';
  const plans = getPlansForCountry(primaryCountry);
  const regionalPlans = getRegionalPlan(countryCodes);
  const bundle = isMultiDest ? calculateBundleSaving(countryCodes, tripDays) : null;

  const activePlans = view === 'bundle' ? regionalPlans : plans;
  const sorted = [...activePlans].sort((a, b) => {
    if (sortBy === 'price') return a.priceUSD - b.priceUSD;
    if (sortBy === 'data') {
      const aGB = a.dataGB === 'unlimited' ? 999 : a.dataGB;
      const bGB = b.dataGB === 'unlimited' ? 999 : b.dataGB;
      return bGB - aGB;
    }
    const cov = { excellent: 3, good: 2, fair: 1 };
    return cov[b.coverage] - cov[a.coverage];
  });

  const handleBuy = (plan: SimPlan) => {
    const consent = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('top20_cookie_consent') || '{}')
      : {};
    const url = consent.marketing 
      ? plan.affiliateUrl 
      : plan.affiliateUrl.split('?')[0];
    window.open(url, '_blank', 'noopener');
  };

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
          <Wifi className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">SIM & Connectivity</h3>
          <p className="text-xs text-gray-500">Compare all providers · Affiliate links</p>
        </div>
      </div>

      {/* Bundle calculator - only for multi-city */}
      {isMultiDest && bundle && (
        <div className={`rounded-xl p-3 mb-4 border ${
          bundle.recommended === 'regional' 
            ? 'bg-green-50 border-green-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-900">Trip SIM Bundle Calculator</span>
            {bundle.saving > 0 && (
              <span className="badge bg-green-100 text-green-700 text-xs ml-auto">
                Save ${bundle.saving}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <p className="text-gray-500 mb-0.5">3× country SIMs</p>
              <p className="font-bold text-gray-900">${bundle.individual}</p>
            </div>
            <div className={`rounded-lg p-2 border ${bundle.recommended === 'regional' ? 'border-green-400 bg-green-50' : 'bg-white border-gray-200'}`}>
              <p className="text-gray-500 mb-0.5 flex items-center gap-1">
                Asia regional pack
                {bundle.recommended === 'regional' && <Trophy className="w-3 h-3 text-amber-500" />}
              </p>
              <p className="font-bold text-green-700">${bundle.regional}</p>
            </div>
          </div>
          {bundle.recommended === 'regional' && (
            <p className="text-xs text-green-700 mt-2 font-medium">
              ✓ Regional pack saves you ${bundle.saving} and works across all your destinations
            </p>
          )}
        </div>
      )}

      {/* View toggle */}
      {isMultiDest && (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
          <button onClick={() => setView('single')}
            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${view === 'single' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            Single country
          </button>
          <button onClick={() => setView('bundle')}
            className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${view === 'bundle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
            Asia regional pack
          </button>
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-500">Sort by:</span>
        {(['price', 'data', 'coverage'] as const).map(s => (
          <button key={s} onClick={() => setSortBy(s)}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
              sortBy === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200'
            }`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Plans */}
      <div className="space-y-2">
        {sorted.map((plan, i) => (
          <div key={`${plan.provider}-${i}`}
            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
              i === 0 ? 'border-brand-200 bg-brand-50' : 'border-gray-200 bg-gray-50'
            }`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">{plan.logo}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-gray-900">{plan.provider}</span>
                  {i === 0 && (
                    <span className="badge bg-green-100 text-green-700 text-xs">
                      <Trophy className="w-2.5 h-2.5" /> Best value
                    </span>
                  )}
                  <span className={`badge text-xs ${
                    plan.coverage === 'excellent' ? 'bg-green-100 text-green-700' :
                    plan.coverage === 'good' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>{plan.coverage}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {plan.dataGB === 'unlimited' ? '∞ Unlimited' : `${plan.dataGB}GB`} · {plan.durationDays} days · {plan.type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">${plan.priceUSD}</span>
              <button onClick={() => handleBuy(plan)}
                className="flex items-center gap-1 text-xs bg-brand-600 text-white px-3 py-1.5 rounded-lg hover:bg-brand-700 transition-colors">
                Buy <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Affiliate links — we earn a small commission at no cost to you.
        <a href="/legal/affiliate" className="underline ml-1">Disclosure</a>
      </p>
    </div>
  );
}
