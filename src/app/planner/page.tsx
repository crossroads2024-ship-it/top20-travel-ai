'use client';
import { useState } from 'react';
import { MapPin, Calendar, Users, Loader2, Share2, Download } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  activities: { time: string; activity: string; type: string }[];
}

export default function PlannerPage() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [interests, setInterests] = useState('culture, food, history');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!destination.trim()) { setError('Please enter a destination'); return; }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Create a ${days}-day travel itinerary for ${destination} for ${travelers} traveler(s) interested in: ${interests}.

Respond ONLY with valid JSON in this format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Old Town",
      "activities": [
        { "time": "09:00", "activity": "Visit the historic cathedral", "type": "culture" },
        { "time": "12:00", "activity": "Lunch at Central Market", "type": "food" }
      ]
    }
  ]
}

Include 4-6 activities per day. Types: culture, food, nature, adventure, history, shopping, nightlife, transport.`
          }]
        })
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        setItinerary(parsed.itinerary);
      } else {
        // Fallback itinerary
        setItinerary(generateFallback(destination, days));
      }
    } catch {
      setItinerary(generateFallback(destination, days));
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<string, string> = {
    culture: 'bg-purple-100 text-purple-700',
    food: 'bg-amber-100 text-amber-700',
    nature: 'bg-green-100 text-green-700',
    adventure: 'bg-red-100 text-red-700',
    history: 'bg-blue-100 text-blue-700',
    shopping: 'bg-pink-100 text-pink-700',
    nightlife: 'bg-indigo-100 text-indigo-700',
    transport: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Trip Planner</h1>
        <p className="text-gray-500">Generate a personalised day-by-day itinerary in seconds</p>
      </div>

      {/* Input form */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={destination} onChange={e => setDestination(e.target.value)}
                placeholder="e.g. Lisbon, Portugal"
                className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Interests</label>
            <input value={interests} onChange={e => setInterests(e.target.value)}
              placeholder="e.g. culture, food, nightlife"
              className="input-field" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              <Calendar className="w-3.5 h-3.5 inline mr-1" /> Days: {days}
            </label>
            <input type="range" min={2} max={14} value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2 days</span><span>14 days</span></div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              <Users className="w-3.5 h-3.5 inline mr-1" /> Travelers: {travelers}
            </label>
            <input type="range" min={1} max={10} value={travelers}
              onChange={e => setTravelers(Number(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1</span><span>10</span></div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button onClick={generate} disabled={loading}
          className="btn-primary w-full justify-center">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating itinerary…</> : 'Generate My Itinerary'}
        </button>
      </div>

      {/* Itinerary output */}
      {itinerary && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">{days}-Day {destination} Itinerary</h2>
            <div className="flex gap-2">
              <button onClick={() => navigator.share?.({ title: `${destination} Itinerary`, text: JSON.stringify(itinerary) })}
                className="btn-ghost text-sm">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {itinerary.map(day => (
              <div key={day.day} className="card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {day.day}
                  </div>
                  <h3 className="font-semibold text-gray-900">{day.title}</h3>
                </div>
                <div className="space-y-2">
                  {day.activities.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-t border-gray-50 first:border-0">
                      <span className="text-xs text-gray-400 font-mono w-12 flex-shrink-0 mt-0.5">{a.time}</span>
                      <span className={`badge text-xs flex-shrink-0 ${typeColors[a.type] || 'bg-gray-100 text-gray-600'}`}>{a.type}</span>
                      <span className="text-sm text-gray-700">{a.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-700">
              AI-generated itinerary. Verify opening hours, booking requirements and availability before travel.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function generateFallback(dest: string, days: number): ItineraryDay[] {
  return Array.from({ length: Math.min(days, 5) }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? 'Arrival & First Impressions' : i === days - 1 ? 'Final Day & Departure' : `Day ${i + 1} Exploration`,
    activities: [
      { time: '09:00', activity: `Explore ${dest}'s historic centre`, type: 'culture' },
      { time: '12:00', activity: 'Lunch at a local market', type: 'food' },
      { time: '14:00', activity: 'Visit the main museum or gallery', type: 'history' },
      { time: '18:00', activity: 'Sunset viewpoint walk', type: 'nature' },
      { time: '20:00', activity: 'Dinner at a traditional restaurant', type: 'food' },
    ]
  }));
}
