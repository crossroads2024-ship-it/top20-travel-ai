import { clsx, type ClassValue } from 'clsx';
import { SafetyLevel, UserTier } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function safetyColor(level: SafetyLevel): string {
  return {
    safe: 'text-green-700 bg-green-100 border-green-200',
    caution: 'text-amber-700 bg-amber-100 border-amber-200',
    high_risk: 'text-orange-700 bg-orange-100 border-orange-200',
    do_not_travel: 'text-red-700 bg-red-100 border-red-200',
  }[level];
}

export function safetyDot(level: SafetyLevel): string {
  return {
    safe: 'bg-green-500',
    caution: 'bg-amber-500',
    high_risk: 'bg-orange-500',
    do_not_travel: 'bg-red-600',
  }[level];
}

export function safetyLabel(level: SafetyLevel): string {
  return {
    safe: 'Safe',
    caution: 'Exercise Caution',
    high_risk: 'High Risk',
    do_not_travel: 'Do Not Travel',
  }[level];
}

export function visaLabel(type: 'free' | 'evisa' | 'embassy'): string {
  return { free: 'Visa Free', evisa: 'eVisa', embassy: 'Embassy Required' }[type];
}

export function visaColor(type: 'free' | 'evisa' | 'embassy'): string {
  return {
    free: 'text-green-700 bg-green-100',
    evisa: 'text-amber-700 bg-amber-100',
    embassy: 'text-red-700 bg-red-100',
  }[type];
}

export function scoreBar(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price);
}

export function tierCanAccess(tier: UserTier, requiredTier: UserTier): boolean {
  const order: UserTier[] = ['free', 'basic', 'pro'];
  return order.indexOf(tier) >= order.indexOf(requiredTier);
}

export function weatherIcon(icon: string): string {
  const map: Record<string, string> = {
    'sun': '☀️',
    'cloud': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'storm': '⛈️',
    'partly-cloudy': '⛅',
  };
  return map[icon] || '🌤️';
}

export function confidenceBadge(conf: 'low' | 'medium' | 'high'): { label: string; color: string } {
  return {
    high:   { label: 'Good price', color: 'text-green-700 bg-green-100' },
    medium: { label: 'Avg price',  color: 'text-amber-700 bg-amber-100' },
    low:    { label: 'High price', color: 'text-red-700 bg-red-100'   },
  }[conf];
}
