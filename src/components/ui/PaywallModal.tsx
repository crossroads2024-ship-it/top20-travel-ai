'use client';
import { X, Zap, Check } from 'lucide-react';
import Link from 'next/link';

interface PaywallModalProps {
  onClose: () => void;
  feature?: string;
}

export function PaywallModal({ onClose, feature }: PaywallModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-brand-600" />
            </div>
            <h2 className="font-bold text-gray-900">Unlock Full Access</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {feature && (
          <div className="bg-brand-50 rounded-xl px-4 py-2 mb-4 text-sm text-brand-700 font-medium">
            {feature} requires a paid plan
          </div>
        )}

        <p className="text-gray-600 text-sm mb-5">
          You're viewing <strong>5 of 20 results</strong>. Upgrade to unlock all Top 20 results, full safety data, visa intelligence, health module, and more.
        </p>

        <div className="space-y-2 mb-5">
          {[
            'All Top 20 flights & destinations',
            'Full safety module with alerts',
            'Visa intelligence + health module',
            'Complete trip planner & itineraries',
            'SIM & connectivity guide',
            'Destination comparison (up to 3)',
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border-2 border-brand-200 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Basic</div>
            <div className="text-2xl font-bold text-gray-900">$4<span className="text-sm font-normal text-gray-500">/mo</span></div>
          </div>
          <div className="border-2 border-brand-600 rounded-xl p-3 text-center relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">Popular</div>
            <div className="text-xs text-gray-500 mb-1">Pro</div>
            <div className="text-2xl font-bold text-gray-900">$9<span className="text-sm font-normal text-gray-500">/mo</span></div>
          </div>
        </div>

        <Link href="/pricing" onClick={onClose} className="btn-primary w-full justify-center">
          <Zap className="w-4 h-4" /> See All Plans
        </Link>
        <button onClick={onClose} className="w-full text-center text-sm text-gray-500 mt-3 hover:text-gray-700">
          Continue with free plan
        </button>
      </div>
    </div>
  );
}
