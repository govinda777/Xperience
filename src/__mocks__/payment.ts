import { PaymentConfig } from "../types/payment";
import { ENV } from "./env";

export const PAYMENT_CONFIG: PaymentConfig = {
  mercadoPago: {
    publicKey: ENV.VITE_MERCADO_PAGO_PUBLIC_KEY,
    sandboxMode: ENV.VITE_ENVIRONMENT !== 'production',
  },
  privy: {
    appId: ENV.VITE_PRIVY_APP_ID,
    supportedChains: ['ethereum', 'polygon'],
  },
  webhookUrl: ENV.VITE_WEBHOOK_URL,
  apiUrl: ENV.VITE_API_URL,
};

export default PAYMENT_CONFIG;
