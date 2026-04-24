'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchQuery, Destination, UserTier } from '@/types';
import { DestinationCard } from '@/components/modules/DestinationCard';
import { SearchingSkeleton } from '@/components/ui/Skeletons';
import { Filter, SortAsc } from 'lucide-react';

const FREE_LIMIT = 5;

export default function SearchPage() {
  const params = useSearchParams();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tier] = useState<UserTier>('free');
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'safety'>('score');

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const query: SearchQuery = {
        freeText: params.get('freeText') || undefined,
        from: params.get('from') || undefined,
        destination: params.get('destination') || undefined,
        budget: params.get('budget') ? Number(params.get('budget')) : undefined,
        departDate: params.get('departDate') || undefined,
        interests: params.get('interests') ? params.get('interests')!.split(',') : undefined,
        travelType: (params.get('travelType') as any) || undefined,
      };

      const res = await fetch('/api/ai/rank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setDestinations(data.destinations || []);
    } catch {
      setError('Could not load destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { runSearch(); }, [runSearch]);

  const sorted = [...destinations].sort((a, b) => {
    if (sortBy === 'price') return a.avgFlightPrice - b.avgFlightPrice;
    if (sortBy === 'safety') return b.scores.safety - a.scores.safety;
    return b.score - a.score;
  });

  const query = params.get('freeText') || params.get('destination') || 'your search';

  if (loading) return <SearchingSkeleton />;

  if (error) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="card p-8">
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={runSearch} className="btn-primary">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Top 20 results for <span className="text-brand-600">"{query}"</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {tier === 'free' ? `Showing 5 of ${destinations.length} results — ` : `All ${destinations.length} results — `}
            {tier === 'free' && <span className="text-brand-600 font-medium cursor-pointer hover:underline">Upgrade to unlock all 20</span>}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SortAsc className="w-4 h-4 text-gray-400" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="score">Overall score</option>
            <option value="price">Cheapest first</option>
            <option value="safety">Safest first</option>
          </select>
        </div>
      </div>

      {/* Free tier banner */}
      {tier === 'free' && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 mb-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-brand-800">
            <strong>You're on the free plan.</strong> Showing 5 of 20 destinations.
          </p>
          <a href="/pricing" className="btn-primary text-sm py-1.5 px-4">Unlock All 20 →</a>
        </div>
      )}

      {/* Results grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {sorted.map((d, i) => (
          <DestinationCard
            key={d.id}
            destination={d}
            tier={tier}
            isFree={tier === 'free' && i >= FREE_LIMIT}
          />
        ))}
      </div>

      {/* Bottom upgrade CTA */}
      {tier === 'free' && (
        <div className="mt-10 card p-8 text-center bg-gradient-to-br from-brand-50 to-white">
          <h3 className="text-xl font-bold text-gray-900 mb-2">See all 20 ranked destinations</h3>
          <p className="text-gray-500 text-sm mb-5">Plus full safety, visa, health, SIM and culture data for each one.</p>
          <a href="/pricing" className="btn-primary">Unlock Full Access — from $4/mo</a>
        </div>
      )}
    </div>
  );
}
