import { NextResponse } from 'next/server';
import { fetchNewListings } from '../../../lib/birdeye';

export async function GET() {
  try {
    const listings = await fetchNewListings(10);
    return NextResponse.json({ listings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Unknown server error' }, { status: 500 });
  }
}
