// Configurações de ambiente para SEO e Analytics
export const seoConfig = {
  // Google Analytics
  gaId: import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XXXXXXXXXX",

  // Google Tag Manager
  gtmId: import.meta.env.VITE_GTM_ID || "GTM-XXXXXXX",

  // Site Configuration
  siteUrl:
    import.meta.env.VITE_SITE_URL || "https://gosouza.github.io/Xperience",
  siteName: import.meta.env.VITE_SITE_NAME || "Xperience",

  // SEO Defaults
  defaultTitle:
    import.meta.env.VITE_DEFAULT_TITLE ||
    "Xperience - Mentoria para Empreendedores",
  defaultDescription:
    import.meta.env.VITE_DEFAULT_DESCRIPTION ||
    "Transforme sua ideia em um negócio de sucesso com nossa mentoria especializada",
  defaultKeywords:
    import.meta.env.VITE_DEFAULT_KEYWORDS ||
    "mentoria empresarial, consultoria para empreendedores, IA do empreendedor",

  // Feature Flags
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== "false",
  enablePWA: import.meta.env.VITE_ENABLE_PWA !== "false",
  enablePerformanceMonitoring:
    import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING !== "false",

  // Development
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

export default seoConfig;
