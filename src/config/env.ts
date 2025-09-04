// Environment variables with fallbacks for testing
export const seoConfig = {
  title: "Xperience - Programa de Mentoria",
  description: "Programa de mentoria para empreendedores",
  keywords: "mentoria, empreendedorismo, negócios",
  author: "Xperience",
  url: "https://xperience.com.br",
  siteUrl: "https://xperience.com.br",
  enableAnalytics: true,
  enablePerformanceMonitoring: true,
  gaId: "G-XXXXXXXXXX",
  isDev: ENV.DEV,
};

export const ENV = {
  VITE_MERCADO_PAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "test-key",
  VITE_MERCADO_PAGO_ACCESS_TOKEN: import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || "test-token",
  VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || "development",
  VITE_PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID || "test-app-id",
  VITE_PRIVY_APP_SECRET: import.meta.env.VITE_PRIVY_APP_SECRET || "test-secret",
  VITE_WEBHOOK_URL: import.meta.env.VITE_WEBHOOK_URL || "https://your-vercel-app.vercel.app/api/webhooks",
  VITE_API_URL: import.meta.env.VITE_API_URL || "https://your-vercel-app.vercel.app/api",
  VITE_ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY || "test-key",
  VITE_WEBHOOK_SECRET: import.meta.env.VITE_WEBHOOK_SECRET || "test-secret",
  VITE_USDT_ETHEREUM_CONTRACT: import.meta.env.VITE_USDT_ETHEREUM_CONTRACT || "test-contract",
  VITE_USDT_POLYGON_CONTRACT: import.meta.env.VITE_USDT_POLYGON_CONTRACT || "test-contract",
  DEV: import.meta.env.DEV || true,
  PROD: import.meta.env.PROD || false,
};