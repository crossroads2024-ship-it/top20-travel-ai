import { Stamp, Syringe, CloudSun, Languages, Wifi, Info, Check, X, AlertTriangle } from 'lucide-react';
import { VisaData, HealthData, WeatherData, CultureData, SimData } from '@/types';
import { visaColor, visaLabel, weatherIcon, formatPrice } from '@/lib/utils';

// ─── VISA MODULE ─────────────────────────────────────────────────────────────
export function VisaModule({ data }: { data: VisaData }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
          <Stamp className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Visa Requirements</h3>
          <p className="text-xs text-gray-500">Source: {data.source}</p>
        </div>
        <span className={`ml-auto badge ${visaColor(data.simplicity)}`}>
          {visaLabel(data.simplicity)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Max Stay', value: `${data.maxStayDays} days` },
          { label: 'Processing', value: data.processingDays ? `${data.processingDays} days` : 'None' },
          { label: 'Cost', value: data.cost ? formatPrice(data.cost, data.currency) : 'Free' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-bold text-gray-900 mt-0.5">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{data.notes}</p>

      {data.applyUrl && (
        <a href={data.applyUrl} target="_blank" rel="noopener noreferrer"
          className="btn-primary text-sm w-full justify-center mb-3">
          Apply for eVisa →
        </a>
      )}

      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-xs text-amber-700 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Visa requirements change. Verify with the relevant embassy before travel.
        </p>
      </div>
    </div>
  );
}

// ─── HEALTH MODULE ────────────────────────────────────────────────────────────
export function HealthModule({ data }: { data: HealthData }) {
  const riskColors = { low: 'text-green-700 bg-green-100', medium: 'text-amber-700 bg-amber-100', high: 'text-red-700 bg-red-100' };
  const waterColors = { safe: 'text-green-700 bg-green-100', caution: 'text-amber-700 bg-amber-100', unsafe: 'text-red-700 bg-red-100' };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <Syringe className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Health & Medicine</h3>
          <p className="text-xs text-gray-500">Source: {data.source}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`badge ${riskColors[data.diseaseRisk]} px-3 py-2 rounded-xl justify-center text-sm`}>
          Disease risk: {data.diseaseRisk}
        </div>
        <div className={`badge ${waterColors[data.waterSafety]} px-3 py-2 rounded-xl justify-center text-sm`}>
          Water: {data.waterSafety}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Vaccinations</h4>
        <div className="space-y-1.5">
          {data.vaccinations.map(v => (
            <div key={v.name} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{v.name}</span>
              <div className="flex gap-1.5">
                {v.required && <span className="badge bg-red-100 text-red-700">Required</span>}
                {v.recommended && !v.required && <span className="badge bg-amber-100 text-amber-700">Recommended</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Pack These</h4>
        <div className="flex flex-wrap gap-1.5">
          {data.medicines.map(m => (
            <span key={m} className="badge bg-gray-100 text-gray-700">{m}</span>
          ))}
        </div>
      </div>

      <div className="p-3 bg-red-50 rounded-xl border border-red-100">
        <p className="text-xs text-red-700 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          General travel health information only. Not personalised medical advice. Consult a travel health clinic or GP before travel.
        </p>
      </div>
    </div>
  );
}

// ─── WEATHER MODULE ───────────────────────────────────────────────────────────
export function WeatherModule({ data }: { data: WeatherData }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center">
          <CloudSun className="w-5 h-5 text-sky-500" />
        </div>
        <h3 className="font-semibold text-gray-900">Weather</h3>
      </div>

      <div className="flex items-center gap-4 mb-4 p-4 bg-sky-50 rounded-xl">
        <div className="text-4xl">{weatherIcon(data.current.icon)}</div>
        <div>
          <div className="text-3xl font-bold text-gray-900">{data.current.temp}°C</div>
          <p className="text-sm text-gray-600">{data.current.condition}</p>
          <p className="text-xs text-gray-500">Humidity: {data.current.humidity}%</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {data.forecast.map(day => (
          <div key={day.day} className="text-center p-2 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">{day.day}</p>
            <p className="text-lg">{weatherIcon(day.icon)}</p>
            <p className="text-xs font-bold text-gray-800">{day.high}°</p>
            <p className="text-xs text-gray-400">{day.low}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CULTURE MODULE ───────────────────────────────────────────────────────────
export function CultureModule({ data }: { data: CultureData }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
          <Languages className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Culture & Language</h3>
          <p className="text-xs text-gray-500">{data.language} · {data.currency} · {data.timezone}</p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Essential Phrases</h4>
        <div className="space-y-2">
          {data.phrases.map(p => (
            <div key={p.english} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-gray-500 w-24 flex-shrink-0">{p.english}</span>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{p.local}</p>
                <p className="text-xs text-gray-400 italic">{p.pronunciation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Etiquette</h4>
        <ul className="space-y-1.5">
          {data.etiquette.map((e, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" /> {e}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Avoid</h4>
        <ul className="space-y-1.5">
          {data.taboos.map((t, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <X className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" /> {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-600"><strong>Tipping:</strong> {data.tipping}</p>
        <p className="text-xs text-gray-600 mt-1"><strong>Dress:</strong> {data.dressCode}</p>
      </div>
    </div>
  );
}

// ─── SIM MODULE ───────────────────────────────────────────────────────────────
export function SimModule({ data }: { data: SimData }) {
  const wifiColors = { excellent: 'text-green-700 bg-green-100', good: 'text-blue-700 bg-blue-100', fair: 'text-amber-700 bg-amber-100', poor: 'text-red-700 bg-red-100' };

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
          <Wifi className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">SIM & Connectivity</h3>
          <div className="flex items-center gap-2">
            <span className={`badge text-xs ${wifiColors[data.wifiQuality]}`}>WiFi: {data.wifiQuality}</span>
            {data.eSimAvailable && <span className="badge bg-green-100 text-green-700 text-xs">eSIM available</span>}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.options.map((opt, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-sm text-gray-900">{opt.provider}</p>
              <p className="text-xs text-gray-500">{opt.dataGB}GB · {opt.durationDays} days · {opt.type}</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <span className="font-bold text-gray-900">{formatPrice(opt.price, opt.currency)}</span>
              {opt.buyUrl && (
                <a href={opt.buyUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-brand-600 font-medium hover:underline">Buy →</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
