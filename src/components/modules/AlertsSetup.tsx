'use client';
import { useState } from 'react';
import { Bell, Check, Mail } from 'lucide-react';

interface Props {
  destination: string;
}

export function AlertsSetup({ destination }: Props) {
  const [email, setEmail] = useState('');
  const [types, setTypes] = useState<string[]>(['price', 'safety']);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const toggle = (t: string) =>
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const submit = async () => {
    if (!email.includes('@')) { setError('Enter a valid email'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, destination, types, token: 'session' }),
      });
      if (res.ok) setDone(true);
      else setError('Failed to set alert. Try again.');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="card p-5 text-center">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Check className="w-5 h-5 text-green-600" />
      </div>
      <p className="font-semibold text-gray-900">Alert set!</p>
      <p className="text-sm text-gray-500 mt-1">We'll email you when things change for {destination}.</p>
    </div>
  );

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
          <Bell className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Set Alerts</h3>
          <p className="text-xs text-gray-500">Get notified of changes for {destination}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: 'price', label: 'Price drops' },
          { id: 'safety', label: 'Safety changes' },
          { id: 'visa', label: 'Visa updates' },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => toggle(id)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
              types.includes(id) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="relative mb-3">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="input-field pl-10 text-sm" />
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      <button onClick={submit} disabled={loading || types.length === 0}
        className="btn-primary w-full justify-center text-sm py-2">
        {loading ? 'Setting alert…' : 'Set Alert'}
      </button>

      <p className="text-xs text-gray-400 mt-2 text-center">
        No spam. Unsubscribe any time. See our <a href="/legal/privacy" className="underline">Privacy Policy</a>.
      </p>
    </div>
  );
}
