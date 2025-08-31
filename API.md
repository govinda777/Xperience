# API e Serviços - Xperience Platform

## 📋 Visão Geral

Esta documentação descreve os serviços, APIs e integrações da plataforma Xperience. O sistema é construído com arquitetura orientada a serviços, facilitando manutenção e escalabilidade.

## 🏗️ Arquitetura de Serviços

### Camadas de Serviço

```
┌─────────────────────────────────────────┐
│              UI Components              │
├─────────────────────────────────────────┤
│               Services                  │
├─────────────────────────────────────────┤
│              Providers                  │
├─────────────────────────────────────────┤
│           External APIs                 │
└─────────────────────────────────────────┘
```

## 💳 Payment Service

### PaymentService

Serviço principal para orquestração de pagamentos.

```typescript
interface PaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  getPaymentMethods(): PaymentMethod[];
  validatePaymentData(data: PaymentData): ValidationResult;
}
```

#### Métodos

##### `processPayment(request: PaymentRequest)`

Processa um pagamento usando o provider apropriado.

**Parâmetros:**
```typescript
interface PaymentRequest {
  method: 'pix' | 'bitcoin' | 'usdt' | 'card';
  amount: number;
  currency: string;
  customerData: CustomerData;
  metadata?: Record<string, any>;
}
```

**Retorno:**
```typescript
interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  qrCode?: string;
  error?: string;
}
```

**Exemplo de Uso:**
```typescript
const paymentService = new PaymentService();

const result = await paymentService.processPayment({
  method: 'pix',
  amount: 299.90,
  currency: 'BRL',
  customerData: {
    name: 'João Silva',
    email: 'joao@email.com',
    document: '12345678901'
  }
});

if (result.success) {
  console.log('QR Code:', result.qrCode);
}
```

## 🔌 Payment Providers

### PixPaymentProvider

Provider para pagamentos PIX via MercadoPago.

```typescript
interface PixPaymentProvider {
  createPayment(data: PixPaymentData): Promise<PixPaymentResult>;
  checkPaymentStatus(paymentId: string): Promise<PaymentStatus>;
}
```

#### Configuração

```typescript
const pixProvider = new PixPaymentProvider({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  publicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
  sandbox: process.env.NODE_ENV !== 'production'
});
```

#### Métodos

##### `createPayment(data: PixPaymentData)`

**Parâmetros:**
```typescript
interface PixPaymentData {
  amount: number;
  description: string;
  payer: {
    email: string;
    name: string;
    identification: {
      type: 'CPF' | 'CNPJ';
      number: string;
    };
  };
  expirationDate?: Date;
}
```

**Retorno:**
```typescript
interface PixPaymentResult {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  paymentUrl: string;
  expiresAt: Date;
}
```

### BitcoinPaymentProvider

Provider para pagamentos em Bitcoin.

```typescript
interface BitcoinPaymentProvider {
  generateAddress(): Promise<BitcoinAddress>;
  validateTransaction(txHash: string): Promise<TransactionValidation>;
  calculateDiscount(amount: number): number; // 5% discount
}
```

#### Exemplo

```typescript
const bitcoinProvider = new BitcoinPaymentProvider({
  network: 'mainnet', // or 'testnet'
  apiKey: process.env.BITCOIN_API_KEY
});

const address = await bitcoinProvider.generateAddress();
const discountedAmount = bitcoinProvider.calculateDiscount(1000); // 950
```

### USDTPaymentProvider

Provider para pagamentos em USDT (TRC20).

```typescript
interface USDTPaymentProvider {
  generateTRC20Address(): Promise<TRC20Address>;
  validateUSDTTransaction(txHash: string): Promise<USDTValidation>;
  calculateDiscount(amount: number): number; // 3% discount
}
```

## 🛒 Cart Service

Serviço de gerenciamento do carrinho de compras.

```typescript
interface CartService {
  addItem(item: CartItem): void;
  removeItem(itemId: string): void;
  updateQuantity(itemId: string, quantity: number): void;
  getTotal(): number;
  clear(): void;
  getItems(): CartItem[];
}
```

### Tipos

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'mentoria' | 'consultoria' | 'curso';
  metadata?: Record<string, any>;
}

interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Exemplo de Uso

```typescript
const cartService = new CartService();

// Adicionar item
cartService.addItem({
  id: 'plan-essential',
  name: 'Plano Essencial',
  price: 3000,
  quantity: 1,
  category: 'mentoria'
});

// Calcular total
const total = cartService.getTotal(); // 3000

// Limpar carrinho
cartService.clear();
```

## 🔐 Authentication Services

### Auth0 Integration

```typescript
interface Auth0Service {
  login(): Promise<void>;
  logout(): Promise<void>;
  getUser(): Promise<User | null>;
  getToken(): Promise<string | null>;
  isAuthenticated(): boolean;
}
```

### Web3 Authentication

```typescript
interface Web3AuthService {
  connectWallet(): Promise<WalletConnection>;
  signMessage(message: string): Promise<string>;
  getAddress(): Promise<string>;
  disconnect(): void;
}
```

## 🌐 TON Connect Integration

### TonConnectService

```typescript
interface TonConnectService {
  connect(): Promise<TonWallet>;
  sendTransaction(transaction: TonTransaction): Promise<TonResult>;
  getBalance(): Promise<string>;
  disconnect(): void;
}
```

