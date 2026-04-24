// Currency conversion - free ExchangeRate-API (1500 calls/month free)
// https://www.exchangerate-api.com

export type SupportedCurrency = 'USD' | 'KZT' | 'EUR' | 'GBP' | 'RUB' | 'CNY' | 'MYR' | 'THB' | 'VND' | 'AED';

export const CURRENCY_LABELS: Record<SupportedCurrency, { symbol: string; name: string; flag: string }> = {
  USD: { symbol: '$',    name: 'US Dollar',         flag: '🇺🇸' },
  KZT: { symbol: '₸',   name: 'Kazakhstani Tenge',  flag: '🇰🇿' },
  EUR: { symbol: '€',   name: 'Euro',               flag: '🇪🇺' },
  GBP: { symbol: '£',   name: 'British Pound',      flag: '🇬🇧' },
  RUB: { symbol: '₽',   name: 'Russian Ruble',      flag: '🇷🇺' },
  CNY: { symbol: '¥',   name: 'Chinese Yuan',       flag: '🇨🇳' },
  MYR: { symbol: 'RM',  name: 'Malaysian Ringgit',  flag: '🇲🇾' },
  THB: { symbol: '฿',   name: 'Thai Baht',          flag: '🇹🇭' },
  VND: { symbol: '₫',   name: 'Vietnamese Dong',    flag: '🇻🇳' },
  AED: { symbol: 'AED', name: 'UAE Dirham',         flag: '🇦🇪' },
};

// Fallback rates (updated periodically - production uses live API)
const FALLBACK_RATES_FROM_USD: Record<SupportedCurrency, number> = {
  USD: 1,
  KZT: 460,
  EUR: 0.92,
  GBP: 0.79,
  RUB: 89,
  CNY: 7.24,
  MYR: 4.71,
  THB: 35.8,
  VND: 25100,
  AED: 3.67,
};

let cachedRates: Record<string, number> | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getExchangeRates(): Promise<Record<string, number>> {
  if (cachedRates && Date.now() - cacheTime < CACHE_TTL) return cachedRates;
  
  try {
    const apiKey = process.env.EXCHANGERATE_API_KEY;
    if (!apiKey) return FALLBACK_RATES_FROM_USD;
    
    const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) throw new Error('Rate fetch failed');
    const data = await res.json();
    cachedRates = data.conversion_rates;
    cacheTime = Date.now();
    return cachedRates!;
  } catch {
    return FALLBACK_RATES_FROM_USD;
  }
}

export async function convertPrice(
  amount: number,
  from: SupportedCurrency = 'USD',
  to: SupportedCurrency = 'USD'
): Promise<number> {
  if (from === to) return amount;
  const rates = await getExchangeRates();
  const fromRate = rates[from] || 1;
  const toRate = rates[to] || 1;
  const usdAmount = amount / fromRate;
  return Math.round(usdAmount * toRate);
}

export function formatCurrency(amount: number, currency: SupportedCurrency = 'USD'): string {
  const info = CURRENCY_LABELS[currency];
  if (!info) return `$${amount}`;
  
  if (currency === 'VND' || currency === 'KZT') {
    return `${Math.round(amount).toLocaleString()} ${info.symbol}`;
  }
  if (currency === 'MYR' || currency === 'AED') {
    return `${info.symbol} ${Math.round(amount).toLocaleString()}`;
  }
  return `${info.symbol}${Math.round(amount).toLocaleString()}`;
}
