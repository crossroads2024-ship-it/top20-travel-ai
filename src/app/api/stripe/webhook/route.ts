import { NextRequest, NextResponse } from 'next/server';
import { upgradeSession, getSessionCookieName } from '@/lib/session';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') || '';

  try {
    // Production: verify webhook signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    const event = JSON.parse(body);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_email;
      const planId = session.metadata?.plan || 'basic';
      const tier = planId === 'pro' ? 'pro' : 'basic';
      const sessionToken = session.metadata?.session_token;

      if (sessionToken) {
        upgradeSession(sessionToken, tier, customerEmail);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      // Downgrade to free
      const sessionToken = event.data.object.metadata?.session_token;
      if (sessionToken) upgradeSession(sessionToken, 'free', '');
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
