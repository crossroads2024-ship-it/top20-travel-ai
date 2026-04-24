import { NextRequest, NextResponse } from 'next/server';

interface AlertSubscription {
  email: string;
  destination: string;
  types: ('price' | 'safety' | 'visa')[];
  token: string;
}

// Production: store in Firestore/DB
const subscriptions: AlertSubscription[] = [];

export async function POST(req: NextRequest) {
  try {
    const body: AlertSubscription = await req.json();

    if (!body.email || !body.destination) {
      return NextResponse.json({ error: 'Email and destination required' }, { status: 400 });
    }

    subscriptions.push(body);

    // Production: send confirmation email via Resend
    // await resend.emails.send({
    //   from: process.env.FROM_EMAIL,
    //   to: body.email,
    //   subject: `Alert set for ${body.destination}`,
    //   html: `...`
    // });

    return NextResponse.json({ success: true, message: `Alerts set for ${body.destination}` });
  } catch {
    return NextResponse.json({ error: 'Failed to set alert' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const destination = searchParams.get('destination');

  // Production: remove from DB
  return NextResponse.json({ success: true });
}
