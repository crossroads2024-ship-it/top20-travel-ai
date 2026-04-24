import { SearchHero } from '@/components/modules/SearchHero';
import { Shield, Stamp, Syringe, Languages, Wifi, GitCompare, Plane, MapPin } from 'lucide-react';
import Link from 'next/link';

const features = [
  { icon: Plane,       title: 'Top 20 Flights',        desc: 'Ranked by price, duration and convenience. Real-time data from global APIs.',       color: 'bg-blue-50 text-blue-600' },
  { icon: Shield,      title: 'Safety Scores',          desc: 'Color-coded safety levels sourced from FCDO and US State Department.',               color: 'bg-green-50 text-green-600' },
  { icon: Stamp,       title: 'Visa Intelligence',      desc: 'Visa-free, eVisa or embassy? Instant clarity with a Visa Simplicity Score.',         color: 'bg-purple-50 text-purple-600' },
  { icon: Syringe,     title: 'Health Module',          desc: 'Vaccinations, disease risk, water safety and medicine checklist. WHO/CDC sourced.',  color: 'bg-red-50 text-red-500' },
  { icon: Languages,   title: 'Culture & Language',     desc: 'Phrases, etiquette, taboos and tipping norms for every destination.',                color: 'bg-amber-50 text-amber-600' },
  { icon: Wifi,        title: 'SIM & Connectivity',     desc: 'Best local SIM options, eSIM providers and WiFi quality ratings.',                   color: 'bg-sky-50 text-sky-600' },
  { icon: GitCompare,  title: 'Destination Comparison', desc: 'Compare up to 3 countries side-by-side on every dimension.',                         color: 'bg-indigo-50 text-indigo-600' },
  { icon: MapPin,      title: 'AI Trip Planner',        desc: 'Top 20 places, restaurants and hotels with a shareable day-by-day itinerary.',       color: 'bg-pink-50 text-pink-600' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'Solo traveler', quote: 'Found a safe, affordable trip to Lisbon in under 2 minutes. The visa and health info saved me hours of research.' },
  { name: 'James K.', role: 'Family of 4', quote: 'The safety scores are brilliant. We chose Barcelona over Istanbul after seeing the comparison — best holiday we\'ve had.' },
  { name: 'Priya L.', role: 'Digital nomad', quote: 'The SIM module alone is worth it. I never arrive at a destination without knowing exactly which eSIM to buy first.' },
];

export default function HomePage() {
  return (
    <>
      <SearchHero />

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title mb-3">Everything you need to decide, plan and go</h2>
          <p className="text-gray-500 max-w-lg mx-auto">8 intelligence modules. 20 ranked results per category. One platform.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-brand-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { n: '01', title: 'Tell us what you want', desc: 'Type freely — "cheap safe beach holiday under $800" — or use structured fields.' },
              { n: '02', title: 'AI ranks your Top 20', desc: 'Our engine scores destinations on price, safety, weather and your interests.' },
              { n: '03', title: 'Decide and go', desc: 'Explore flights, visa, health, SIM and culture for any destination in seconds.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 bg-brand-700 rounded-2xl flex items-center justify-center text-brand-300 font-bold text-lg mx-auto mb-4">{n}</div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-brand-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-title text-center mb-10">Trusted by smart travelers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, quote }) => (
            <div key={name} className="card p-6">
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{quote}"</p>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{name}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to travel smarter?</h2>
          <p className="text-brand-200 mb-6">Free to start. No account required.</p>
          <Link href="/search" className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3 rounded-xl hover:bg-brand-50 transition-colors">
            Find My Top 20 →
          </Link>
        </div>
      </section>
    </>
  );
}
