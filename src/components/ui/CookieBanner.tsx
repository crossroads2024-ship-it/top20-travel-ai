'use client';
import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

type Prefs = { functional: boolean; analytics: boolean; marketing: boolean };

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({ functional: true, analytics: false, marketing: false });

  useEffect(() => {
    const saved = localStorage.getItem('top20_cookie_consent');
    if (!saved) setTimeout(() => setVisible(true), 1200);
  }, []);

  const save = (p: Prefs) => {
    localStorage.setItem('top20_cookie_consent', JSON.stringify({ ...p, savedAt: Date.now() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <h3 className="font-semibold text-gray-900 text-sm">Cookie Preferences</h3>
          </div>
          <button onClick={() => save({ functional: true, analytics: false, marketing: false })}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          We use cookies to improve your experience. Functional cookies are required. Analytics and marketing cookies are optional.
        </p>

        {expanded && (
          <div className="space-y-2 mb-4 border-t border-gray-100 pt-3">
            {([
              { key: 'functional', label: 'Functional', desc: 'Required for core features', locked: true },
              { key: 'analytics',  label: 'Analytics',  desc: 'Help us improve the product', locked: false },
              { key: 'marketing',  label: 'Marketing',  desc: 'Enables affiliate tracking', locked: false },
            ] as const).map(({ key, label, desc, locked }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button
                  disabled={locked}
                  onClick={() => !locked && setPrefs(p => ({ ...p, [key]: !p[key as keyof Prefs] }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    prefs[key as keyof Prefs] ? 'bg-brand-600' : 'bg-gray-200'
                  } ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    prefs[key as keyof Prefs] ? 'translate-x-5' : ''
                  }`} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => save(prefs)} className="btn-primary text-xs py-2 px-4 flex-1">
            Accept Selected
          </button>
          <button onClick={() => save({ functional: true, analytics: true, marketing: true })}
            className="btn-secondary text-xs py-2 px-4 flex-1">
            Accept All
          </button>
          <button onClick={() => setExpanded(!expanded)}
            className="text-xs text-brand-600 font-medium px-2 hover:underline whitespace-nowrap">
            {expanded ? 'Less' : 'Manage'}
          </button>
        </div>
      </div>
    </div>
  );
}
