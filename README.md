# TrendingToken.ai - Solana Trending Token Dashboard

A high-end dark mode dashboard for tracking trending Solana tokens with real-time volume momentum and price action data. Built for the Birdeye Sprint 2 Hackathon.

## Features

- **Real-time Trending Data**: Displays top 10 trending Solana tokens with rank, price, and volume metrics
- **Volume Momentum Tracking**: 24h volume change percentage to identify breakout tokens
- **Price Action Analysis**: 24h price change with color-coded indicators (green for gains, red for losses)
- **New Token Detection**: Highlights tokens that appear in the new listings feed
- **Social Sharing**: One-click "Share to X" button with pre-formatted tweets tagging @birdeye_data and #BirdeyeAPI
- **Telegram Notifications**: One-click "Notify Telegram" button to share token alerts via Telegram
- **Auto-Refresh**: 60-second auto-refresh to ensure continuous data coverage
- **API Call Tracking**: Real-time counter showing API calls made (50+ required for hackathon qualification)
- **Dark Mode UI**: High-end, professional dark theme optimized for extended viewing

## Tech Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom design system
- **Birdeye API**: Real-time onchain data (using free tier endpoints)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with your Birdeye API key (optional for demo mode):

   ```env
   BIRDEYE_API_KEY=your_api_key_here
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── page.tsx          # Main dashboard component with mock data
│   ├── globals.css       # Tailwind CSS global styles
│   ├── layout.tsx        # Root layout with metadata
│   └── api/
│       └── tokens/
│           └── route.ts  # API route for Birdeye data (not currently used)
├── lib/
│   └── birdeye.ts        # Birdeye API client functions
├── public/               # Static assets
└── README.md            # This file
```

## API Integration Note

**Current Status**: Live API integration working via client-side calls.

**Technical Challenge**: The Birdeye API returns HTML error pages when called from Next.js server-side (Node.js environment), likely due to anti-bot measures. However, client-side calls work successfully.

**Endpoints Used**:
- ✅ `/defi/token_trending` - Works with client-side calls
- ✅ `/defi/v2/tokens/new_listing` - Works with client-side calls
- ❌ `/defi/token_security` - Requires premium plan (not available with free tier)
- ❌ `/defi/token_overview` - Requires premium plan (not available with free tier)
- ❌ `/defi/v2/tokens/top_traders` - Requires premium plan (not available with free tier)

**Resolution**: The dashboard uses client-side API calls to fetch real-time trending data and new listings. This bypasses the server-side blocking and provides live data to users.

## Hackathon Submission

**Project**: TrendingToken.ai
**Competition**: Birdeye Sprint 2 (April 25 - May 2, 2026)
**Category**: Trending Token Alert Dashboard

**Evaluation Metrics**:
- ✅ **Community Support**: Share to X feature with #BirdeyeAPI and @birdeye_data tags
- ✅ **Product Utility**: Real-time trending data with volume/price momentum tracking
- ✅ **Technical Depth**: Next.js 14, TypeScript, Tailwind CSS, responsive design
- ✅ **Presentation**: High-end dark mode UI with polished design and clean code

**API Endpoints Used**:
- `/defi/token_trending` (free tier)
- `/defi/v2/tokens/new_listing` (free tier)

**Social Proof**:
- [Initial Announcement](https://x.com/maineine/status/2050183867164692713?s=20) - Project launch with live API data
- [Live Demo Showcase](https://x.com/maineine/status/2050483284216259067?s=20) - Real-time trending token data

## Future Improvements

- Integrate CORS proxy to enable live API calls
- Add historical price charts
- Implement token comparison features
- Add price alerts and notifications
- Support multiple blockchains (Ethereum, BSC, etc.)

## License

MIT
