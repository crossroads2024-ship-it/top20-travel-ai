import { NextRequest, NextResponse } from 'next/server';

// Paddle - Merchant of Record for international payments
// Works from Kazakhstan-registered businesses. Handles global VAT/tax.
// Sign up: paddle.com
// No Stripe needed.

export async function POST(req: NextRequest) {
  try {
    const { plan, email, sessionToken } = await req.json();

    const PADDLE_PRICES: Record<string, string> = {
      basic: process.env.PADDLE_BASIC_PRICE_ID || 'pri_basic',
      pro:   process.env.PADDLE_PRO_PRICE_ID   || 'pri_pro',
    };

    const priceId = PADDLE_PRICES[plan];
    if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    // Production: create Paddle checkout session
    // const paddle = new Paddle(process.env.PADDLE_API_KEY!);
    // const txn = await paddle.transactions.create({
    //   items: [{ priceId, quantity: 1 }],
    //   customData: { session_token: sessionToken, plan },
    //   customerEmail: email,
    // });
    // return NextResponse.json({ checkout_url: txn.checkout.url });

    // Demo: return Paddle sandbox URL
    const checkoutUrl = `https://sandbox-checkout.paddle.com/checkout/custom/${priceId}?email=${encodeURIComponent(email || '')}&passthrough=${sessionToken}`;
    return NextResponse.json({ checkout_url: checkoutUrl, demo: true });

  } catch (err) {
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
