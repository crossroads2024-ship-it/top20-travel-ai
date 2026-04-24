/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

namespace NodeJS {
  interface ProcessEnv {
    ANTHROPIC_API_KEY?: string;
    AI_MODEL?: string;
    AMADEUS_API_KEY?: string;
    AMADEUS_API_SECRET?: string;
    KIWI_API_KEY?: string;
    OPENWEATHER_API_KEY?: string;
    NEWS_API_KEY?: string;
    SHERPA_API_KEY?: string;
    STRIPE_SECRET_KEY?: string;
    STRIPE_PUBLISHABLE_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
    STRIPE_BASIC_PRICE_ID?: string;
    STRIPE_PRO_PRICE_ID?: string;
    RESEND_API_KEY?: string;
    FROM_EMAIL?: string;
    SESSION_SECRET?: string;
    NEXT_PUBLIC_APP_URL?: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
  }
}
