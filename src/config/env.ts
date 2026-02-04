// Environment variables with fallbacks for testing
const isDev = process.env.NODE_ENV === 'development' || true;

const getEnvVar = (key: string, defaultValue: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const ENV = {
  VITE_ENVIRONMENT: getEnvVar("VITE_ENVIRONMENT", "development"),
  
  VITE_OPENAI_API_KEY: getEnvVar("VITE_OPENAI_API_KEY", "test-key"),

  VITE_PRIVY_APP_SECRET: getEnvVar("VITE_PRIVY_APP_SECRET", "test-secret"),
  VITE_PRIVY_APP_ID: getEnvVar("VITE_PRIVY_APP_ID","cmdwdbrix009rky0ch4w7hgvm"),

  VITE_WEBHOOK_URL: getEnvVar("VITE_WEBHOOK_URL", "https://xperience-hazel-three.vercel.app/api/webhooks"),
  VITE_SITE_URL: getEnvVar("VITE_SITE_URL", "https://xperience.com.br"),
  VITE_API_URL: getEnvVar("VITE_API_URL", "https://xperience-hazel-three.vercel.app/api"),

  
  VITE_MERCADO_PAGO_PUBLIC_KEY: getEnvVar("VITE_MERCADO_PAGO_PUBLIC_KEY", "test-key"),
  VITE_MERCADO_PAGO_ACCESS_TOKEN: getEnvVar("VITE_MERCADO_PAGO_ACCESS_TOKEN", "test-token"),

  VITE_ENCRYPTION_KEY: getEnvVar("VITE_ENCRYPTION_KEY", "test-key"),
  VITE_WEBHOOK_SECRET: getEnvVar("VITE_WEBHOOK_SECRET", "test-secret"),
  VITE_USDT_ETHEREUM_CONTRACT: getEnvVar("VITE_USDT_ETHEREUM_CONTRACT", "test-contract"),
  VITE_USDT_POLYGON_CONTRACT: getEnvVar("VITE_USDT_POLYGON_CONTRACT", "test-contract"),
  DEV: isDev,
  PROD: !isDev,
};

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
  isDev,
};