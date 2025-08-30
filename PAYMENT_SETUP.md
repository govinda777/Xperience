# 🚀 Configuração do Sistema de Pagamentos

## 📋 Visão Geral

Este documento fornece instruções detalhadas para configurar e implementar o sistema de pagamentos multi-modal do Xperience, incluindo PIX (Mercado Pago), Bitcoin e USDT (via Privy).

## 🔧 Configuração Inicial

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Configurações do Ambiente
VITE_ENVIRONMENT=development

# Mercado Pago (PIX)
VITE_MERCADO_PAGO_PUBLIC_KEY=your_mercado_pago_public_key_here
VITE_MERCADO_PAGO_ACCESS_TOKEN=your_mercado_pago_access_token_here

# Privy (Crypto Wallets)
VITE_PRIVY_APP_ID=your_privy_app_id_here
VITE_PRIVY_APP_SECRET=your_privy_app_secret_here

# URLs de API
VITE_WEBHOOK_URL=https://your-vercel-app.vercel.app/api/webhooks
VITE_API_URL=https://your-vercel-app.vercel.app/api

# Blockchain RPCs
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_project_id
BITCOIN_RPC_URL=https://blockstream.info/api
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# Segurança
VITE_ENCRYPTION_KEY=your_32_character_encryption_key_here
VITE_WEBHOOK_SECRET=your_webhook_secret_here

# Configurações opcionais
VITE_ENABLE_ANALYTICS=true
VITE_LOG_LEVEL=info
```

### 2. Configuração do Mercado Pago

1. **Criar conta no Mercado Pago Developers**:
   - Acesse: https://developers.mercadopago.com.br/
   - Crie uma aplicação
   - Obtenha as credenciais de teste e produção

2. **Configurar Webhooks**:
   - URL de notificação: `https://your-domain.com/api/webhooks/pix`
   - Eventos: `payment`

3. **Credenciais necessárias**:
   - Public Key (para frontend)
   - Access Token (para backend)

### 3. Configuração do Privy

1. **Criar conta no Privy**:
   - Acesse: https://privy.io/
   - Crie uma aplicação
   - Configure as redes suportadas (Bitcoin, Ethereum)

2. **Configurações necessárias**:
   - App ID
   - App Secret
   - Redes suportadas: Bitcoin, Ethereum

### 4. Configuração de RPCs Blockchain

1. **Ethereum (para USDT)**:
   - Infura: https://infura.io/
   - Alchemy: https://alchemy.com/
   - Ou qualquer RPC Ethereum compatível

2. **Bitcoin**:
   - Blockstream API (gratuita): https://blockstream.info/api
   - Ou qualquer RPC Bitcoin compatível

3. **Etherscan API** (opcional, para melhor monitoramento):
   - Crie conta em: https://etherscan.io/apis
   - Obtenha API key gratuita

## 🏗️ Estrutura de Arquivos Criados

```
src/
├── types/
│   └── payment.ts                 # Tipos e interfaces
├── config/
│   └── payment.ts                 # Configurações
├── services/
│   ├── paymentService.ts          # Serviço principal
│   └── providers/
│       ├── pixPaymentProvider.ts  # Provedor PIX
│       ├── bitcoinPaymentProvider.ts # Provedor Bitcoin
│       └── usdtPaymentProvider.ts # Provedor USDT
└── components/
    └── payments/
        ├── PaymentGateway.tsx     # Gateway principal
        ├── PaymentMethodSelector.tsx # Seletor de métodos
        ├── PixPaymentComponent.tsx # Componente PIX
        ├── BitcoinPaymentComponent.tsx # Componente Bitcoin
        ├── USDTPaymentComponent.tsx # Componente USDT
        └── PaymentStatusModal.tsx # Modal de status
```

## 🚀 Como Usar

### 1. Importar e Usar o Gateway de Pagamentos

