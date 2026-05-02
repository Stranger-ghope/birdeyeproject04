import { NextResponse } from 'next/server';
import {
  fetchTrendingTokens,
  fetchNewListings,
} from '../../../lib/birdeye';

export async function GET() {
  try {
    const [trending, listings] = await Promise.all([
      fetchTrendingTokens(20, 'rank', 'asc'),
      fetchNewListings(10),
    ]);

    const trendingTokens = trending?.data?.items ?? trending?.data ?? [];
    const newTokens = listings?.data?.items ?? listings?.tokens ?? listings?.data ?? [];

    const rows = trendingTokens.slice(0, 10).map((token: any) => ({
      address: token?.address,
      symbol: token?.symbol,
      name: token?.name,
      price: token?.price,
      marketCap: token?.marketcap ?? token?.marketCap,
      liquidity: token?.liquidity,
      volume24h: token?.volume24hUSD,
      volume24hChange: token?.volume24hChangePercent,
      price24hChange: token?.price24hChangePercent,
      rank: token?.rank,
      isNew: newTokens.some((nt: any) => nt?.address === token?.address),
    }));

    return NextResponse.json({ tokens: rows });
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error?.message ?? 'Unknown server error' }, { status: 500 });
  }
}
