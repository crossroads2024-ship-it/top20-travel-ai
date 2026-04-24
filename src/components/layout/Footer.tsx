import Link from 'next/link';
import { Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Top<span className="text-brand-400">20</span></span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              AI-powered travel decisions. Top 20 flights, safety scores, visa intelligence, health advice and more — in one place.
            </p>
            <p className="text-xs mt-4 text-gray-500">
              We may earn commissions from partner booking links. This does not affect our rankings.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Search Destinations</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Compare Countries</Link></li>
              <li><Link href="/planner" className="hover:text-white transition-colors">Trip Planner</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/affiliate" className="hover:text-white transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Top20 Travel Intelligence AI. All rights reserved.</p>
          <p className="text-gray-500">
            Travel data is for informational purposes only. Always verify with official government sources before travel.
          </p>
        </div>
      </div>
    </footer>
  );
}
