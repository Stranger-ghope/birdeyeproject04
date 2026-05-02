import { NextResponse } from 'next/server';

const BIRDEYE_API_URL = 'https://api.birdeye.so/v2/tokens';

export async function GET() {
  const apiKey = process.env.BIRDEYE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing BIRDEYE_API_KEY' }, { status: 500 });
  }

  const query = new URLSearchParams({ chain: 'solana', limit: '20' });
  const url = `${BIRDEYE_API_URL}?${query}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Birdeye-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({ error: 'Birdeye API error', detail: errorBody }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ tokens: data.tokens || [] });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
