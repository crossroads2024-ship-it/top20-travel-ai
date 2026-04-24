'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Globe, Zap } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900">Top<span className="text-brand-600">20</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/" className="btn-ghost text-sm">Home</Link>
            <Link href="/search" className="btn-ghost text-sm">Search</Link>
            <Link href="/compare" className="btn-ghost text-sm">Compare</Link>
            <Link href="/planner" className="btn-ghost text-sm">Planner</Link>
            <Link href="/pricing" className="btn-ghost text-sm">Pricing</Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/pricing" className="btn-primary text-sm py-2 px-4">
              <Zap className="w-4 h-4" /> Upgrade
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 animate-fade-in">
          {['/', '/search', '/compare', '/planner', '/pricing'].map((href, i) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              {['Home', 'Search', 'Compare', 'Planner', 'Pricing'][i]}
            </Link>
          ))}
          <Link href="/pricing" onClick={() => setOpen(false)}
            className="block btn-primary text-center mt-3">
            Upgrade to Pro
          </Link>
        </div>
      )}
    </nav>
  );
}
