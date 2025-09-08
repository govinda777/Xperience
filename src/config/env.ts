// Environment variables with fallbacks for testing
export const ENV = {
  VITE_MERCADO_PAGO_PUBLIC_KEY:
    import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "test-key",
  VITE_MERCADO_PAGO_ACCESS_TOKEN:
    import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || "test-token",
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || "development",
  VITE_PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID || "test-app-id",
  VITE_PRIVY_APP_SECRET: import.meta.env.VITE_PRIVY_APP_SECRET || "test-secret",
  VITE_WEBHOOK_URL:
    import.meta.env.VITE_WEBHOOK_URL ||
    "https://your-vercel-app.vercel.app/api/webhooks",
  VITE_API_URL:
    import.meta.env.VITE_API_URL || "https://your-vercel-app.vercel.app/api",
  VITE_ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || "test-key",
  VITE_WEBHOOK_SECRET: import.meta.env.VITE_WEBHOOK_SECRET || "test-secret",
  VITE_USDT_ETHEREUM_CONTRACT:
    import.meta.env.VITE_USDT_ETHEREUM_CONTRACT || "test-contract",
  VITE_USDT_POLYGON_CONTRACT:
    import.meta.env.VITE_USDT_POLYGON_CONTRACT || "test-contract",
  VITE_SITE_URL:
    import.meta.env.VITE_SITE_URL || "https://xperience.vercel.app",
  VITE_GA_VIEW_ID: import.meta.env.VITE_GA_VIEW_ID || "",
  DEV: import.meta.env.DEV || true,
  PROD: import.meta.env.PROD || false,
};

export const seoConfig = {
  title: "Xperience",
  description: "Xperience - Your decentralized experience platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xperience.vercel.app",
    site_name: "Xperience",
  },
  twitter: {
    handle: "@xperience",
    site: "@xperience",
    cardType: "summary_large_image",
  },
};
