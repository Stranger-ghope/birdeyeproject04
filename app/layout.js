import './globals.css';

export const metadata = {
  title: 'Birdeye Solana Token Dashboard',
  description: 'Next.js + Tailwind dashboard for Birdeye Solana token data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