### Exemplo

```typescript
const tonService = new TonConnectService();

// Conectar carteira
const wallet = await tonService.connect();
console.log('Connected:', wallet.address);

// Enviar transação
const result = await tonService.sendTransaction({
  to: 'EQD...',
  amount: '1000000000', // 1 TON
  payload: 'Payment for mentorship'
});
```

## 📊 Analytics Service

### AnalyticsService

```typescript
interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(page: string): void;
  trackPurchase(purchase: PurchaseEvent): void;
  setUserId(userId: string): void;
}
```

### Eventos

```typescript
interface AnalyticsEvent {
  name: string;
  category: 'payment' | 'navigation' | 'user_action';
  properties?: Record<string, any>;
}

interface PurchaseEvent {
  transactionId: string;
  value: number;
  currency: string;
  items: PurchaseItem[];
}
```

## 🔧 Configuration Services

### Environment Configuration

```typescript
interface EnvConfig {
  // Auth0
  AUTH0_DOMAIN: string;
  AUTH0_CLIENT_ID: string;
  AUTH0_AUDIENCE: string;

  // MercadoPago
  MERCADOPAGO_PUBLIC_KEY: string;
  MERCADOPAGO_ACCESS_TOKEN: string;

  // TON
  TON_NETWORK: 'mainnet' | 'testnet';
  TON_API_KEY: string;

  // Analytics
  GA_MEASUREMENT_ID: string;

  // General
  NODE_ENV: 'development' | 'production';
  API_BASE_URL: string;
}
```

## 🚨 Error Handling

### PaymentError

```typescript
class PaymentError extends Error {
  constructor(
    message: string,
    public code: PaymentErrorCode,
    public provider: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

enum PaymentErrorCode {
  INVALID_DATA = 'INVALID_DATA',
  NETWORK_ERROR = 'NETWORK_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  TIMEOUT = 'TIMEOUT',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS'
}
```

### Exemplo de Tratamento

```typescript
try {
  const result = await paymentService.processPayment(request);
} catch (error) {
  if (error instanceof PaymentError) {
    switch (error.code) {
      case PaymentErrorCode.INVALID_DATA:
        showValidationError(error.details);
        break;
      case PaymentErrorCode.NETWORK_ERROR:
        showNetworkError();
        break;
      default:
        showGenericError();
    }
  }
}
```

## 🧪 Testing Services

### Mock Services

Para testes, utilizamos mocks dos serviços:

```typescript
// Mock Payment Service
const mockPaymentService = {
  processPayment: jest.fn().mockResolvedValue({
    success: true,
    transactionId: 'mock-tx-123',
    qrCode: 'mock-qr-code'
  })
};

// Mock Cart Service
const mockCartService = {
  addItem: jest.fn(),
  getTotal: jest.fn().mockReturnValue(1000),
  getItems: jest.fn().mockReturnValue([])
};
```

### MSW (Mock Service Worker)

Para testes de integração:

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // MercadoPago PIX
  http.post('/v1/payments', () => {
    return HttpResponse.json({
      id: 'mock-payment-123',
      point_of_interaction: {
        transaction_data: {
          qr_code: 'mock-qr-code',
          qr_code_base64: 'data:image/png;base64,mock'
        }
      }
    });
  }),

  // Bitcoin API
  http.post('/api/bitcoin/address', () => {
    return HttpResponse.json({
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      privateKey: 'mock-private-key'
    });
  })
];
```

## 📈 Performance Monitoring

### Service Performance

```typescript
interface ServiceMetrics {
  responseTime: number;
  successRate: number;
  errorRate: number;
  throughput: number;
}

class ServiceMonitor {
  static trackServiceCall(serviceName: string, duration: number, success: boolean) {
    // Track metrics
  }
}
```

## 🔄 Service Lifecycle

### Initialization

```typescript
// Service initialization order
export const initializeServices = async () => {
  // 1. Configuration
  await configService.load();
  
  // 2. Authentication
  await authService.initialize();
  
  // 3. Payment providers
  await paymentService.initialize();
  
  // 4. Analytics
  await analyticsService.initialize();
};
```

### Cleanup

```typescript
export const cleanupServices = () => {
  tonConnectService.disconnect();
  authService.logout();
  analyticsService.flush();
};
```

## 🔗 External API Integrations

### MercadoPago API

**Base URL:** `https://api.mercadopago.com`

**Endpoints utilizados:**
- `POST /v1/payments` - Criar pagamento PIX
- `GET /v1/payments/{id}` - Consultar status
- `POST /v1/payment_methods` - Listar métodos

### TON API

**Base URL:** `https://toncenter.com/api/v2`

**Endpoints utilizados:**
- `POST /sendBoc` - Enviar transação
- `GET /getAddressInformation` - Consultar saldo
- `GET /getTransactions` - Histórico de transações

## 📚 Recursos Adicionais

### Documentação Externa

- [MercadoPago Developers](https://www.mercadopago.com.br/developers)
- [TON Documentation](https://ton.org/docs)
- [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)
- [Privy Documentation](https://docs.privy.io/)

### Exemplos Completos

Veja a pasta `src/services/__tests__/` para exemplos completos de uso e testes dos serviços.

---

Esta documentação é mantida atualizada conforme a evolução dos serviços. Para dúvidas ou sugestões, abra uma issue no repositório.

