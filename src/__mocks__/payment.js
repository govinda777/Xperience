import { ENV } from "./env";
export const PAYMENT_CONFIG = {
    mercadoPago: {
        publicKey: ENV.VITE_MERCADO_PAGO_PUBLIC_KEY,
        accessToken: ENV.VITE_MERCADO_PAGO_ACCESS_TOKEN,
        sandboxMode: ENV.VITE_ENVIRONMENT !== 'production',
    },
    privy: {
        appId: ENV.VITE_PRIVY_APP_ID,
        appSecret: ENV.VITE_PRIVY_APP_SECRET,
        supportedChains: ['ethereum', 'polygon'],
    },
    webhookUrl: ENV.VITE_WEBHOOK_URL,
    apiUrl: ENV.VITE_API_URL,
    security: {
        encryptionKey: ENV.VITE_ENCRYPTION_KEY,
        webhookSecret: ENV.VITE_WEBHOOK_SECRET,
    },
};
export default PAYMENT_CONFIG;
