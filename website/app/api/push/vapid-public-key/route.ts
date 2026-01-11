import { NextResponse } from 'next/server';

export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      { error: 'VAPID public key not configured' },
      { status: 500 }
    );
  }

  // Cache the response since the key doesn't change
  return NextResponse.json(
    { publicKey },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
}
