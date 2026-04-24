'use client';
import { useState } from 'react';
import { Plus, X, Plane, ExternalLink, AlertTriangle, Loader2 } from 'lucide-react';
import { parseFlightQuery, formatQuerySummary } from '@/lib/queryParser';
import { formatPrice } from '@/lib/utils';

interface Leg {
  id: string;
  from: string;
  to: string;
  date: string;
}

interface FlightResult {
  legs: any[];
  totalMinPrice: number;
  currency: string;
  summary: string;
  bookingUrl: string;
  parsed?: any;
}

export function MultiCityBuilder() {
  const [mode, setMode] = useState<'natural' | 'builder'>('natural');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [legs, setLegs] = useState<Leg[]>([
    { id: '1', from: 'Almaty (ALA)', to: '', date: '' },
    { id: '2', from: '', to: '', date: '' },
  ]);
  const [excludeChina, setExcludeChina] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FlightResult | null>(null);
  const [parsedSummary, setParsedSummary] = useState('');

  const addLeg = () => {
    if (legs.length >= 5) return;
    const lastTo = legs[legs.length - 1]?.to || '';
    setLegs(l => [...l, { id: Date.now().toString(), from: lastTo, to: '', date: '' }]);
  };

  const removeLeg = (id: string) => {
    if (legs.length <= 2) return;
    setLegs(l => l.filter(leg => leg.id !== id));
  };

  const updateLeg = (id: string, field: keyof Leg, value: string) => {
    setLegs(l => l.map(leg => leg.id === id ? { ...leg, [field]: value } : leg));
  };

  const search = async () => {
    setLoading(true);
    setResult(null);

    try {
      const query = mode === 'natural' 
        ? naturalQuery
        : legs.map((l, i) => `${l.from} to ${l.to}${l.date ? ' on ' + l.date : ''}`).join(', then ');

      const extras = [];
      if (excludeChina) extras.push('no China transit');
      if (directOnly) extras.push('direct flights');
      
      const fullQuery = [query, ...extras].join(', ');

      const res = await fetch('/api/flights/smart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: fullQuery }),
      });

      const data = await res.json();
      setResult(data);
      if (data.parsed) setParsedSummary(data.summary || '');
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
          <Plane className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Smart Flight Search</h3>
          <p className="text-xs text-gray-500">Multi-city · Transit filters · NLP powered</p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {(['natural', 'builder'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
            }`}>
            {m === 'natural' ? '💬 Natural language' : '🗺️ Trip builder'}
          </button>
        ))}
      </div>

      {mode === 'natural' ? (
        <div>
          <textarea
            value={naturalQuery}
            onChange={e => setNaturalQuery(e.target.value)}
            placeholder="e.g. Almaty to Da Nang cheapest June, no transit via China&#10;or: Almaty → Hong Kong July 3rd → KL July 10th → Almaty August 1st"
            className="input-field min-h-[80px] resize-none text-sm"
            rows={3}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              'Almaty to Da Nang June no China transit',
              'ALA to HKG July 3rd then KL July 10th back to ALA Aug 1st',
              'Cheapest Almaty to Bangkok direct flights August',
              'Almaty to Bali return under $600',
            ].map(q => (
              <button key={q} onClick={() => setNaturalQuery(q)}
                className="text-xs px-2.5 py-1.5 bg-gray-50 text-gray-600 rounded-full hover:bg-brand-50 hover:text-brand-600 border border-gray-200 transition-all">
                {q.length > 40 ? q.substring(0, 38) + '…' : q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {legs.map((leg, i) => (
            <div key={leg.id} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
              <input
                type="text"
                value={leg.from}
                onChange={e => updateLeg(leg.id, 'from', e.target.value)}
                placeholder={i === 0 ? 'From (e.g. Almaty)' : 'From'}
                className="input-field text-sm py-2"
              />
              <input
                type="text"
                value={leg.to}
                onChange={e => updateLeg(leg.id, 'to', e.target.value)}
                placeholder="To (e.g. Hong Kong)"
                className="input-field text-sm py-2"
              />
              <input
                type="date"
                value={leg.date}
                onChange={e => updateLeg(leg.id, 'date', e.target.value)}
                className="input-field text-sm py-2 w-36"
              />
              {legs.length > 2 && (
                <button onClick={() => removeLeg(leg.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button onClick={addLeg} disabled={legs.length >= 5}
            className="flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:text-brand-700 disabled:opacity-40">
            <Plus className="w-4 h-4" /> Add destination
          </button>
        </div>
      )}

      {/* Options */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={excludeChina} onChange={e => setExcludeChina(e.target.checked)}
            className="rounded text-brand-600" />
          <span className="text-sm text-gray-700">No China transit 🇨🇳</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={directOnly} onChange={e => setDirectOnly(e.target.checked)}
            className="rounded text-brand-600" />
          <span className="text-sm text-gray-700">Direct flights only</span>
        </label>
      </div>

      <button onClick={search} disabled={loading}
        className="btn-primary w-full justify-center mt-4">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching flights…</> : '✈️ Search Flights'}
      </button>

      {/* Parsed query summary */}
      {parsedSummary && (
        <div className="mt-3 p-2 bg-brand-50 rounded-lg text-xs text-brand-700 font-medium">
          Searching: {parsedSummary}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-5 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 text-sm">
              {result.legs?.length > 1 ? `${result.legs.length}-leg itinerary` : 'Flight options'}
            </h4>
            <span className="text-sm font-bold text-brand-600">
              From {formatPrice(result.totalMinPrice, result.currency)}
            </span>
          </div>

          {result.legs?.map((leg: any, i: number) => (
            <div key={i} className="mb-4">
              {result.legs.length > 1 && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {leg.from} → {leg.to}
                    {leg.date && <span className="text-gray-400 font-normal ml-2">· {leg.date}</span>}
                  </span>
                </div>
              )}
              <div className="space-y-2">
                {(leg.flights || []).slice(0, 3).map((f: any, j: number) => (
                  <div key={j} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${j === 0 ? 'border-brand-200 bg-brand-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded">{f.airlineCode}</span>
                      <div>
                        <p className="text-sm font-semibold">{f.departTime} → {f.arriveTime}</p>
                        <p className="text-xs text-gray-500">{f.duration} · {f.stops === 0 ? 'Direct' : f.stops + ' stop'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">${f.price}</span>
                      <a href={f.bookingUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-brand-600 text-white px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                        Book <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {result.legs?.length > 1 && (
            <a href={result.bookingUrl} target="_blank" rel="noopener noreferrer"
              className="btn-primary w-full justify-center mt-2 text-sm">
              Plan full multi-city trip on Kiwi.com <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
