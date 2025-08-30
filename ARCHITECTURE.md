# Arquitetura da Plataforma Xperience

## 📋 Visão Geral

A Xperience é uma plataforma de mentoria empresarial construída com arquitetura moderna, escalável e orientada a componentes. Este documento descreve a estrutura técnica, padrões de design e decisões arquiteturais do projeto.

## 🏗️ Arquitetura Geral

### Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Pages     │  │ Components  │  │      Contexts       │ │
│  │             │  │             │  │                     │ │
│  │ • Home      │  │ • Payments  │  │ • CartContext       │ │
│  │ • Plans     │  │ • Auth      │  │ • AnalyticsContext  │ │
│  │ • Dashboard │  │ • Layout    │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Services  │  │    Hooks    │  │       Types         │ │
│  │             │  │             │  │                     │ │
│  │ • Payment   │  │ • useCart   │  │ • Payment Types     │ │
│  │ • Auth      │  │ • useTon    │  │ • Cart Types        │ │
│  │ • Wallet    │  │ • useWallet │  │ • User Types        │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Auth0     │  │ MercadoPago │  │    TON Connect      │ │
│  │             │  │             │  │                     │ │
│  │ • OAuth     │  │ • PIX       │  │ • Wallet Connect    │ │
│  │ • JWT       │  │ • Cards     │  │ • Transactions      │ │
│  │ • Social    │  │ • Webhooks  │  │ • Smart Contracts   │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Padrões Arquiteturais

### 1. Component-Based Architecture
- **Componentes Reutilizáveis**: Cada funcionalidade é encapsulada em componentes independentes
- **Composição**: Componentes complexos são compostos por componentes menores
- **Props Interface**: Comunicação clara entre componentes via props tipadas

### 2. Service Layer Pattern
- **Separação de Responsabilidades**: Lógica de negócio isolada em services
- **Providers**: Implementações específicas para cada gateway de pagamento
- **Abstração**: Interfaces comuns para diferentes implementações

### 3. Context Pattern
- **Estado Global**: Gerenciamento de estado compartilhado via React Context
- **Providers**: Encapsulamento de lógica de estado complexa
- **Hooks Customizados**: Abstração do acesso ao contexto

## 📁 Estrutura de Pastas

```
src/
├── components/              # Componentes reutilizáveis
│   ├── __tests__/          # Testes de componentes
│   ├── payments/           # Sistema de pagamentos
│   │   ├── PaymentGateway.tsx
│   │   ├── PaymentMethodSelector.tsx
│   │   ├── PixPaymentComponent.tsx
│   │   ├── BitcoinPaymentComponent.tsx
│   │   └── USDTPaymentComponent.tsx
│   ├── cart/               # Carrinho de compras
│   │   ├── CartIcon.tsx
│   │   └── CartSidebar.tsx
│   ├── checkout/           # Processo de checkout
│   │   ├── CheckoutForm.tsx
│   │   ├── PaymentMethodSelection.tsx
│   │   └── PaymentProcessor.tsx
│   └── auth/               # Autenticação
│       └── AuthButton/
├── pages/                  # Páginas da aplicação
│   ├── __tests__/         # Testes de páginas
│   ├── Home/              # Página inicial
│   ├── Plans/             # Planos de mentoria
│   ├── Dashboard/         # Dashboard do usuário
│   ├── Cart.tsx           # Carrinho
│   └── Checkout.tsx       # Checkout
├── services/              # Lógica de negócio
│   ├── __tests__/        # Testes de serviços
│   ├── providers/        # Provedores de pagamento
│   │   ├── pixPaymentProvider.ts
│   │   ├── bitcoinPaymentProvider.ts
│   │   ├── usdtPaymentProvider.ts
│   │   └── githubPaymentProvider.ts
│   ├── paymentService.ts  # Serviço principal de pagamentos
│   ├── cart.ts           # Serviço do carrinho
│   └── userWalletService.ts # Serviço de carteiras
├── hooks/                 # Custom hooks
│   ├── __tests__/        # Testes de hooks
│   ├── useCart.ts        # Hook do carrinho
│   ├── useTonConnect.ts  # Hook TON Connect
│   └── useUserWallet.ts  # Hook de carteira do usuário
├── contexts/             # Contextos React
│   ├── CartContext.tsx   # Contexto do carrinho
│   └── AnalyticsContext.tsx # Contexto de analytics
├── types/                # Definições TypeScript
│   ├── payment.ts        # Tipos de pagamento
│   ├── cart.ts          # Tipos do carrinho
│   └── telegram-webapp.d.ts # Tipos do Telegram
├── config/               # Configurações
│   ├── env.ts           # Variáveis de ambiente
│   ├── payment.ts       # Configuração de pagamentos
│   └── privy.ts         # Configuração Privy
└── utils/                # Utilitários
    └── sitemap.ts        # Geração de sitemap
```

## 🔄 Fluxo de Dados

### 1. Fluxo de Pagamento

```
User Action → Component → Service → Provider → External API
     ↓            ↓          ↓         ↓           ↓
  Click Pay → PaymentGateway → PaymentService → PixProvider → MercadoPago
     ↑            ↑          ↑         ↑           ↑
State Update ← Component ← Service ← Provider ← API Response
```

### 2. Fluxo de Autenticação

```
User Login → AuthButton → Auth0 → JWT Token → Protected Routes
     ↓           ↓         ↓        ↓            ↓
  Success → Context Update → Local Storage → Route Access
```

