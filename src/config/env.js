// Environment variables with fallbacks for testing
const isDev = import.meta.env.DEV || process.env.NODE_ENV === 'development' || true;
export const ENV = {
    // Variáveis essenciais
    VITE_ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || "development",
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL || "https://xperiencehubs.com/",
    
    // Configuração do Privy
    VITE_PRIVY_APP_ID: import.meta.env.VITE_PRIVY_APP_ID || "cmdwdbrix009rky0ch4w7hgvm",
    
    // Configuração do Mercado Pago
    VITE_MERCADO_PAGO_PUBLIC_KEY: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || "TEST-123456789",
    
    // Flags de ambiente
    DEV: isDev,
    PROD: !isDev,
};
export const seoConfig = {
    title: "Xperience - Programa de Mentoria",
    description: "Programa de mentoria para empreendedores",
    keywords: "mentoria, empreendedorismo, negócios",
    author: "Xperience",
    url: "https://xperiencehubs.com/Xperience/",
    siteUrl: "https://xperiencehubs.com/Xperience/",
    enableAnalytics: !isDev,
    enablePerformanceMonitoring: !isDev,
    gaId: import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX",
    isDev,
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://xperiencehubs.com/Xperience/",
        site_name: "Xperience",
    },
    twitter: {
        handle: "@xperience",
        site: "@xperience",
        cardType: "summary_large_image",
    },
};
