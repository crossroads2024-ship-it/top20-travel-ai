'use client';
import { useState } from 'react';
import { Check, X, Zap, CreditCard, Phone } from 'lucide-react';
import Link from 'next/link';
import { KaspiCheckout } from '@/components/ui/KaspiCheckout';

const PLANS = [
  { id:'free', name:'Free', priceUSD:0, priceKZT:0, period:'forever', popular:false,
    features:[{t:'Top 5 destinations',y:true},{t:'Top 5 flights',y:true},{t:'Basic safety score',y:true},{t:'1 destination preview',y:true},{t:'Top 20 results',y:false},{t:'Full safety module',y:false},{t:'Visa intelligence',y:false},{t:'Health module',y:false},{t:'Culture & SIM',y:false},{t:'Alerts',y:false}]},
  { id:'basic', name:'Basic', priceUSD:4, priceKZT:2000, period:'month', popular:false,
    features:[{t:'Top 20 destinations',y:true},{t:'Top 20 flights',y:true},{t:'Full safety module',y:true},{t:'Visa intelligence',y:true},{t:'Health module (WHO/CDC)',y:true},{t:'Culture & language',y:true},{t:'SIM comparison + bundle',y:true},{t:'Email alerts',y:true},{t:'2-way comparison',y:true},{t:'3-way comparison',y:false},{t:'Price prediction (Q4)',y:false}]},
  { id:'pro', name:'Pro', priceUSD:9, priceKZT:4140, period:'month', popular:true,
    features:[{t:'Everything in Basic',y:true},{t:'3-way comparison',y:true},{t:'Email + push alerts',y:true},{t:'Offline itinerary cache',y:true},{t:'Multi-city planner',y:true},{t:'Currency conversion',y:true},{t:'Advanced filters',y:true},{t:'Priority support',y:true},{t:'Price prediction (Q4)',y:true},{t:'AI companion (Q4)',y:true}]},
];

export default function PricingPage() {
  const [payMethod, setPayMethod] = useState<'card'|'kaspi'>('card');
  const [selectedPlan, setSelectedPlan] = useState<'basic'|'pro'|null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Simple, honest pricing</h1>
        <p className="text-gray-500 text-lg">Start free. Upgrade when you need the full picture.</p>
      </div>

      {/* Payment toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl flex gap-1">
          <button onClick={() => setPayMethod('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${payMethod==='card'?'bg-white text-gray-900 shadow-sm':'text-gray-500'}`}>
            <CreditCard className="w-4 h-4"/> Card / PayPal (Global)
          </button>
          <button onClick={() => setPayMethod('kaspi')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${payMethod==='kaspi'?'bg-white text-gray-900 shadow-sm':'text-gray-500'}`}>
            <Phone className="w-4 h-4"/> 🇰🇿 Kaspi Pay (Kazakhstan)
          </button>
        </div>
      </div>

      {payMethod==='kaspi' && (
        <div className="max-w-md mx-auto mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-sm text-orange-800 font-medium">
            Kaspi Pay — быстрая оплата через приложение Kaspi для пользователей из Казахстана.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {PLANS.map(plan => (
          <div key={plan.id} className={`card p-6 border-2 relative ${plan.popular?'border-brand-600 shadow-lg':'border-gray-200'}`}>
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most popular</div>
            )}
            <div className="mb-5">
              <h2 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {payMethod==='kaspi'&&plan.priceKZT>0?`₸${plan.priceKZT.toLocaleString()}`:plan.priceUSD===0?'$0':`$${plan.priceUSD}`}
                </span>
                <span className="text-gray-500 text-sm">/{plan.period}</span>
              </div>
              {payMethod==='kaspi'&&plan.priceUSD>0&&<p className="text-xs text-gray-400 mt-1">≈ ${plan.priceUSD} USD</p>}
            </div>
            {plan.id==='free'
              ? <Link href="/search" className="btn-secondary w-full justify-center mb-4 block text-center py-2.5 rounded-xl font-semibold text-sm border-2 border-gray-200 hover:bg-gray-50 transition-all">Get started free</Link>
              : payMethod==='kaspi'
              ? <button onClick={()=>setSelectedPlan(plan.id as 'basic'|'pro')} className={`w-full py-2.5 rounded-xl font-semibold text-sm mb-4 transition-all ${plan.popular?'bg-orange-500 hover:bg-orange-600 text-white':'border-2 border-orange-300 text-orange-700 hover:bg-orange-50'}`}>Оплатить через Kaspi</button>
              : <a href={`/api/payments/paddle?plan=${plan.id}`} className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm mb-4 transition-all ${plan.popular?'bg-brand-600 hover:bg-brand-700 text-white':'border-2 border-gray-200 text-gray-800 hover:bg-gray-50'}`}><Zap className="w-4 h-4"/>Start {plan.name}</a>
            }
            <div className="space-y-2">
              {plan.features.map(f=>(
                <div key={f.t} className={`flex items-center gap-2 text-sm ${f.y?'text-gray-700':'text-gray-300'}`}>
                  {f.y?<Check className="w-4 h-4 text-green-500 flex-shrink-0"/>:<X className="w-4 h-4 text-gray-300 flex-shrink-0"/>}
                  {f.t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedPlan&&payMethod==='kaspi'&&(
        <div className="max-w-sm mx-auto mb-10 animate-fade-in">
          <h3 className="font-semibold text-center mb-3">{selectedPlan==='basic'?'Basic — ₸2,000/мес':'Pro — ₸4,140/мес'}</h3>
          <KaspiCheckout plan={selectedPlan} priceKZT={selectedPlan==='basic'?2000:4140} onSuccess={()=>setSelectedPlan(null)}/>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
        <div className="card p-4"><div className="flex items-center gap-2 mb-2"><CreditCard className="w-5 h-5 text-brand-600"/><p className="font-semibold text-sm">Card / PayPal (Global)</p></div><p className="text-xs text-gray-500 leading-relaxed">Powered by Paddle — accepts Visa, Mastercard, PayPal in 200+ countries. Handles all VAT and taxes. Works from Kazakhstan-registered businesses.</p></div>
        <div className="card p-4"><div className="flex items-center gap-2 mb-2"><span className="text-lg">🇰🇿</span><p className="font-semibold text-sm">Kaspi Pay</p></div><p className="text-xs text-gray-500 leading-relaxed">Для пользователей из Казахстана. Введите номер телефона Kaspi — получите запрос на оплату в приложении. Ежемесячная подписка, отмена в любой момент.</p></div>
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">Common questions</h2>
        {[['Can I cancel anytime?','Yes. Cancel at any time. Access continues until end of billing period.'],['No account needed?','Free tier needs no account. Paid plans use magic-link email or Kaspi phone login.'],['Is health info medical advice?','No. All health content is from WHO/CDC. Consult a travel health clinic before travel.'],['How accurate are prices?','Live estimates from Amadeus/Kiwi APIs. Final price confirmed at booking provider.']].map(([q,a])=>(
          <div key={q} className="card p-5 mb-3"><h3 className="font-semibold text-gray-900 text-sm mb-2">{q}</h3><p className="text-sm text-gray-600 leading-relaxed">{a}</p></div>
        ))}
      </div>
    </div>
  );
}