### 3. Fluxo do Carrinho

```
Add Item → CartContext → Local Storage → Cart Icon Update
    ↓          ↓             ↓              ↓
Checkout → PaymentFlow → Order Service → Confirmation
```

## 🧩 Componentes Principais

### 1. Sistema de Pagamentos

#### PaymentGateway
- **Responsabilidade**: Orquestrar o processo de pagamento
- **Dependências**: PaymentService, Context de carrinho
- **Interface**: Recebe método de pagamento e valor

#### PaymentMethodSelector
- **Responsabilidade**: Seleção do método de pagamento
- **Estados**: PIX, Bitcoin, USDT, Cartão
- **Validação**: Verificação de dados obrigatórios

#### Providers Específicos
- **PixPaymentProvider**: Integração MercadoPago
- **BitcoinPaymentProvider**: Carteiras Bitcoin
- **USDTPaymentProvider**: Redes TRC20/ERC20

### 2. Sistema de Carrinho

#### CartContext
- **Estado**: Items, quantidades, total
- **Ações**: Add, remove, update, clear
- **Persistência**: Local Storage

#### CartSidebar
- **Responsabilidade**: Exibição e edição do carrinho
- **Interações**: Alterar quantidades, remover items
- **Navegação**: Redirect para checkout

### 3. Sistema de Autenticação

#### AuthButton
- **Estados**: Logado, não logado, carregando
- **Providers**: Auth0, Privy, TON Connect
- **Redirecionamento**: Dashboard após login

## 🔐 Segurança

### 1. Autenticação
- **JWT Tokens**: Validação de sessão
- **OAuth 2.0**: Login social seguro
- **Web3 Auth**: Assinatura de carteira

### 2. Pagamentos
- **Validação Client-Side**: Verificação de dados
- **Tokens Temporários**: Chaves de pagamento com expiração
- **Webhooks**: Confirmação server-side

### 3. Dados Sensíveis
- **Não Armazenamento**: Dados de cartão não salvos
- **Criptografia**: Informações sensíveis criptografadas
- **HTTPS**: Todas as comunicações seguras

## 📊 Performance

### 1. Otimizações de Build
- **Code Splitting**: Chunks separados por funcionalidade
- **Tree Shaking**: Remoção de código não utilizado
- **Minificação**: Compressão de assets

### 2. Runtime Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: React.memo e useMemo
- **Virtual Scrolling**: Listas grandes otimizadas

### 3. Caching
- **Service Worker**: Cache de assets estáticos
- **Local Storage**: Dados do usuário
- **React Query**: Cache de requisições

## 🧪 Estratégia de Testes

### 1. Testes Unitários
- **Componentes**: Testing Library
- **Services**: Jest mocks
- **Hooks**: React Hooks Testing Library

### 2. Testes de Integração
- **Fluxos Completos**: Pagamento end-to-end
- **MSW**: Mock Service Worker para APIs
- **Context Testing**: Providers e estado

### 3. Testes E2E
- **Cypress**: Jornadas críticas do usuário
- **Visual Testing**: Screenshots comparativos
- **Performance**: Lighthouse CI

## 🚀 Deploy e DevOps

### 1. Build Pipeline
```
Code Push → GitHub Actions → Tests → Build → Deploy
     ↓           ↓           ↓       ↓       ↓
  Commit → Lint & Test → Coverage → Vite Build → GitHub Pages
```

### 2. Ambientes
- **Development**: Local com hot reload
- **Staging**: GitHub Pages preview
- **Production**: GitHub Pages com domínio customizado

### 3. Monitoramento
- **Analytics**: Google Analytics 4
- **Performance**: Web Vitals
- **Errors**: Console logging

## 🔄 Padrões de Código

### 1. TypeScript
- **Strict Mode**: Tipagem rigorosa
- **Interfaces**: Contratos claros
- **Generics**: Reutilização de tipos

### 2. React
- **Functional Components**: Hooks over classes
- **Custom Hooks**: Lógica reutilizável
- **Error Boundaries**: Tratamento de erros

### 3. Styling
- **Tailwind CSS**: Utility-first
- **Styled Components**: CSS-in-JS quando necessário
- **Responsive Design**: Mobile-first

## 📈 Escalabilidade

### 1. Arquitetura Modular
- **Micro-frontends**: Potencial para divisão
- **Plugin System**: Extensibilidade via providers
- **API Gateway**: Centralização de serviços

### 2. Performance Scaling
- **CDN**: Distribuição de assets
- **Lazy Loading**: Carregamento sob demanda
- **Caching Strategy**: Múltiplas camadas

### 3. Team Scaling
- **Component Library**: Reutilização entre projetos
- **Documentation**: Storybook para componentes
- **Standards**: ESLint e Prettier

## 🔮 Futuras Melhorias

### 1. Tecnológicas
- **Server-Side Rendering**: Next.js migration
- **GraphQL**: API mais eficiente
- **Micro-services**: Backend distribuído

### 2. Funcionais
- **Real-time**: WebSocket para notificações
- **AI Integration**: Chatbot e recomendações
- **Multi-tenant**: Suporte a múltiplas organizações

### 3. DevOps
- **Kubernetes**: Orquestração de containers
- **Monitoring**: APM e logging avançado
- **A/B Testing**: Experimentação contínua

---

Esta arquitetura foi projetada para ser **escalável**, **manutenível** e **testável**, seguindo as melhores práticas da indústria e permitindo evolução contínua da plataforma.
