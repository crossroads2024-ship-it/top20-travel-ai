'use client';
import { useState, useEffect } from 'react';
import { UserTier } from '@/types';

interface SessionState {
  tier: UserTier;
  email?: string;
  loading: boolean;
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ tier: 'free', loading: true });

  useEffect(() => {
    fetch('/api/auth/token')
      .then(r => r.json())
      .then(d => setState({ tier: d.tier || 'free', email: d.email, loading: false }))
      .catch(() => setState({ tier: 'free', loading: false }));
  }, []);

  return state;
}
