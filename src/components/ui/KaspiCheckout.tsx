'use client';
import { useState } from 'react';
import { Phone, Check, Loader2, Info } from 'lucide-react';

interface Props {
  plan: 'basic' | 'pro';
  priceKZT: number;
  onSuccess?: () => void;
}

export function KaspiCheckout({ plan, priceKZT, onSuccess }: Props) {
  const [phone, setPhone] = useState('+7 ');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'sent' | 'error'>('input');
  const [message, setMessage] = useState('');

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 1) return '+7 ';
    const local = digits.slice(1);
    let formatted = '+7 ';
    if (local.length > 0) formatted += '(' + local.slice(0, 3);
    if (local.length >= 3) formatted += ') ' + local.slice(3, 6);
    if (local.length >= 6) formatted += '-' + local.slice(6, 8);
    if (local.length >= 8) formatted += '-' + local.slice(8, 10);
    return formatted;
  };

  const submit = async () => {
    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length < 11) {
      setMessage('Enter a valid Kazakhstani phone number');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/payments/kaspi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          phone: digitsOnly,
          plan,
          sessionToken: 'session_' + Date.now(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStep('sent');
        setMessage(data.demo
          ? 'Demo mode — add KASPI_API_KEY to enable real payments'
          : 'Check your Kaspi app — approve the payment request');
        onSuccess?.();
      } else {
        setStep('error');
        setMessage(data.error || 'Payment failed');
      }
    } catch {
      setStep('error');
      setMessage('Network error — try again');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'sent') return (
    <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <Check className="w-5 h-5 text-green-600" />
      </div>
      <p className="font-semibold text-green-800 mb-1">Payment request sent!</p>
      <p className="text-xs text-green-700">{message}</p>
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">K</div>
        <div>
          <p className="font-semibold text-sm text-gray-900">Pay with Kaspi</p>
          <p className="text-xs text-gray-500">For Kazakhstan users · ₸{priceKZT.toLocaleString()}/month</p>
        </div>
      </div>

      <div className="relative mb-3">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(formatPhone(e.target.value))}
          placeholder="+7 (700) 000-00-00"
          className="input-field pl-10 text-sm"
          maxLength={18}
        />
      </div>

      {message && step === 'error' && (
        <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
          <Info className="w-3 h-3" /> {message}
        </p>
      )}

      <button onClick={submit} disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : `Pay ₸${priceKZT.toLocaleString()}/mo via Kaspi`}
      </button>

      <p className="text-xs text-gray-400 mt-2 text-center">
        You'll receive a payment request in your Kaspi app
      </p>
    </div>
  );
}
