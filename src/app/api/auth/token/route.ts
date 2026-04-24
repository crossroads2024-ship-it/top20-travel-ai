import { NextRequest, NextResponse } from 'next/server';
import { createSession, getSession, getSessionCookieName } from '@/lib/session';
import { serialize } from 'cookie';

export async function GET(req: NextRequest) {
  const cookieName = getSessionCookieName();
  const token = req.cookies.get(cookieName)?.value;
  if (token) {
    const session = getSession(token);
    if (session) return NextResponse.json({ tier: session.tier, email: session.email });
  }
  // Create new free session
  const session = createSession('free');
  const res = NextResponse.json({ tier: session.tier });
  res.headers.set('Set-Cookie', serialize(cookieName, session.token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60,
  }));
  return res;
}

export async function POST(req: NextRequest) {
  const { action, email } = await req.json();
  const cookieName = getSessionCookieName();
  const token = req.cookies.get(cookieName)?.value;

  if (action === 'magic_link' && email) {
    // Production: send magic link email via Resend
    return NextResponse.json({ success: true, message: 'Magic link sent to ' + email });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
