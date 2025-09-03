import { PaymentConfig } from "../types/payment";

export const PAYMENT_CONFIG: PaymentConfig = {
  mercadoPago: {
    publicKey: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "",
    accessToken: import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || "",
    sandboxMode: import.meta.env.VITE_ENVIRONMENT !== "production",
  },
  privy: {
    appId: import.meta.env.VITE_PRIVY_APP_ID || "",
    appSecret: import.meta.env.VITE_PRIVY_APP_SECRET || "",
    supportedChains: ["ethereum", "bitcoin"],
  },
  webhookUrl:
    import.meta.env.VITE_WEBHOOK_URL ||
    "https://your-vercel-app.vercel.app/api/webhooks",
  apiUrl:
    import.meta.env.VITE_API_URL || "https://your-vercel-app.vercel.app/api",
  security: {
    encryptionKey: import.meta.env.VITE_ENCRYPTION_KEY || "",
    webhookSecret: import.meta.env.VITE_WEBHOOK_SECRET || "",
  },
};

// Constantes de configuração
export const PAYMENT_CONSTANTS = {
  // Timeouts em milissegundos
  PIX_TIMEOUT: 15 * 60 * 1000, // 15 minutos
  CRYPTO_TIMEOUT: 60 * 60 * 1000, // 1 hora

  // Intervalos de polling em milissegundos
  PIX_POLLING_INTERVAL: 3000, // 3 segundos
  CRYPTO_POLLING_INTERVAL: 30000, // 30 segundos

  // Limites de valor
  MIN_PAYMENT_BRL: 1.0,
  MAX_PAYMENT_BRL: 50000.0,

  // Taxas de desconto por método de pagamento
  PAYMENT_DISCOUNTS: {
    pix: 0, // Sem desconto
    bitcoin: 0.05, // 5% de desconto
    usdt: 0.03, // 3% de desconto
    github: 0, // Sem desconto
  },

  // URLs das APIs
  COINGECKO_API: "https://api.coingecko.com/api/v3",
  MERCADO_PAGO_API: "https://api.mercadopago.com",

  // Contratos de criptomoedas
  CONTRACTS: {
    USDT_ETHEREUM: import.meta.env.VITE_USDT_ETHEREUM_CONTRACT || "",
    USDT_POLYGON: import.meta.env.VITE_USDT_POLYGON_CONTRACT || "",
  },

  // Redes blockchain
  NETWORKS: {
    ETHEREUM_MAINNET: 1,
    ETHEREUM_SEPOLIA: 11155111,
    POLYGON_MAINNET: 137,
    POLYGON_MUMBAI: 80001,
  },
};

// Validação de configuração
export function validatePaymentConfig(): boolean {
  const errors: string[] = [];

  if (!PAYMENT_CONFIG.mercadoPago.publicKey) {
    errors.push("VITE_MERCADO_PAGO_PUBLIC_KEY não configurado");
  }

  if (!PAYMENT_CONFIG.privy.appId) {
    errors.push("VITE_PRIVY_APP_ID não configurado");
  }

  if (!PAYMENT_CONFIG.webhookUrl) {
    errors.push("VITE_WEBHOOK_URL não configurado");
  }

  if (errors.length > 0) {
    console.error("Erros de configuração de pagamento:", errors);
    return false;
  }

  return true;
}

// Função para obter configuração específica do ambiente
export function getEnvironmentConfig() {
  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  return {
    isDevelopment,
    isProduction,
    mercadoPagoSandbox: isDevelopment || PAYMENT_CONFIG.mercadoPago.sandboxMode,
    logLevel: isDevelopment ? "debug" : "error",
    enableAnalytics: isProduction,
  };
}
