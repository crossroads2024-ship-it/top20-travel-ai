'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, DollarSign, Calendar, Compass, Globe } from 'lucide-react';
import { parseFlightQuery, formatQuerySummary } from '@/lib/queryParser';
import { CURRENCY_LABELS, SupportedCurrency } from '@/lib/currency';
import { Locale } from '@/lib/i18n';

const INTERESTS = ['Beach', 'Culture', 'Food', 'Adventure', 'History', 'Nightlife', 'Nature', 'Luxury', 'Budget'];

const EXAMPLES = {
  en: [
    'Cheapest Almaty to Da Nang June, no China transit',
    'ALA → HKG July 3rd → KL July 10th → ALA Aug 1st',
    'Safe beach holiday under $800',
    'Almaty to Bali direct, return August',
  ],
  ru: [
    'Дешёвые рейсы Алматы — Да Нанг июнь, без транзита Китай',
    'Алматы → Гонконг 3 июля → KL 10 июля → Алматы 1 авг',
    'Безопасный пляжный отдых до $800',
    'Алматы — Бали прямой рейс, возврат август',
  ],
};

interface Props {
  locale?: Locale;
  onLocaleChange?: (l: Locale) => void;
}

export function SearchHero({ locale = 'en', onLocaleChange }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<'quick' | 'advanced'>('quick');
  const [freeText, setFreeText] = useState('');
  const [currency, setCurrency] = useState<SupportedCurrency>('USD');
  const [loading, setLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState('');

  // Advanced fields
  const [from, setFrom] = useState('');
  const [destination, setDestination] = useState('');
  const [budget, setBudget] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [noChina, setNoChina] = useState(false);
  const [directOnly, setDirectOnly] = useState(false);

  const isRU = locale === 'ru';

  const handleTextChange = (v: string) => {
    setFreeText(v);
    if (v.length > 10) {
      const parsed = parseFlightQuery(v);
      if (parsed.destinations.length > 0 || parsed.dates.length > 0) {
        setParsedPreview(formatQuerySummary(parsed));
      } else {
        setParsedPreview('');
      }
    } else {
      setParsedPreview('');
    }
  };

  const handleSearch = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (mode === 'quick') {
      params.set('freeText', freeText || (isRU ? 'лучшие направления' : 'best destinations'));
    } else {
      if (from) params.set('from', from);
      if (destination) params.set('destination', destination);
      if (budget) params.set('budget', budget);
      if (departDate) params.set('departDate', departDate);
      if (interests.length) params.set('interests', interests.join(','));
      if (noChina) params.set('excludeTransit', 'CN');
      if (directOnly) params.set('directOnly', '1');
    }
    params.set('currency', currency);
    router.push(`/search?${params.toString()}`);
  };

  const examples = EXAMPLES[locale] || EXAMPLES.en;

  return (
    <div className="relative bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Top bar: language + currency */}
        <div className="flex justify-end gap-3 mb-6 flex-wrap">
          <div className="flex gap-1 bg-white/10 p-1 rounded-lg">
            <button onClick={() => onLocaleChange?.('en')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${locale==='en'?'bg-white text-gray-900':'text-white hover:bg-white/10'}`}>
              🇬🇧 EN
            </button>
            <button onClick={() => onLocaleChange?.('ru')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${locale==='ru'?'bg-white text-gray-900':'text-white hover:bg-white/10'}`}>
              🇷🇺 RU
            </button>
          </div>
          <select value={currency} onChange={e => setCurrency(e.target.value as SupportedCurrency)}
            className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1 text-xs font-medium focus:outline-none">
            {(Object.entries(CURRENCY_LABELS) as [SupportedCurrency, any][]).map(([code, info]) => (
              <option key={code} value={code} className="text-gray-900">{info.flag} {code}</option>
            ))}
          </select>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 text-brand-200 text-sm px-4 py-1.5 rounded-full mb-5 border border-white/20">
            <Compass className="w-3.5 h-3.5" />
            {isRU ? 'ИИ-платформа для путешествий' : 'AI-Powered Travel Intelligence'}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {isRU ? 'Топ 20' : 'Your Top 20'}<br />
            <span className="text-brand-300">{isRU ? 'Лучших направлений' : 'Travel Decisions'}</span>
          </h1>
          <p className="text-brand-200 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            {isRU
              ? 'Рейсы, оценки безопасности, визовая информация, здоровье и маршруты — всё в одном месте.'
              : 'Flights, safety scores, visa intelligence, health advice and trip plans — ranked in seconds.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-5">
          <div className="bg-white/10 rounded-xl p-1 flex gap-1">
            {(['quick', 'advanced'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? 'bg-white text-gray-900' : 'text-white hover:bg-white/10'
                }`}>
                {m === 'quick'
                  ? (isRU ? 'Быстрый' : 'Quick Search')
                  : (isRU ? 'Расширенный' : 'Advanced')}
              </button>
            ))}
          </div>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
          {mode === 'quick' ? (
            <div>
              <div className="flex gap-3 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={freeText} onChange={e => handleTextChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder={isRU
                      ? 'Напр: «Дешёвый рейс Алматы — Да Нанг июнь, без Китая»'
                      : 'e.g. "Almaty to Da Nang June, no China transit"…'}
                    className="input-field pl-10" />
                </div>
                <button onClick={handleSearch} disabled={loading}
                  className="btn-primary whitespace-nowrap">
                  {loading ? (isRU ? 'Поиск…' : 'Searching…') : (isRU ? 'Найти Топ 20' : 'Find Top 20')}
                </button>
              </div>
              {parsedPreview && (
                <div className="text-xs text-brand-600 bg-brand-50 rounded-lg px-3 py-1.5 mb-2 font-medium">
                  {isRU ? 'Обнаружено: ' : 'Detected: '}{parsedPreview}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={from} onChange={e => setFrom(e.target.value)}
                    placeholder={isRU ? 'Откуда (напр. Алматы)' : 'Flying from (e.g. Almaty)'}
                    className="input-field pl-10" />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={destination} onChange={e => setDestination(e.target.value)}
                    placeholder={isRU ? 'Куда (или оставьте пустым)' : 'Destination (or leave blank)'}
                    className="input-field pl-10" />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                    placeholder={isRU ? 'Бюджет (USD)' : 'Budget (USD)'}
                    className="input-field pl-10" />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)}
                    className="input-field pl-10" />
                </div>
              </div>

              {/* Interests */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2">
                  {isRU ? 'Интересы' : 'Interests'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(i => (
                    <button key={i}
                      onClick={() => setInterests(prev =>
                        prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                        interests.includes(i)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400'
                      }`}>
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="checkbox" checked={noChina} onChange={e => setNoChina(e.target.checked)}
                    className="rounded text-brand-600" />
                  {isRU ? 'Без транзита через Китай 🇨🇳' : 'No China transit 🇨🇳'}
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="checkbox" checked={directOnly} onChange={e => setDirectOnly(e.target.checked)}
                    className="rounded text-brand-600" />
                  {isRU ? 'Только прямые рейсы' : 'Direct flights only'}
                </label>
              </div>

              <button onClick={handleSearch} disabled={loading} className="btn-primary w-full justify-center">
                {loading
                  ? (isRU ? 'Поиск направлений…' : 'Ranking destinations…')
                  : (isRU ? 'Найти мой Топ 20' : 'Find My Top 20')}
              </button>
            </div>
          )}

          {/* Examples */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">{isRU ? 'Попробуйте:' : 'Try:'}</p>
            <div className="flex flex-wrap gap-2">
              {examples.map(q => (
                <button key={q} onClick={() => { setFreeText(q); setMode('quick'); handleTextChange(q); }}
                  className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full hover:bg-brand-50 hover:text-brand-600 border border-gray-200 transition-all text-left">
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-8 text-brand-300 text-sm">
          {[['20', isRU?'Результатов':'Ranked results'],['8',isRU?'Модулей':'Data modules'],['190+',isRU?'Стран':'Countries']].map(([n,l])=>(
            <div key={l} className="text-center">
              <div className="text-2xl font-bold text-white">{n}</div>
              <div className="text-xs">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
