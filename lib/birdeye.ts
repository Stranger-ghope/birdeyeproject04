const BASE_URL = 'https://public-api.birdeye.so';
const API_KEY = process.env.BIRDEYE_API_KEY;
const DEFAULT_CHAIN = 'solana';

function buildUrl(path: string, params: Record<string, string>) {
  const url = new URL(path, BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  return url.toString();
}

async function birdeyeFetch<T>(path: string, params: Record<string, string>) {
  if (!API_KEY) {
    throw new Error('Missing BIRDEYE_API_KEY');
  }

  const url = buildUrl(path, params);
  const response = await fetch(url, {
    headers: {
      'X-API-KEY': API_KEY,
      'x-chain': DEFAULT_CHAIN,
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Birdeye request failed ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchTrendingTokens(limit = 20, sortBy = 'rank', sortType = 'asc') {
  return birdeyeFetch<any>('/defi/token_trending', {
    sort_by: sortBy,
    sort_type: sortType,
    offset: '0',
    limit: String(limit),
  });
}

export async function fetchNewListings(limit = 10) {
  return birdeyeFetch<any>('/v2/tokens/new_listing', { limit: String(limit) });
}
