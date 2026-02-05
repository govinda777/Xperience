// Tipos e interfaces para o sistema de pagamentos

export type PaymentProvider = "pix" | "bitcoin" | "usdt" | "github";
export type PaymentCurrency = "BRL" | "BTC" | "USDT" | "USD";
export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "expired"
  | "cancelled";

export interface PaymentState {
  id: string;
  planId: string;
  userId: string;
  amount: number;
  currency: PaymentCurrency;
  provider: PaymentProvider;
  status: PaymentStatus;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

export interface PaymentResult {
  transactionId: string;
  paymentUrl?: string;
  paymentAddress?: string;
  qrCode?: string;
  qrCodeBase64?: string;
  amount: number;
  currency: PaymentCurrency;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface PaymentProviderInterface {
  id: PaymentProvider;
  name: string;
  type: "fiat" | "crypto";
  supportedCurrencies: PaymentCurrency[];
  process(
    amount: number,
    planId: string,
    userId: string,
  ): Promise<PaymentResult>;
  verify(transactionId: string): Promise<PaymentStatus>;
  cancel?(transactionId: string): Promise<boolean>;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: PaymentCurrency;
  features: string[];
  duration: number; // em meses
  isPopular?: boolean;
}

export interface PaymentConfig {
  mercadoPago: {
    publicKey: string;
    // accessToken removed for security
    sandboxMode: boolean;
  };
  privy: {
    appId: string;
    // appSecret removed for security
    supportedChains: string[];
  };
  webhookUrl: string;
  apiUrl: string;
  // security object removed for security
}

export interface PaymentAnalytics {
  totalRevenue: number;
  totalTransactions: number;
  conversionRate: number;
  topPaymentMethod: PaymentProvider;
  methodDistribution: Record<PaymentProvider, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
}

export interface CurrencyConversion {
  from: PaymentCurrency;
  to: PaymentCurrency;
  rate: number;
  timestamp: Date;
}

export class PaymentError extends Error {
  code: string;
  provider: PaymentProvider;
  transactionId?: string;
  details?: Record<string, any>;

  constructor(options: {
    code: string;
    message: string;
    provider: PaymentProvider;
    transactionId?: string;
    details?: Record<string, any>;
  }) {
    super(options.message);
    this.name = "PaymentError";
    this.code = options.code;
    this.provider = options.provider;
    this.transactionId = options.transactionId;
    this.details = options.details;
  }
}

export interface WebhookPayload {
  provider: PaymentProvider;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  currency: PaymentCurrency;
  metadata: Record<string, any>;
  signature: string;
  timestamp: Date;
}
