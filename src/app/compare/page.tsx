'use client';
import { useState } from 'react';
import { Search, X, Trophy } from 'lucide-react';
import { safetyLabel, visaLabel, safetyColor, visaColor, weatherIcon, formatPrice, scoreBar } from '@/lib/utils';

const POPULAR = ['Lisbon', 'Bangkok', 'Tokyo', 'Barcelona', 'Bali', 'Amsterdam', 'Marrakech', 'Rome', 'Dubai', 'Cape Town'];

interface DestComp {
  name: string;
  country: string;
  safety: 'safe' | 'caution' | 'high_risk';
  visa: 'free' | 'evisa' | 'embassy';
  price: number;
  temp: number;
  safetyScore: number;
  priceScore: number;
  weatherScore: number;
  overallScore: number;
}

const DEST_DATA: Record<string, DestComp> = {
  'Lisbon':     { name: 'Lisbon',     country: 'Portugal',     safety: 'safe',    visa: 'free',    price: 280, temp: 22, safetyScore: 92, priceScore: 88, weatherScore: 90, overallScore: 91 },
  'Bangkok':    { name: 'Bangkok',    country: 'Thailand',     safety: 'caution', visa: 'free',    price: 520, temp: 32, safetyScore: 78, priceScore: 95, weatherScore: 82, overallScore: 89 },
  'Tokyo':      { name: 'Tokyo',      country: 'Japan',        safety: 'safe',    visa: 'free',    price: 750, temp: 18, safetyScore: 98, priceScore: 72, weatherScore: 80, overallScore: 88 },
  'Barcelona':  { name: 'Barcelona',  country: 'Spain',        safety: 'safe',    visa: 'free',    price: 310, temp: 25, safetyScore: 88, priceScore: 80, weatherScore: 92, overallScore: 87 },
  'Bali':       { name: 'Bali',       country: 'Indonesia',    safety: 'caution', visa: 'evisa',   price: 620, temp: 29, safetyScore: 80, priceScore: 92, weatherScore: 85, overallScore: 86 },
  'Amsterdam':  { name: 'Amsterdam',  country: 'Netherlands',  safety: 'safe',    visa: 'free',    price: 290, temp: 15, safetyScore: 93, priceScore: 74, weatherScore: 72, overallScore: 85 },
  'Marrakech':  { name: 'Marrakech',  country: 'Morocco',      safety: 'caution', visa: 'free',    price: 250, temp: 28, safetyScore: 76, priceScore: 91, weatherScore: 88, overallScore: 84 },
  'Rome':       { name: 'Rome',       country: 'Italy',        safety: 'safe',    visa: 'free',    price: 320, temp: 24, safetyScore: 88, priceScore: 75, weatherScore: 88, overallScore: 80 },
  'Dubai':      { name: 'Dubai',      country: 'UAE',          safety: 'safe',    visa: 'evisa',   price: 450, temp: 35, safetyScore: 95, priceScore: 65, weatherScore: 78, overallScore: 82 },
  'Cape Town':  { name: 'Cape Town',  country: 'South Africa', safety: 'caution', visa: 'free',    price: 680, temp: 20, safetyScore: 65, priceScore: 82, weatherScore: 90, overallScore: 81 },
};

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const add = (name: string) => {
    if (selected.length >= 3 || selected.includes(name)) return;
    setSelected(s => [...s, name]);
    setInput('');
  };

  const remove = (name: string) => setSelected(s => s.filter(x => x !== name));

  const data = selected.map(s => DEST_DATA[s]).filter(Boolean);

  const getBest = (key: keyof DestComp) => {
    if (data.length === 0) return '';
    return data.reduce((best, d) => ((d[key] as number) > (best[key] as number) ? d : best)).name;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare Destinations</h1>
        <p className="text-gray-500">Add up to 3 destinations to compare side-by-side</p>
      </div>

      {/* Selector */}
      <div className="card p-5 mb-8">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type a destination to add…"
              className="input-field pl-10" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map(p => (
            <button key={p} onClick={() => add(p)}
              disabled={selected.includes(p) || selected.length >= 3}
              className={`text-sm px-3 py-1.5 rounded-full border transition-all font-medium ${
                selected.includes(p)
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {selected.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-2">Select destinations above to compare</p>
          <p className="text-sm">Choose up to 3 to see a side-by-side breakdown</p>
        </div>
      )}

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <td className="w-36 p-3 text-xs font-semibold text-gray-500 uppercase">Dimension</td>
                {data.map(d => (
                  <th key={d.name} className="p-3 text-center">
                    <div className="card p-3 inline-block min-w-[140px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{d.name}</span>
                        <button onClick={() => remove(d.name)} className="text-gray-400 hover:text-gray-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">{d.country}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Overall Score', key: 'overallScore', render: (v: any) => <span className="font-bold text-lg">{v}/100</span> },
                { label: 'Safety', key: 'safetyScore', render: (v: any, d: DestComp) => <span className={`badge border ${safetyColor(d.safety)}`}>{safetyLabel(d.safety)}</span> },
                { label: 'Visa', key: 'visa', render: (_v: any, d: DestComp) => <span className={`badge ${visaColor(d.visa)}`}>{visaLabel(d.visa)}</span> },
                { label: 'Avg Flight', key: 'price', render: (v: any) => <span className="font-semibold">{formatPrice(v)}</span> },
                { label: 'Temperature', key: 'temp', render: (v: any) => <span>{v}°C</span> },
                { label: 'Price Score', key: 'priceScore', render: (v: any) => (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${scoreBar(v)}`} style={{ width: `${v}%` }} />
                    </div>
                    <span className="text-xs">{v}</span>
                  </div>
                )},
                { label: 'Weather Score', key: 'weatherScore', render: (v: any) => (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${scoreBar(v)}`} style={{ width: `${v}%` }} />
                    </div>
                    <span className="text-xs">{v}</span>
                  </div>
                )},
              ].map(({ label, key, render }) => (
                <tr key={label} className="border-t border-gray-100">
                  <td className="p-3 text-sm text-gray-500 font-medium">{label}</td>
                  {data.map(d => (
                    <td key={d.name} className={`p-3 text-center ${getBest(key as keyof DestComp) === d.name ? 'bg-green-50' : ''}`}>
                      {render(d[key as keyof DestComp] as any, d)}
                      {getBest(key as keyof DestComp) === d.name && data.length > 1 && (
                        <div className="flex justify-center mt-1">
                          <Trophy className="w-3 h-3 text-amber-500" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
