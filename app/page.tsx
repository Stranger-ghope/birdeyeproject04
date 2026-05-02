'use client';

import { useEffect, useState } from 'react';

type TrendingToken = {
  address: string;
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  liquidity: number;
  volume24h: number;
  volume24hChange: number;
  price24hChange: number;
  rank: number;
  isNew: boolean;
};

const REFRESH_INTERVAL = 60_000;
const API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '3f18f7818e004669af5f7e6dac1eaf09';

function formatNumber(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatPercent(num: number): string {
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

export default function Home() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiCallCount, setApiCallCount] = useState(0);

  // Load API call count from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('apiCallCount');
    if (saved) setApiCallCount(parseInt(saved, 10));
  }, []);

  // Save API call count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('apiCallCount', apiCallCount.toString());
  }, [apiCallCount]);

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);

    try {
      const [trendingRes, listingsRes] = await Promise.all([
        fetch('https://public-api.birdeye.so/defi/token_trending?sort_by=rank&sort_type=asc&offset=0&limit=20', {
          headers: {
            'X-API-KEY': API_KEY,
            'x-chain': 'solana',
          },
        }),
        fetch('https://public-api.birdeye.so/defi/v2/tokens/new_listing?limit=10', {
          headers: {
            'X-API-KEY': API_KEY,
            'x-chain': 'solana',
          },
        }),
      ]);

      setApiCallCount(prev => prev + 2); // 2 API calls per refresh

      const trending = await trendingRes.json();
      const listings = await listingsRes.json();

      const trendingTokens = trending?.data?.tokens ?? trending?.data ?? [];
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

      setTokens(rows);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = window.setInterval(fetchTokens, REFRESH_INTERVAL);
    return () => window.clearInterval(interval);
  }, []);

  const shareToX = (token: TrendingToken) => {
    const volumeChange = formatPercent(token.volume24hChange);
    const priceChange = formatPercent(token.price24hChange);
    const message = `🚀 Trending on Solana: $${token.symbol} (Rank #${token.rank})\n\n💰 Price: $${token.price.toFixed(6)} (${priceChange})\n📊 24h Volume: ${formatNumber(token.volume24h)} (${volumeChange})\n\nPowered by #BirdeyeAPI @birdeye_data`;
    const tweet = encodeURIComponent(message);
    window.open(`https://x.com/intent/tweet?text=${tweet}`, '_blank', 'noopener,noreferrer');
  };

  const notifyTelegram = (token: TrendingToken) => {
    const volumeChange = formatPercent(token.volume24hChange);
    const priceChange = formatPercent(token.price24hChange);
    const message = `🚀 *${token.symbol}* (Rank #${token.rank})\n\n💰 Price: \`$${token.price.toFixed(6)}\` (${priceChange})\n📊 24h Volume: ${formatNumber(token.volume24h)} (${volumeChange})\n\n🔗 View: http://localhost:3004\n\nPowered by #BirdeyeAPI @birdeye_data`;
    const encoded = encodeURIComponent(message);
    window.open(`https://t.me/share/url?url=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-slate-800/80 bg-slate-950/95 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.75)]">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">TrendingToken.ai</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Solana Trending Token Dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-400">Real-time trending tokens with volume momentum and price action powered by Birdeye API data.</p>
          </div>
          <button
            type="button"
            onClick={fetchTokens}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-100 transition hover:border-cyan-400/60 hover:bg-slate-800"
          >
            Refresh now
          </button>
        </header>

        <section className="rounded-[1.75rem] border border-slate-800/70 bg-slate-900/80 p-4 shadow-inner shadow-slate-950/20">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Top trending tokens</h2>
              <p className="text-sm text-slate-400">Auto-refresh every 60 seconds for continuous API coverage.</p>
            </div>
            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
              <p className="text-sm text-slate-500">{loading ? 'Loading latest data…' : `${tokens.length} tokens loaded`}</p>
              <p className={`text-sm font-medium ${apiCallCount >= 50 ? 'text-emerald-400' : 'text-slate-500'}`}>
                API calls: {apiCallCount}/50 {apiCallCount >= 50 ? '✅' : ''}
              </p>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-100">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-[1.5rem] border border-slate-800 bg-slate-950/70">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead className="bg-slate-950 text-slate-400">
                  <tr>
                    <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em]">Token</th>
                    <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em]">Price</th>
                    <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em]">24h Change</th>
                    <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em]">Volume 24h</th>
                    <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em]">Volume Change</th>
                    <th className="px-4 py-4 text-sm font-semibold uppercase tracking-[0.12em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">Fetching trending tokens…</td>
                    </tr>
                  ) : tokens.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">No tokens available yet.</td>
                    </tr>
                  ) : (
                    tokens.map((token) => (
                      <tr key={token.address} className="border-t border-slate-800/90 hover:bg-slate-900/70">
                        <td className="px-4 py-5">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-white">{token.symbol}</div>
                            {token.isNew && (
                              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">NEW</span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">#{token.rank} {token.name}</div>
                        </td>
                        <td className="px-4 py-5 text-slate-300">
                          {token.price != null ? `$${token.price.toFixed(6)}` : 'N/A'}
                        </td>
                        <td className="px-4 py-5">
                          <span className={token.price24hChange && token.price24hChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {formatPercent(token.price24hChange)}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-slate-300">
                          {formatNumber(token.volume24h)}
                        </td>
                        <td className="px-4 py-5">
                          <span className={token.volume24hChange && token.volume24hChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {formatPercent(token.volume24hChange)}
                          </span>
                        </td>
                        <td className="px-4 py-5">
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <button
                              onClick={() => shareToX(token)}
                              className="rounded-2xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                            >
                              Share to X
                            </button>
                            <button
                              onClick={() => notifyTelegram(token)}
                              className="rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                            >
                              Notify Telegram
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-6 text-sm text-slate-500">
          <p>Using your local <code className="rounded bg-slate-800 px-2 py-1">.env.local</code> Birdeye key. Auto-refresh every 60s to hit 50+ API calls.</p>
        </footer>
      </div>
    </main>
  );
}
