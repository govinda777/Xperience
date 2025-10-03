// Configuração simplificada do Privy para autenticação
import { ENV } from "./env";

export const privyConfig = {
    appId: ENV.VITE_PRIVY_APP_ID, // App ID do Privy
    config: {
        // Configurações de login
        loginMethods: ["email", "google", "github"],
        // Configurações de aparência
        appearance: {
            theme: "dark",
            accentColor: "#FD9526", // Laranja Xperience
            logo: "/logo.svg",
        },
        // Configurações legais
        legal: {
            termsAndConditionsUrl: "/terms",
            privacyPolicyUrl: "/privacy",
        }
    },
};

// Configurações específicas para pagamentos
export const paymentConfig = {
    // Configurações PIX (via Mercado Pago)
    pix: {
        enabled: true,
        provider: "mercadopago",
        publicKey: ENV.VITE_MERCADO_PAGO_PUBLIC_KEY || "",
        sandboxMode: ENV.PROD !== true,
    },
    // Configurações gerais
    general: {
        currency: "BRL",
        locale: "pt-BR",
        timeoutMinutes: 30,
    },
};

export const availablePaymentMethods = [
    {
        id: "pix",
        name: "PIX",
        icon: "🇧🇷",
        description: "Pagamento instantâneo via PIX",
        enabled: paymentConfig.pix.enabled,
        processingTime: "Instantâneo",
        fees: {
            percentage: 0,
            fixed: 0,
        },
    }
];