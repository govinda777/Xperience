// Environment variables with fallbacks for testing
const isDev = process.env.NODE_ENV === 'development' || true;

const getEnvVar = (key: string, defaultValue: string) => {
  // Try import.meta.env first (Vite)
  try {
    if (import.meta.env && import.meta.env[key]) {
      return import.meta.env[key];
    }
  } catch (e) {
    // Ignore error if import.meta is not defined
  }

  // Fallback to process.env (Node.js/Jest)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
};

export const ENV = {
  //env
  VITE_ENVIRONMENT: getEnvVar("VITE_ENVIRONMENT", "development"),
  
  //auth
  VITE_PRIVY_APP_ID: getEnvVar("VITE_PRIVY_APP_ID","cmdwdbrix009rky0ch4w7hgvm"),

  //domains
  VITE_WEBHOOK_URL: getEnvVar("VITE_WEBHOOK_URL", "https://xperience-hazel-three.vercel.app/api/webhooks"),
  VITE_SITE_URL: getEnvVar("VITE_SITE_URL", "https://xperience.com.br"),
  VITE_API_URL: getEnvVar("VITE_API_URL", "https://xperience-hazel-three.vercel.app/api"),

  VITE_MERCADO_PAGO_PUBLIC_KEY: getEnvVar("VITE_MERCADO_PAGO_PUBLIC_KEY", "test-key"),

  // Contracts (Public)
  VITE_USDT_ETHEREUM_CONTRACT: getEnvVar("VITE_USDT_ETHEREUM_CONTRACT", "test-contract"),
  VITE_USDT_POLYGON_CONTRACT: getEnvVar("VITE_USDT_POLYGON_CONTRACT", "test-contract"),

  //seo
  VITE_PAGESPEED_API_KEY: getEnvVar("VITE_PAGESPEED_API_KEY", ""),

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
