import { NextRequest, NextResponse } from 'next/server';

// ApiPay.kz — REST API for Kaspi Pay (Kazakhstan)
// Docs: https://apipay.kz/for-ai
// No % fees on sales. Flat monthly plan only.

const APIPAY_BASE = 'https://bpapi.bazarbay.site/api/v1';

interface KaspiInvoiceRequest {
  amount: number;
  phone_number: string;
  description: string;
  external_order_id: string;
}

interface KaspiSubscriptionRequest {
  amount: number;
  phone_number: string;
  description: string;
  billing_period: 'monthly' | 'yearly';
  billing_day?: number;
}

// Create one-time invoice
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, phone, plan, sessionToken } = body;

    if (!phone || !plan) {
      return NextResponse.json({ error: 'Phone and plan required' }, { status: 400 });
    }

    const apiKey = process.env.KASPI_API_KEY;
    
    const planPrices: Record<string, number> = {
      basic: 2000,  // ~$4 in KZT
      pro:   4140,  // ~$9 in KZT
    };

    const planPrice = planPrices[plan];
    if (!planPrice) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    if (!apiKey) {
      // Demo mode - return mock invoice
      return NextResponse.json({
        success: true,
        demo: true,
        invoice_id: 'demo_' + Date.now(),
        payment_url: 'https://kaspi.kz/pay/demo',
        amount: planPrice,
        message: `Demo: Kaspi Pay invoice for ${plan} plan (${planPrice} KZT)`,
        instruction: 'Add KASPI_API_KEY to .env.local to enable real Kaspi payments',
      });
    }

    if (type === 'subscription') {
      // Create recurring subscription
      const subscriptionBody: KaspiSubscriptionRequest = {
        amount: planPrice,
        phone_number: phone,
        description: `Top20 Travel AI — ${plan === 'basic' ? 'Basic' : 'Pro'} план`,
        billing_period: 'monthly',
        billing_day: new Date().getDate(),
      };

      const res = await fetch(`${APIPAY_BASE}/subscriptions`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionBody),
      });

      const data = await res.json();
      return NextResponse.json({ success: true, ...data });
    } else {
      // One-time invoice
      const invoiceBody: KaspiInvoiceRequest = {
        amount: planPrice,
        phone_number: phone,
        description: `Top20 Travel AI — ${plan} план`,
        external_order_id: `${sessionToken}_${plan}_${Date.now()}`,
      };

      const res = await fetch(`${APIPAY_BASE}/invoices`, {
        method: 'POST',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceBody),
      });

      const data = await res.json();
      return NextResponse.json({ success: true, ...data });
    }
  } catch (err) {
    console.error('Kaspi Pay error:', err);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}

// Webhook handler for payment status changes
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, invoice } = body;

    if (event === 'invoice.status_changed' && invoice?.status === 'paid') {
      // Upgrade user session based on external_order_id
      const [sessionToken, plan] = (invoice.external_order_id || '').split('_');
      if (sessionToken && plan) {
        // In production: update session in Redis/Firestore
        console.log(`Kaspi payment confirmed: session ${sessionToken} → ${plan}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
