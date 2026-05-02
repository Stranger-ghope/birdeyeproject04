'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTokens() {
      try {
        const res = await fetch('/api/tokens');
        if (!res.ok) {
          throw new Error('Failed to fetch token data');
        }
        const data = await res.json();
        setTokens(data.tokens || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadTokens();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Birdeye API Demo</p>
            <h1 className="mt-3 text-4xl font-semibold text-white">Solana Token Data Dashboard</h1>
            <p className="mt-3 max-w-2xl text-slate-300">Live table for Solana token metadata fetched through a secure Birdeye proxy route.</p>
          </div>
        </header>

        <section className="rounded-3xl bg-slate-950/80 p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">Latest Solana tokens</h2>
              <p className="text-sm text-slate-400">Powered by Birdeye token endpoints and Solana chain filtering.</p>
            </div>
            <div className="text-right text-sm text-slate-400">
              {loading ? 'Loading data…' : error ? 'Error loading data' : `${tokens.length} tokens loaded`}
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/60">
              <table className="min-w-full border-separate border-spacing-0 text-left">
                <thead className="bg-slate-950 text-slate-300">
                  <tr>
                    <th className="px-4 py-4">Symbol</th>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Market Cap</th>
                    <th className="px-4 py-4">Liquidity</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-slate-400">Fetching token data…</td>
                    </tr>
                  ) : tokens.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-slate-400">No token data available yet.</td>
                    </tr>
                  ) : (
                    tokens.map((token) => (
                      <tr key={token.address} className="border-t border-slate-800 hover:bg-slate-900/90">
                        <td className="px-4 py-4 font-medium text-white">{token.symbol || '—'}</td>
                        <td className="px-4 py-4 text-slate-300">{token.name || token.symbol || 'Unknown'}</td>
                        <td className="px-4 py-4 text-slate-300">{token.price ? `$${token.price.toFixed(4)}` : 'N/A'}</td>
                        <td className="px-4 py-4 text-slate-300">{token.market_cap ? `$${Intl.NumberFormat().format(token.market_cap)}` : 'N/A'}</td>
                        <td className="px-4 py-4 text-slate-300">{token.liquidity ? `$${Intl.NumberFormat().format(token.liquidity)}` : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-8 text-sm text-slate-500">
          <p>Set <code className="rounded bg-slate-800 px-2 py-1">BIRDEYE_API_KEY</code> in <code className="rounded bg-slate-800 px-2 py-1">.env.local</code> and run <span className="font-semibold text-white">npm run dev</span>.</p>
        </footer>
      </div>
    </main>
  );
}
