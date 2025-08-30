# 💳 Sistema de Pagamentos - Xperience

Este documento fornece um guia completo para configurar e utilizar o sistema de pagamentos do projeto Xperience, que suporta múltiplos métodos de pagamento incluindo PIX, Bitcoin e USDT.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Provedores de Pagamento](#provedores-de-pagamento)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [APIs e Webhooks](#apis-e-webhooks)
- [Componentes React](#componentes-react)
- [Testes e Troubleshooting](#testes-e-troubleshooting)
- [Segurança](#segurança)
- [Deploy](#deploy)

## 🎯 Visão Geral

O sistema de pagamentos do Xperience oferece:

- **PIX**: Pagamentos instantâneos via Mercado Pago
- **Bitcoin**: Pagamentos em criptomoeda com desconto de 5%
- **USDT**: Pagamentos em stablecoin com desconto de 3%
- **Monitoramento em tempo real** de transações
- **Interface responsiva** e intuitiva
- **Webhooks** para confirmação automática
- **Conversão automática** de moedas

### Características Principais

- ✅ Múltiplos métodos de pagamento
- ✅ Descontos por método de pagamento
- ✅ QR Codes automáticos
- ✅ Monitoramento em tempo real
- ✅ Timeouts configuráveis
- ✅ Tratamento de erros robusto
- ✅ Interface moderna e responsiva

## ⚙️ Configuração Inicial

### 1. Dependências

Instale as dependências necessárias:

```bash
npm install mercadopago qrcode ethers @privy-io/react-auth crypto-js axios
```

### 2. Tipos TypeScript

Certifique-se de que os tipos estão instalados:

```bash
npm install -D @types/qrcode @types/mercadopago @types/crypto-js
```

## 🔧 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

### Configurações Gerais
```env
# Ambiente
VITE_ENVIRONMENT=development # ou 'production'

# URLs da aplicação
VITE_API_URL=https://your-app.vercel.app/api
VITE_WEBHOOK_URL=https://your-app.vercel.app/api/webhooks
```

### Mercado Pago (PIX)
```env
# Mercado Pago - PIX
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-your-public-key
VITE_MERCADO_PAGO_ACCESS_TOKEN=TEST-your-access-token

# Para produção, use:
# VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-your-production-public-key
# VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-your-production-access-token
```

### Privy (Bitcoin/USDT)
```env
# Privy - Carteiras Crypto
VITE_PRIVY_APP_ID=your-privy-app-id
VITE_PRIVY_APP_SECRET=your-privy-app-secret
```

### APIs Externas
```env
# Ethereum RPC (para USDT)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID

# Bitcoin RPC (opcional)
BITCOIN_RPC_URL=https://blockstream.info/api

# Etherscan API (para transações USDT)
ETHERSCAN_API_KEY=YourApiKeyToken
```

### Segurança
```env
# Chaves de segurança
VITE_ENCRYPTION_KEY=your-32-character-encryption-key
VITE_WEBHOOK_SECRET=your-webhook-secret-key
```

## 🏦 Provedores de Pagamento

### PIX (Mercado Pago)

#### 1. Configuração da Conta
1. Acesse [Mercado Pago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Obtenha as credenciais de teste e produção
4. Configure as URLs de webhook

#### 2. Configuração no Código
```typescript
// src/config/payment.ts
export const PAYMENT_CONFIG: PaymentConfig = {
  mercadoPago: {
    publicKey: import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY || '',
    accessToken: import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN || '',
    sandboxMode: import.meta.env.VITE_ENVIRONMENT !== 'production'
  },
  // ...
};
```

#### 3. Características
- ⏱️ Timeout: 15 minutos
- 🔄 Polling: 3 segundos
- 💰 Desconto: 0%
- 📱 QR Code automático

### Bitcoin

#### 1. Configuração
```typescript
// Configuração automática via Blockstream API
// Não requer configuração adicional para consultas
```

#### 2. Características
- ⏱️ Timeout: 1 hora
- 🔄 Polling: 30 segundos
- 💰 Desconto: 5%
- ⛓️ Confirmações: 1 mínima
- 📡 API: Blockstream.info (gratuita)

### USDT (Ethereum)

#### 1. Configuração da Infura
1. Acesse [Infura.io](https://infura.io/)
2. Crie um projeto Ethereum
3. Obtenha a URL do endpoint
4. Configure no `.env`

#### 2. Configuração da Etherscan
1. Acesse [Etherscan.io](https://etherscan.io/apis)
2. Crie uma conta e obtenha API key
3. Configure no `.env`

#### 3. Características
- ⏱️ Timeout: 1 hora
- 🔄 Polling: 30 segundos
- 💰 Desconto: 3%
- ⛓️ Confirmações: 12 mínimas
- 🏦 Contrato: USDT na Ethereum

## 📁 Estrutura de Arquivos

```
src/
├── components/payments/
│   ├── PaymentGateway.tsx          # Gateway principal
│   ├── PaymentMethodSelector.tsx   # Seletor de métodos
│   ├── PixPaymentComponent.tsx     # Componente PIX
│   ├── BitcoinPaymentComponent.tsx # Componente Bitcoin
│   ├── USDTPaymentComponent.tsx    # Componente USDT
│   ├── PaymentStatusModal.tsx      # Modal de status
│   └── index.ts                    # Exports
├── services/
│   ├── paymentService.ts           # Serviço principal
│   └── providers/
│       ├── pixPaymentProvider.ts   # Provedor PIX
│       ├── bitcoinPaymentProvider.ts # Provedor Bitcoin
│       └── usdtPaymentProvider.ts  # Provedor USDT
├── types/
│   └── payment.ts                  # Tipos TypeScript
└── config/
    └── payment.ts                  # Configurações
```

### Arquivos Principais

#### `paymentService.ts`
Serviço central que gerencia todos os provedores:
- Registro de provedores
- Processamento de pagamentos
- Verificação de status
- Conversão de moedas
- Armazenamento local

#### `payment.ts` (config)
Configurações centralizadas:
- Credenciais dos provedores
- Timeouts e intervalos
- Limites de valores
- Descontos por método
- URLs das APIs

#### `payment.ts` (types)
Definições TypeScript:
- Interfaces dos provedores
- Tipos de status
- Estruturas de dados
- Classes de erro

## 🔗 APIs e Webhooks

### Endpoints Necessários

#### 1. Webhook PIX
```typescript
// api/webhooks/pix.ts
export async function POST(request: Request) {
  const payload = await request.json();
  
  // Verificar assinatura
  const signature = request.headers.get('x-signature');
  if (!verifySignature(payload, signature)) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Processar webhook
  const { type, data } = payload;
  if (type === 'payment') {
    await updatePaymentStatus(data.id, 'completed');
  }
  
  return new Response('OK', { status: 200 });
}
```

#### 2. API de Conversão
```typescript
// api/exchange-rates.ts
export async function GET() {
  const rates = await fetchExchangeRates();
  return Response.json(rates);
}
```

### URLs de Webhook

Configure as seguintes URLs no Mercado Pago:
- **PIX**: `https://your-app.vercel.app/api/webhooks/pix`
- **Notificações**: `https://your-app.vercel.app/api/webhooks/notifications`

## ⚛️ Componentes React

### Uso Básico

```tsx
import { PaymentGateway } from './components/payments';

function CheckoutPage() {
  const plan = {
    id: 'premium',
    name: 'Plano Premium',
    description: 'Acesso completo por 1 mês',
    price: 29.90,
    currency: 'BRL',
    features: ['Feature 1', 'Feature 2'],
    duration: 1
  };

  const handlePaymentComplete = (result: PaymentResult) => {
    console.log('Pagamento concluído:', result);
    // Redirecionar ou atualizar UI
  };

  const handlePaymentError = (error: Error) => {
    console.error('Erro no pagamento:', error);
    // Mostrar mensagem de erro
  };

  return (
    <PaymentGateway
      plan={plan}
      userId="user-123"
      onPaymentComplete={handlePaymentComplete}
      onPaymentError={handlePaymentError}
      onCancel={() => console.log('Pagamento cancelado')}
    />
  );
}
```

### Componentes Individuais

#### PaymentMethodSelector
```tsx
<PaymentMethodSelector
  selected="pix"
  onChange={setSelectedMethod}
  prices={{
    pix: 29.90,
    bitcoin: 28.41,  // 5% desconto
    usdt: 29.01      // 3% desconto
  }}
  disabled={false}
/>
```

#### PaymentStatusModal
```tsx
<PaymentStatusModal
  payment={paymentResult}
  status="pending"
  method="pix"
  onClose={() => setShowModal(false)}
  onCancel={handleCancel}
/>
```

## 🧪 Testes e Troubleshooting

### Testes de Desenvolvimento

#### 1. PIX (Mercado Pago Sandbox)
```bash
# Usar credenciais de teste
VITE_MERCADO_PAGO_PUBLIC_KEY=TEST-your-test-key
VITE_MERCADO_PAGO_ACCESS_TOKEN=TEST-your-test-token
```

Cartões de teste:
- **Aprovado**: 5031 7557 3453 0604
- **Rejeitado**: 5031 7557 3453 0604

#### 2. Bitcoin (Testnet)
```typescript
// Configurar para testnet
const BITCOIN_TESTNET_API = 'https://blockstream.info/testnet/api';
```

#### 3. USDT (Sepolia Testnet)
```env
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

### Problemas Comuns

#### ❌ "Provedor não encontrado"
**Causa**: Provedor não registrado
**Solução**:
```typescript
// Verificar se o provedor foi registrado
const provider = new PixPaymentProvider();
paymentService.registerProvider(provider);
```

#### ❌ "Erro na conversão de moeda"
**Causa**: API de cotação indisponível
**Solução**:
```typescript
// Implementar fallback
const fallbackRate = 5.0; // BRL/USD aproximado
```

#### ❌ "QR Code não carrega"
**Causa**: Biblioteca QRCode não instalada
**Solução**:
```bash
npm install qrcode @types/qrcode
```

#### ❌ "Webhook não recebe notificações"
**Causa**: URL incorreta ou HTTPS necessário
**Solução**:
- Verificar URL no painel do Mercado Pago
- Usar HTTPS em produção
- Testar com ngrok em desenvolvimento

### Logs e Debug

#### Habilitar logs detalhados:
```typescript
// src/config/payment.ts
export function getEnvironmentConfig() {
  return {
    logLevel: 'debug', // 'error' | 'warn' | 'info' | 'debug'
    enableAnalytics: true
  };
}
```

#### Monitorar transações:
```typescript
// Verificar localStorage
const payments = localStorage.getItem('xperience_payments');
console.log('Pagamentos armazenados:', JSON.parse(payments || '{}'));
```

## 🔒 Segurança

### Boas Práticas

#### 1. Variáveis de Ambiente
- ✅ Nunca commitar credenciais
- ✅ Usar diferentes chaves para dev/prod
- ✅ Rotacionar chaves regularmente

#### 2. Webhooks
```typescript
// Verificar assinatura do webhook
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET!)
    .update(payload)
    .digest('hex');
  
  return signature === expectedSignature;
}
```

#### 3. Validação de Dados
```typescript
// Validar valores
if (amount < PAYMENT_CONSTANTS.MIN_PAYMENT_BRL || 
    amount > PAYMENT_CONSTANTS.MAX_PAYMENT_BRL) {
  throw new Error('Valor inválido');
}
```

#### 4. Rate Limiting
```typescript
// Implementar rate limiting para APIs
const rateLimiter = new Map();
function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || [];
  const recentRequests = userRequests.filter(time => now - time < 60000);
  
  if (recentRequests.length >= 10) {
    return false; // Muitas requisições
  }
  
  rateLimiter.set(userId, [...recentRequests, now]);
  return true;
}
```

### Criptografia

#### Dados sensíveis:
```typescript
import CryptoJS from 'crypto-js';

// Criptografar dados sensíveis
function encryptData(data: string): string {
  return CryptoJS.AES.encrypt(data, PAYMENT_CONFIG.security.encryptionKey).toString();
}

// Descriptografar dados
function decryptData(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, PAYMENT_CONFIG.security.encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}
```

## 🚀 Deploy

### Vercel

#### 1. Configurar Variáveis de Ambiente
```bash
# Via CLI
vercel env add VITE_MERCADO_PAGO_PUBLIC_KEY
vercel env add VITE_MERCADO_PAGO_ACCESS_TOKEN
# ... outras variáveis
```

#### 2. Configurar Domínio
```bash
# vercel.json
{
  "functions": {
    "api/webhooks/[...slug].ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Netlify

#### 1. Build Settings
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Variáveis de Produção

```env
# Produção
VITE_ENVIRONMENT=production
VITE_API_URL=https://your-app.vercel.app/api
VITE_WEBHOOK_URL=https://your-app.vercel.app/api/webhooks

# Mercado Pago - Produção
VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-your-production-key
VITE_MERCADO_PAGO_ACCESS_TOKEN=APP_USR-your-production-token

# Ethereum Mainnet
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

## 📊 Monitoramento

### Analytics

```typescript
// Implementar tracking de eventos
function trackPaymentEvent(event: string, data: any) {
  if (typeof gtag !== 'undefined') {
    gtag('event', event, {
      event_category: 'payment',
      event_label: data.method,
      value: data.amount
    });
  }
}

// Usar nos componentes
trackPaymentEvent('payment_initiated', { method: 'pix', amount: 29.90 });
trackPaymentEvent('payment_completed', { method: 'pix', amount: 29.90 });
```

### Métricas Importantes

- 📈 Taxa de conversão por método
- 💰 Receita total por período
- ⏱️ Tempo médio de pagamento
- ❌ Taxa de falhas por método
- 🔄 Abandono de carrinho

## 🆘 Suporte

### Contatos Úteis

- **Mercado Pago**: [Suporte Developers](https://www.mercadopago.com.br/developers/pt/support)
- **Privy**: [Documentation](https://docs.privy.io/)
- **Infura**: [Support](https://infura.io/support)

### Logs de Erro

Para reportar problemas, inclua:
1. Método de pagamento usado
2. Valor da transação
3. ID da transação
4. Logs do console
5. Configuração do ambiente

---

## 📝 Changelog

### v1.0.0 (Atual)
- ✅ Implementação PIX via Mercado Pago
- ✅ Implementação Bitcoin via Blockstream
- ✅ Implementação USDT via Ethereum
- ✅ Sistema de descontos
- ✅ Monitoramento em tempo real
- ✅ Interface responsiva
- ✅ Webhooks para PIX

### Próximas Versões
- 🔄 Suporte a Polygon para USDT
- 🔄 Lightning Network para Bitcoin
- 🔄 Mais opções de stablecoins
- 🔄 Dashboard de analytics
- 🔄 Relatórios de pagamento

---

**Desenvolvido com ❤️ para o projeto Xperience**

Para dúvidas ou sugestões, abra uma issue no repositório.
