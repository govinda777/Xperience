// Configuração do Privy para autenticação e pagamentos
export const privyConfig = {
  appId: process.env.VITE_PRIVY_APP_ID || 'cmdwdbrix009rky0ch4w7hgvm', // App ID do Privy
  config: {
    // Configurações de login
    loginMethods: ['email', 'sms', 'wallet', 'google', 'github'] as ('email' | 'github' | 'google' | 'sms' | 'wallet' | 'twitter' | 'discord' | 'linkedin' | 'spotify' | 'instagram' | 'tiktok' | 'apple' | 'farcaster' | 'telegram')[],
    
    // Configurações de aparência
    appearance: {
      theme: 'dark' as const,
      accentColor: '#6366F1' as const,
      logo: '/logo.svg',
      showWalletLoginFirst: false,
    },
    
    // Configurações de wallet embarcada
    embeddedWallets: {
      createOnLogin: 'users-without-wallets' as const,
      requireUserPasswordOnCreate: true,
      noPromptOnSignature: false,
    },
    
    // Configurações de MFA
    mfa: {
      noPromptOnMfaRequired: false,
    },
    
    // Configurações legais
    legal: {
      termsAndConditionsUrl: '/terms',
      privacyPolicyUrl: '/privacy',
    },
    
    // Configurações de rede
    supportedChains: [
      {
        id: 1, // Ethereum Mainnet
        name: 'Ethereum',
        network: 'homestead',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://eth-mainnet.g.alchemy.com/v2/' + (process.env.VITE_ALCHEMY_API_KEY || '')],
          },
          public: {
            http: ['https://eth-mainnet.g.alchemy.com/v2/' + (process.env.VITE_ALCHEMY_API_KEY || '')],
          },
        },
        blockExplorers: {
          default: {
            name: 'Etherscan',
            url: 'https://etherscan.io',
          },
        },
      },
      {
        id: 137, // Polygon Mainnet
        name: 'Polygon',
        network: 'matic',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://polygon-mainnet.g.alchemy.com/v2/' + (process.env.VITE_ALCHEMY_API_KEY || '')],
          },
          public: {
            http: ['https://polygon-mainnet.g.alchemy.com/v2/' + (process.env.VITE_ALCHEMY_API_KEY || '')],
          },
        },
        blockExplorers: {
          default: {
            name: 'PolygonScan',
            url: 'https://polygonscan.com',
          },
        },
      },
      {
        id: 8453, // Base
        name: 'Base',
        network: 'base',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ['https://mainnet.base.org'],
          },
          public: {
            http: ['https://mainnet.base.org'],
          },
        },
        blockExplorers: {
          default: {
            name: 'BaseScan',
            url: 'https://basescan.org',
          },
        },
      },
    ],
  },
};

// Configurações específicas para pagamentos
export const paymentConfig = {
  // Configurações PIX (via Privy + Mercado Pago)
  pix: {
    enabled: true,
    provider: 'mercadopago',
    publicKey: process.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '',
    sandboxMode: process.env.NODE_ENV !== 'production',
  },
  
  // Configurações Bitcoin
  bitcoin: {
    enabled: true,
    network: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
    apiUrl: process.env.VITE_BITCOIN_API_URL || 'https://blockstream.info/api',
  },
  
  // Configurações USDT
  usdt: {
    enabled: true,
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT on Ethereum
    polygonContractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT on Polygon
    decimals: 6,
  },
  
  // Configurações GitHub Pay
  githubPay: {
    enabled: true,
    clientId: process.env.VITE_GITHUB_CLIENT_ID || '',
    sponsorshipTiers: [
      { amount: 1500, tier: 'START' },
      { amount: 3000, tier: 'ESSENCIAL' },
      { amount: 6000, tier: 'PRINCIPAL' },
      { amount: 10000, tier: 'AVANÇADA' },
      { amount: 30000, tier: 'PREMIUM' },
    ],
  },
  
  // Configurações gerais
  general: {
    currency: 'BRL',
    locale: 'pt-BR',
    timeoutMinutes: 30,
    webhookUrl: process.env.VITE_WEBHOOK_URL || '/api/webhooks/payment',
  },
};

// Tipos para configuração
export interface PaymentMethod {
  id: 'pix' | 'bitcoin' | 'usdt' | 'github';
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  processingTime: string;
  fees: {
    percentage: number;
    fixed: number;
  };
}

export const availablePaymentMethods: PaymentMethod[] = [
  {
    id: 'pix',
    name: 'PIX',
    icon: '🇧🇷',
    description: 'Pagamento instantâneo via PIX',
    enabled: paymentConfig.pix.enabled,
    processingTime: 'Instantâneo',
    fees: {
      percentage: 0,
      fixed: 0,
    },
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    icon: '₿',
    description: 'Pagamento em Bitcoin',
    enabled: paymentConfig.bitcoin.enabled,
    processingTime: '10-60 minutos',
    fees: {
      percentage: 1,
      fixed: 0,
    },
  },
  {
    id: 'usdt',
    name: 'USDT',
    icon: '💵',
    description: 'Pagamento em USDT (Tether)',
    enabled: paymentConfig.usdt.enabled,
    processingTime: '1-5 minutos',
    fees: {
      percentage: 0.5,
      fixed: 0,
    },
  },
  {
    id: 'github',
    name: 'GitHub Pay',
    icon: '🐙',
    description: 'Pagamento via GitHub Sponsors',
    enabled: paymentConfig.githubPay.enabled,
    processingTime: '1-3 dias úteis',
    fees: {
      percentage: 3,
      fixed: 0,
    },
  },
];
