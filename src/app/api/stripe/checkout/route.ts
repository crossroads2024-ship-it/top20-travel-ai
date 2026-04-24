import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const plan = searchParams.get('plan') || 'basic';

  // Production: create real Stripe checkout session
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const session = await stripe.checkout.sessions.create({...});
  // return NextResponse.redirect(session.url!);

  // For now: redirect to pricing page with a note
  return NextResponse.redirect(new URL(`/pricing?selected=${plan}`, req.url));
}
