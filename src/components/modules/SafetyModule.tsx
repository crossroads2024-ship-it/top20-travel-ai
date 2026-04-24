import { Shield, AlertTriangle, Building2, Info } from 'lucide-react';
import { SafetyData } from '@/types';
import { safetyColor, safetyLabel, safetyDot } from '@/lib/utils';

export function SafetyModule({ data }: { data: SafetyData }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
          <Shield className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Travel Safety</h3>
          <p className="text-xs text-gray-500">Source: {data.source}</p>
        </div>
        <span className={`ml-auto badge border ${safetyColor(data.level)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${safetyDot(data.level)}`} />
          {safetyLabel(data.level)}
        </span>
      </div>

      {/* Score */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-4">
        <div className="text-3xl font-bold text-gray-900">{data.score}<span className="text-lg text-gray-400">/100</span></div>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${data.score}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Safety score</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4 leading-relaxed">{data.summary}</p>

      {/* Advisories */}
      {data.advisories.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Advisories</h4>
          <ul className="space-y-1.5">
            {data.advisories.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Embassy */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <Building2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
        Embassy: {data.embassyPresent ? 'Present in-country' : 'No embassy — use nearest'}
      </div>

      {/* Entry restrictions */}
      {data.entryRestrictions.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Entry Requirements</h4>
          <ul className="space-y-1">
            {data.entryRestrictions.map((r, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                <span className="text-brand-500 mt-0.5">•</span> {r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-xs text-amber-700 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          Verify with your government's official travel advisory before travel. Conditions change rapidly.
        </p>
      </div>
    </div>
  );
}
