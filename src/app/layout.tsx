import type { Metadata } from 'next';
import '../styles/globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/ui/CookieBanner';

export const metadata: Metadata = {
  title: 'Top20 Travel Intelligence AI — Smarter Trip Decisions',
  description: 'AI-powered travel platform. Find the top 20 flights, safest destinations, visa info, health advice, and complete trip plans — all in one place.',
  keywords: 'travel ai, cheap flights, travel safety, visa requirements, trip planner, best destinations',
  openGraph: {
    title: 'Top20 Travel Intelligence AI',
    description: 'Find your perfect destination. AI-ranked flights, safety, visa, health and more.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1D4ED8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
