import { v4 as uuidv4 } from 'uuid';
import { UserSession, UserTier } from '@/types';

const SESSION_COOKIE = 'top20_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// In production replace with Redis/Firestore. For demo: in-memory map.
const sessionStore = new Map<string, UserSession>();

export function createSession(tier: UserTier = 'free', email?: string): UserSession {
  const session: UserSession = {
    token: uuidv4(),
    tier,
    email,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION,
  };
  sessionStore.set(session.token, session);
  return session;
}

export function getSession(token: string): UserSession | null {
  const session = sessionStore.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessionStore.delete(token);
    return null;
  }
  // Rolling window
  session.expiresAt = Date.now() + SESSION_DURATION;
  return session;
}

export function upgradeSession(token: string, tier: UserTier, email: string): UserSession | null {
  const session = sessionStore.get(token);
  if (!session) return null;
  session.tier = tier;
  session.email = email;
  return session;
}

export function deleteSession(token: string): void {
  sessionStore.delete(token);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function parseTier(tier?: string): UserTier {
  if (tier === 'pro') return 'pro';
  if (tier === 'basic') return 'basic';
  return 'free';
}

export function tierLimits(tier: UserTier) {
  return {
    free:  { flights: 5,  destinations: 5,  comparison: 0,  planner: false, alerts: false, full_modules: false },
    basic: { flights: 20, destinations: 20, comparison: 2,  planner: true,  alerts: true,  full_modules: true  },
    pro:   { flights: 20, destinations: 20, comparison: 3,  planner: true,  alerts: true,  full_modules: true  },
  }[tier];
}
