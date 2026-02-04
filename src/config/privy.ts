// Configuração do Privy para autenticação
export const privyConfig = {
  appId: "cmdwdbrix009rky0ch4w7hgvm", // App ID do Privy (hardcoded)
  config: {
    // Configurações de login
    loginMethods: ["email", "wallet"] as (
      | "email"
      | "github"
      | "google"
      | "sms"
      | "wallet"
      | "twitter"
      | "discord"
      | "linkedin"
      | "spotify"
      | "instagram"
      | "tiktok"
      | "apple"
      | "farcaster"
      | "telegram"
    )[],

    // Configurações de aparência
    appearance: {
      theme: "dark" as const,
      accentColor: "#6366F1" as const,
      logo: "/logo.svg",
      showWalletLoginFirst: false,
    },

    // Configurações de wallet embarcada
    embeddedWallets: {
      createOnLogin: "users-without-wallets" as const,
      requireUserPasswordOnCreate: true,
      noPromptOnSignature: false,
    },

    // Configurações de MFA
    mfa: {
      noPromptOnMfaRequired: false,
    },

    // Configurações legais
    legal: {
      termsAndConditionsUrl: "/terms",
      privacyPolicyUrl: "/privacy",
    },

    // Configurações de rede
    supportedChains: [
      {
        id: 1, // Ethereum Mainnet
        name: "Ethereum",
        network: "homestead",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: [
              "https://eth-mainnet.g.alchemy.com/v2/" +
                (process.env.VITE_ALCHEMY_API_KEY || ""),
            ],
          },
          public: {
            http: [
              "https://eth-mainnet.g.alchemy.com/v2/" +
                (process.env.VITE_ALCHEMY_API_KEY || ""),
            ],
          },
        },
        blockExplorers: {
          default: {
            name: "Etherscan",
            url: "https://etherscan.io",
          },
        },
      },
      {
        id: 137, // Polygon Mainnet
        name: "Polygon",
        network: "matic",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: [
              "https://polygon-mainnet.g.alchemy.com/v2/" +
                (process.env.VITE_ALCHEMY_API_KEY || ""),
            ],
          },
          public: {
            http: [
              "https://polygon-mainnet.g.alchemy.com/v2/" +
                (process.env.VITE_ALCHEMY_API_KEY || ""),
            ],
          },
        },
        blockExplorers: {
          default: {
            name: "PolygonScan",
            url: "https://polygonscan.com",
          },
        },
      },
      {
        id: 8453, // Base
        name: "Base",
        network: "base",
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ["https://mainnet.base.org"],
          },
          public: {
            http: ["https://mainnet.base.org"],
          },
        },
        blockExplorers: {
          default: {
            name: "BaseScan",
            url: "https://basescan.org",
          },
        },
      },
    ],
  },
};
