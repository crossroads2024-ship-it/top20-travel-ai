import { notFound } from 'next/navigation';

const pages: Record<string, { title: string; content: React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-500 text-sm mb-6">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>1. Who we are</h2>
        <p>Top20 Travel Intelligence AI ("we", "us", "our") operates the Top20 travel platform. We are committed to protecting your privacy in compliance with GDPR and CCPA.</p>
        <h2>2. Data we collect</h2>
        <p><strong>Automatically:</strong> Anonymous session token (device-based, HttpOnly cookie), IP address (for geolocation only, not stored), browser type and language. <strong>When you subscribe:</strong> Email address only (no name, no card data — Stripe handles all payment information).</p>
        <h2>3. How we use your data</h2>
        <p>We use your session token to enforce free/paid tier limits. We use your email to send your magic-link login and, if you opt in, price alerts. We do not sell, share, or trade your data with third parties for marketing purposes.</p>
        <h2>4. Cookies</h2>
        <p>We use three categories of cookies: Functional (required, enables the platform to work), Analytics (optional, helps us understand usage patterns), and Marketing (optional, enables affiliate commission tracking). You control analytics and marketing cookies via our cookie consent banner.</p>
        <h2>5. Affiliate tracking</h2>
        <p>When you have given marketing cookie consent and click a "Book Now" link, we include an affiliate parameter in the URL. This may result in us receiving a commission at no cost to you. Affiliate tracking is suppressed if you have not given marketing cookie consent.</p>
        <h2>6. Data retention</h2>
        <p>Session data is cleared after 30 days of inactivity. Subscriber email addresses are retained while your subscription is active and for 90 days after cancellation, then permanently deleted.</p>
        <h2>7. Your rights (GDPR)</h2>
        <p>You have the right to access, rectify, or delete your data at any time. Email privacy@top20travel.ai to exercise these rights. We will respond within 30 days.</p>
        <h2>8. Children</h2>
        <p>This service is not intended for users under 13 years of age. We do not knowingly collect data from children.</p>
        <h2>9. Contact</h2>
        <p>Privacy enquiries: privacy@top20travel.ai</p>
      </div>
    ),
  },
  terms: {
    title: 'Terms of Service',
    content: (
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-500 text-sm mb-6">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2>1. Acceptance</h2>
        <p>By using Top20 Travel Intelligence AI, you agree to these Terms. If you do not agree, do not use the platform.</p>
        <h2>2. Age restriction</h2>
        <p>You must be at least 13 years old to use this service. By using it, you confirm you meet this requirement.</p>
        <h2>3. Permitted use</h2>
        <p>Top20 is for personal, non-commercial travel research. You may not scrape, reproduce, or redistribute our content. You may not attempt to circumvent free-tier limits by any technical means.</p>
        <h2>4. Accuracy of information</h2>
        <p>We make reasonable efforts to ensure the accuracy of travel data. However, safety advisories, visa requirements, and health information change frequently. You are responsible for verifying all information with official sources before travel. We accept no liability for decisions made based on platform content.</p>
        <h2>5. Subscriptions and billing</h2>
        <p>Paid subscriptions are billed monthly via Stripe. You may cancel at any time; access continues until the end of the billing period. We do not offer refunds for partial months except where required by law.</p>
        <h2>6. Third-party links</h2>
        <p>We link to external booking sites. We are not responsible for their content, pricing, or practices. Your booking relationship is solely between you and the booking provider.</p>
        <h2>7. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, Top20 is not liable for any travel disruptions, financial losses, health outcomes, or other damages arising from use of this platform.</p>
        <h2>8. Changes</h2>
        <p>We may update these Terms. Continued use of the platform after notice of changes constitutes acceptance.</p>
        <h2>9. Contact</h2>
        <p>Legal enquiries: legal@top20travel.ai</p>
      </div>
    ),
  },
  disclaimer: {
    title: 'Disclaimer',
    content: (
      <div className="prose prose-gray max-w-none">
        <h2>Health Disclaimer</h2>
        <p>All health and medical information on this platform is general travel health information sourced from the World Health Organization (WHO) and the Centers for Disease Control and Prevention (CDC). It is not personalised medical advice. It does not account for your individual health history, current medications, or specific circumstances. You must consult a qualified travel health clinic or GP before traveling to destinations with health risks.</p>
        <h2>Travel Safety Disclaimer</h2>
        <p>Safety scores and advisories are sourced from the UK Foreign, Commonwealth & Development Office (FCDO) and the US State Department. Travel conditions, political situations, and security environments change rapidly. You must verify current advice directly with your government's official travel advisory service before booking or traveling.</p>
        <h2>Visa Information Disclaimer</h2>
        <p>Visa requirements change frequently. The information shown is for general guidance only and may not reflect the most current requirements, fees, or processing times. You must verify visa requirements with the official embassy or consulate of your destination country before travel.</p>
        <h2>AI-Generated Content Disclaimer</h2>
        <p>Destination rankings, itineraries, and recommendations are generated by artificial intelligence. AI-generated content may contain inaccuracies. It should be treated as a starting point for research, not a definitive guide. Verify all AI-generated suggestions with authoritative sources.</p>
        <h2>Price Disclaimer</h2>
        <p>All prices shown are estimates based on data available at the time of search. Flight and hotel prices change continuously. The price you see on this platform may not be the price available when you click through to book. Final prices are confirmed at the booking provider.</p>
        <h2>No Professional Advice</h2>
        <p>Nothing on this platform constitutes legal, medical, financial, or professional advice of any kind.</p>
      </div>
    ),
  },
  cookies: {
    title: 'Cookie Policy',
    content: (
      <div className="prose prose-gray max-w-none">
        <h2>What are cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. We use them to make the platform function correctly and, with your consent, to improve it.</p>
        <h2>Cookies we use</h2>
        <h3>Functional cookies (always on)</h3>
        <p><code>top20_session</code> — stores your anonymous session token to enforce free/paid tier limits. HttpOnly, 7-day rolling expiry. Required for the platform to work.</p>
        <p><code>top20_cookie_consent</code> — stores your cookie consent preferences. 1-year expiry. Required to remember your choices.</p>
        <h3>Analytics cookies (optional)</h3>
        <p>If you accept analytics cookies, we use aggregate usage data to understand how the platform is used and improve it. No personally identifiable data is collected in analytics. You can withdraw consent at any time via the cookie banner.</p>
        <h3>Marketing cookies (optional)</h3>
        <p>If you accept marketing cookies, affiliate tracking parameters are added to booking links. This allows us to earn commission when you book via a partner link, at no cost to you. No marketing cookies are set without your explicit consent. You can withdraw consent at any time.</p>
        <h2>Managing cookies</h2>
        <p>You can update your cookie preferences at any time by clicking the cookie banner (it reappears if you clear your cookies) or by contacting us at privacy@top20travel.ai.</p>
      </div>
    ),
  },
  affiliate: {
    title: 'Affiliate Disclosure',
    content: (
      <div className="prose prose-gray max-w-none">
        <h2>Affiliate relationships</h2>
        <p>Top20 Travel Intelligence AI participates in affiliate programmes with travel booking providers including Amadeus, Kiwi.com, Booking.com, and SIM providers including Airalo and Holafly.</p>
        <h2>How it works</h2>
        <p>When you click a "Book Now" or "Buy" link on this platform and complete a booking, we may receive a commission from the booking provider. This commission is paid by the provider, not by you. It does not affect the price you pay.</p>
        <h2>Does it affect our rankings?</h2>
        <p>No. Our destination rankings, safety scores, and recommendations are determined by our AI scoring model based on price, safety, weather, and user preferences. Commission relationships do not influence rankings or recommendations.</p>
        <h2>Consent and tracking</h2>
        <p>Affiliate tracking parameters are only added to booking links when you have given marketing cookie consent. If you have not consented, your click-through is untracked and we do not earn commission from it.</p>
        <h2>Contact</h2>
        <p>Questions about our affiliate relationships: affiliate@top20travel.ai</p>
      </div>
    ),
  },
};

export default function LegalPage({ params }: { params: { page: string } }) {
  const page = pages[params.page];
  if (!page) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="inline-block bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Legal</div>
        <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
      </div>
      <div className="card p-8">
        <style>{`
          .prose h2 { font-size: 1.15rem; font-weight: 700; color: #111827; margin: 1.5rem 0 0.5rem; }
          .prose h3 { font-size: 1rem; font-weight: 600; color: #374151; margin: 1rem 0 0.4rem; }
          .prose p { font-size: 0.9rem; color: #4B5563; line-height: 1.7; margin-bottom: 0.75rem; }
          .prose code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; }
        `}</style>
        {page.content}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(pages).map(page => ({ page }));
}