```tsx
import { PaymentGateway } from './components/payments/PaymentGateway';
import { Plan } from './types/payment';

const MyComponent = () => {
  const plan: Plan = {
    id: 'basic',
    name: 'Plano Básico',
    description: 'Acesso completo por 1 mês',
    price: 97.00,
    currency: 'BRL',
    features: ['Feature 1', 'Feature 2'],
    duration: 1
  };

  const handlePaymentComplete = (result) => {
    console.log('Pagamento concluído:', result);
    // Redirecionar para área do usuário
  };

  const handlePaymentError = (error) => {
    console.error('Erro no pagamento:', error);
    // Mostrar mensagem de erro
  };

  return (
    <PaymentGateway
      plan={plan}
      userId="user123"
      onPaymentComplete={handlePaymentComplete}
      onPaymentError={handlePaymentError}
      onCancel={() => console.log('Pagamento cancelado')}
    />
  );
};
```

### 2. Inicializar Provedores (Automático)

O sistema inicializa automaticamente todos os provedores de pagamento quando o `PaymentGateway` é montado.

### 3. Monitoramento de Pagamentos

O sistema monitora automaticamente o status dos pagamentos:

- **PIX**: Verificação a cada 3 segundos
- **Bitcoin**: Verificação a cada 30 segundos
- **USDT**: Verificação a cada 30 segundos

## 💰 Descontos por Método de Pagamento

- **PIX**: 0% (preço normal)
- **Bitcoin**: 5% de desconto
- **USDT**: 3% de desconto

## 🔒 Segurança Implementada

### 1. Criptografia
- Dados sensíveis criptografados com AES-256
- Chaves armazenadas em variáveis de ambiente

### 2. Validação de Webhooks
- Verificação de assinatura HMAC
- Validação de origem das requisições

### 3. Armazenamento Seguro
- Uso de GitHub Secrets para produção
- LocalStorage apenas para dados não sensíveis

### 4. Compliance
- **LGPD**: Minimização de dados coletados
- **PCI DSS**: Não armazenamento de dados de cartão
- **AML/KYC**: Preparado para integração futura

## 📊 Monitoramento e Analytics

### 1. Métricas Coletadas
- Taxa de conversão por método
- Tempo médio de processamento
- Valor médio por transação
- Distribuição de métodos de pagamento

### 2. Logs de Auditoria
- Todas as transações são logadas
- Histórico completo de status
- Rastreabilidade total

## 🛠️ Próximos Passos para Implementação

### Fase 1: Configuração Básica ✅
- [x] Estrutura de tipos e interfaces
- [x] Serviços de pagamento
- [x] Componentes de UI
- [x] Provedores PIX, Bitcoin e USDT

### Fase 2: Backend Serverless (Próximo)
- [ ] GitHub Actions para webhooks
- [ ] Funções Vercel/Netlify
- [ ] Processamento de notificações
- [ ] Validação de pagamentos

### Fase 3: Testes e Segurança
- [ ] Testes automatizados
- [ ] Testes de integração
- [ ] Auditoria de segurança
- [ ] Validação de compliance

### Fase 4: Deploy e Monitoramento
- [ ] Deploy em produção
- [ ] Monitoramento em tempo real
- [ ] Dashboard de analytics
- [ ] Alertas automáticos

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar testes
npm test

# Verificar lint
npm run lint
```

## 📞 Suporte e Troubleshooting

### Problemas Comuns

1. **Erro de configuração Mercado Pago**:
   - Verifique se as credenciais estão corretas
   - Confirme se está usando sandbox para testes

2. **Erro de cotação de criptomoedas**:
   - Verifique conexão com APIs externas
   - Implemente fallbacks para cotações

3. **Problemas de webhook**:
   - Confirme URLs de webhook
   - Verifique logs de requisições

### Logs de Debug

Para habilitar logs detalhados:

```bash
VITE_LOG_LEVEL=debug npm run dev
```

## 📚 Recursos Adicionais

- [Documentação Mercado Pago](https://developers.mercadopago.com.br/)
- [Documentação Privy](https://docs.privy.io/)
- [Guia Bitcoin](https://bitcoin.org/en/developer-documentation)
- [Ethereum Documentation](https://ethereum.org/en/developers/docs/)

---

**Versão**: 1.0  
**Última atualização**: $(date)  
**Status**: Implementação Base Completa ✅
