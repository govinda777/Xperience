# 📁 Estrutura do Projeto - Xperience Platform

Este documento detalha a organização completa de arquivos e pastas do projeto Xperience, explicando a função de cada diretório e as convenções utilizadas.

## 📋 Visão Geral

O projeto segue uma arquitetura modular e escalável, com separação clara de responsabilidades e organização lógica dos componentes.

```
Xperience/
├── 📁 src/                    # Código fonte principal
├── 📁 public/                 # Assets estáticos
├── 📁 __tests__/              # Testes globais
├── 📁 features/               # Testes BDD (Cucumber)
├── 📁 cypress/                # Testes E2E
├── 📁 coverage/               # Relatórios de cobertura
├── 📁 dist/                   # Build de produção
├── 📁 node_modules/           # Dependências
├── 📄 Arquivos de configuração
└── 📄 Documentação
```

## 🎯 Diretório Principal (src/)

### Estrutura Detalhada

```
src/
├── 📁 components/             # Componentes reutilizáveis
│   ├── 📁 __tests__/         # Testes de componentes
│   ├── 📁 payments/          # Sistema de pagamentos
│   ├── 📁 cart/              # Carrinho de compras
│   ├── 📁 checkout/          # Processo de checkout
│   ├── 📁 auth/              # Autenticação
│   └── 📁 ui/                # Componentes de interface
├── 📁 pages/                  # Páginas da aplicação
│   ├── 📁 __tests__/         # Testes de páginas
│   ├── 📁 Home/              # Página inicial
│   ├── 📁 Plans/             # Planos de mentoria
│   ├── 📁 Dashboard/         # Dashboard do usuário
│   └── 📁 [outras páginas]
├── 📁 services/              # Lógica de negócio
│   ├── 📁 __tests__/         # Testes de serviços
│   ├── 📁 providers/         # Provedores específicos
│   └── 📄 [serviços]
├── 📁 hooks/                 # Custom hooks
├── 📁 contexts/              # Contextos React
├── 📁 types/                 # Definições TypeScript
├── 📁 utils/                 # Utilitários
├── 📁 config/                # Configurações
├── 📁 layouts/               # Layouts da aplicação
└── 📁 contracts/             # Smart contracts (TON)
```

## 🧩 Componentes (src/components/)

### Organização por Funcionalidade

#### Sistema de Pagamentos (`payments/`)

```
payments/
├── 📄 index.ts                    # Exports principais
├── 📄 PaymentGateway.tsx          # Orquestrador principal
├── 📄 PaymentMethodSelector.tsx   # Seleção de método
├── 📄 PixPaymentComponent.tsx     # Pagamento PIX
├── 📄 BitcoinPaymentComponent.tsx # Pagamento Bitcoin
├── 📄 USDTPaymentComponent.tsx    # Pagamento USDT
├── 📄 GitHubPaymentComponent.tsx  # GitHub Sponsors
├── 📄 PaymentStatusModal.tsx      # Modal de status
└── 📁 __tests__/                  # Testes específicos
    ├── 📄 PaymentGateway.test.tsx
    ├── 📄 PixPayment.test.tsx
    └── 📄 [outros testes]
```

#### Carrinho de Compras (`cart/`)

```
cart/
├── 📄 CartIcon.tsx           # Ícone com contador
├── 📄 CartSidebar.tsx        # Sidebar do carrinho
└── 📄 CartItem.tsx           # Item individual
```

#### Checkout (`checkout/`)

```
checkout/
├── 📄 CheckoutForm.tsx           # Formulário principal
├── 📄 PaymentMethodSelection.tsx # Seleção de pagamento
├── 📄 PaymentProcessor.tsx       # Processamento
└── 📄 OrderSummary.tsx          # Resumo do pedido
```

#### Autenticação (`auth/`)

```
auth/
└── 📁 AuthButton/
    ├── 📄 index.tsx          # Componente principal
    └── 📄 styles.ts          # Estilos específicos
```

#### Interface Geral

```
components/
├── 📁 Navbar/                # Navegação principal
├── 📁 Footer/                # Rodapé
├── 📁 SEOHead/               # Meta tags dinâmicas
├── 📁 LazyImage/             # Carregamento otimizado
├── 📁 ContactForm/           # Formulário de contato
└── 📁 Plans/                 # Componentes de planos
    ├── 📄 PlanCard.tsx
    ├── 📄 PlansTable.tsx
    └── 📁 [subcomponentes]
```

## 📄 Páginas (src/pages/)

### Estrutura de Páginas

```
pages/
├── 📁 __tests__/             # Testes de páginas
├── 📁 Home/                  # Página inicial
│   ├── 📄 index.tsx          # Componente principal
│   ├── 📄 Hero.tsx           # Seção hero
│   ├── 📄 Solutions.tsx      # Seção soluções
│   ├── 📄 CommunitySection.tsx
│   └── 📄 TestimonialSection.tsx
├── 📁 Plans/                 # Planos de mentoria
│   ├── 📄 index.tsx
│   └── 📄 EnjoyTools.tsx
├── 📁 Dashboard/             # Dashboard do usuário
│   ├── 📄 index.tsx
│   └── 📄 [componentes específicos]
├── 📁 Solutions/             # Página de soluções
├── 📁 Contact/               # Página de contato
├── 📁 About/                 # Sobre nós
├── 📁 Community/             # Comunidade
├── 📄 Cart.tsx               # Página do carrinho
├── 📄 Checkout.tsx           # Página de checkout
└── 📄 WalletManagement.tsx   # Gestão de carteira
```

### Padrão de Organização de Páginas

Cada página complexa segue o padrão:

```
PageName/
├── 📄 index.tsx              # Componente principal da página
├── 📄 Section1.tsx           # Seções específicas
├── 📄 Section2.tsx
└── 📄 [outros componentes]
```

## 🔧 Serviços (src/services/)

### Organização de Serviços

```
services/
├── 📁 __tests__/             # Testes de serviços
├── 📁 providers/             # Provedores específicos
│   ├── 📄 pixPaymentProvider.ts
│   ├── 📄 bitcoinPaymentProvider.ts
│   ├── 📄 usdtPaymentProvider.ts
│   ├── 📄 githubPaymentProvider.ts
│   └── 📄 privyPaymentProvider.ts
├── 📄 paymentService.ts      # Serviço principal de pagamentos
├── 📄 cart.ts                # Serviço do carrinho
├── 📄 products.ts            # Serviço de produtos
├── 📄 orderService.ts        # Serviço de pedidos
├── 📄 userWalletService.ts   # Serviço de carteiras
├── 📄 walletService.ts       # Serviço de carteira geral
├── 📄 accountAbstraction.ts  # Account Abstraction
└── 📄 seoService.ts          # Serviço de SEO
```

### Padrão de Providers

```
providers/
├── 📄 [provider]PaymentProvider.ts    # Implementação específica
└── 📁 __tests__/
    └── 📄 [provider]Provider.test.ts  # Testes do provider
```

## 🎣 Hooks Customizados (src/hooks/)

```
hooks/
├── 📁 __tests__/             # Testes de hooks
├── 📄 useCart.ts             # Hook do carrinho
├── 📄 useTonConnect.ts       # Hook TON Connect
├── 📄 useUserWallet.ts       # Hook de carteira
├── 📄 useAsyncInitialize.ts  # Inicialização assíncrona
├── 📄 useCounterContract.ts  # Contrato contador
├── 📄 useFaucetJettonContract.ts # Contrato jetton
├── 📄 useTonClient.ts        # Cliente TON
└── 📄 usePerformance.ts      # Métricas de performance
```

## 🌐 Contextos (src/contexts/)

```
contexts/
├── 📄 CartContext.tsx        # Contexto do carrinho
└── 📄 AnalyticsContext.tsx   # Contexto de analytics
```

### Padrão de Contextos

```typescript
// Estrutura padrão de um contexto
contexts/
├── 📄 [Name]Context.tsx      # Provider e hook
└── 📄 types.ts               # Tipos específicos (se necessário)
```

## 📝 Tipos TypeScript (src/types/)

```
types/
├── 📄 payment.ts             # Tipos de pagamento
├── 📄 cart.ts                # Tipos do carrinho
├── 📄 user.ts                # Tipos do usuário
└── 📄 telegram-webapp.d.ts   # Tipos do Telegram
```

## ⚙️ Configurações (src/config/)

```
config/
├── 📄 env.ts                 # Variáveis de ambiente
├── 📄 payment.ts             # Configuração de pagamentos
└── 📄 privy.ts               # Configuração Privy
```

## 🏗️ Layouts (src/layouts/)

```
layouts/
└── 📄 DefaultLayout.tsx      # Layout padrão da aplicação
```

## 📄 Contratos Smart (src/contracts/)

```
contracts/
├── 📁 __tests__/             # Testes de contratos
├── 📄 counter.ts             # Contrato contador
├── 📄 faucetJetton.ts        # Contrato jetton faucet
└── 📄 faucetJettonWallet.ts  # Wallet jetton
```

## 🧪 Testes (**tests**/ e outros)

### Estrutura Global de Testes

```
__tests__/                    # Testes globais
├── 📄 example.test.ts        # Exemplo de teste

src/
├── 📁 __tests__/             # Testes do src
│   ├── 📁 components/        # Testes de componentes
│   ├── 📁 services/          # Testes de serviços
│   ├── 📁 hooks/             # Testes de hooks
│   ├── 📁 integration/       # Testes de integração
│   └── 📁 mocks/             # Mocks para testes

features/                     # Testes BDD (Cucumber)
├── 📄 payment-journey.feature
├── 📄 user_authentication.feature
└── 📁 step_definitions/

cypress/                      # Testes E2E
├── 📁 e2e/
├── 📁 support/
└── 📁 screenshots/
```

## 📁 Assets Estáticos (public/)

```
public/
├── 📄 index.html             # Template HTML
├── 📄 manifest.webmanifest   # PWA manifest
├── 📄 robots.txt             # SEO robots
├── 📄 sitemap.xml            # Sitemap SEO
├── 📄 404.html               # Página 404 (GitHub Pages)
├── 📁 assets/                # Imagens e assets
│   ├── 📄 logo.svg
│   ├── 📄 logo.jpg
│   └── 📁 svg/               # Ícones SVG
└── 📄 [outros assets]
```

## 📋 Arquivos de Configuração (Raiz)

### Configurações de Build e Desenvolvimento

```
📄 package.json              # Dependências e scripts
📄 package-lock.json         # Lock de dependências
📄 yarn.lock                 # Lock do Yarn
📄 vite.config.ts            # Configuração Vite
📄 tsconfig.json             # Configuração TypeScript
📄 tsconfig.node.json        # TS config para Node
📄 tailwind.config.js        # Configuração Tailwind
📄 postcss.config.js         # Configuração PostCSS
```

### Configurações de Qualidade

```
📄 eslint.config.js          # Configuração ESLint
📄 jest.config.cjs           # Configuração Jest
📄 jest.setup.js             # Setup dos testes
📄 cypress.config.ts         # Configuração Cypress
📄 cucumber.js               # Configuração Cucumber
```

### Configurações de Deploy

```
📄 Dockerfile               # Container Docker
📄 .github/workflows/       # GitHub Actions
📄 netlify.toml             # Configuração Netlify (se usado)
📄 vercel.json              # Configuração Vercel (se usado)
```

## 📚 Documentação

```
📄 README.md                 # Documentação principal
📄 ARCHITECTURE.md           # Arquitetura do sistema
📄 API.md                    # Documentação da API
📄 CONTRIBUTING.md           # Guia de contribuição
📄 DEPLOYMENT.md             # Guia de deploy
📄 TESTING.md                # Guia de testes
📄 PROJECT_STRUCTURE.md      # Este documento
📄 LICENSE                   # Licença MIT
```

### Documentação Específica

```
📄 AUTHENTICATION_AUTHORIZATION.md  # Auth e autorização
📄 PAYMENT_IMPLEMENTATION_PLAN.md   # Plano de pagamentos
📄 SEO_IMPLEMENTATION_PLAN.md       # Plano de SEO
📄 GITHUB_PAGES_DEPLOY.md           # Deploy GitHub Pages
📄 BLUE_OCEAN.md                    # Estratégia Oceano Azul
📄 TOKEN.md                         # Documentação de tokens
```

## 🎯 Convenções de Nomenclatura

### Arquivos e Pastas

- **Componentes**: PascalCase (`PaymentButton.tsx`)
- **Páginas**: PascalCase (`Home/index.tsx`)
- **Serviços**: camelCase (`paymentService.ts`)
- **Hooks**: camelCase com prefixo `use` (`useCart.ts`)
- **Tipos**: camelCase (`payment.ts`)
- **Utilitários**: camelCase (`formatCurrency.ts`)
- **Testes**: Nome do arquivo + `.test.ts` ou `.test.tsx`

### Estrutura de Pastas

- **Funcionalidades**: Agrupadas por domínio (`payments/`, `cart/`)
- **Tipos**: Agrupados por contexto (`types/payment.ts`)
- **Testes**: Espelhando a estrutura do código (`__tests__/components/`)

### Imports e Exports

```typescript
// ✅ Bom - Barrel exports
// src/components/payments/index.ts
export { PaymentGateway } from "./PaymentGateway";
export { PaymentMethodSelector } from "./PaymentMethodSelector";
export { PixPaymentComponent } from "./PixPaymentComponent";

// ✅ Bom - Import do barrel
import { PaymentGateway, PixPaymentComponent } from "@/components/payments";
```

## 🔄 Fluxo de Desenvolvimento

### Adicionando Nova Funcionalidade

1. **Criar estrutura de pastas** seguindo convenções
2. **Implementar componentes** com testes
3. **Adicionar tipos** TypeScript
4. **Criar serviços** necessários
5. **Implementar testes** (unit, integration, e2e)
6. **Atualizar documentação**

### Exemplo: Nova Funcionalidade de Notificações

```
src/
├── components/
│   └── notifications/
│       ├── index.ts
│       ├── NotificationCenter.tsx
│       ├── NotificationItem.tsx
│       └── __tests__/
├── services/
│   ├── notificationService.ts
│   └── __tests__/
├── hooks/
│   ├── useNotifications.ts
│   └── __tests__/
├── types/
│   └── notification.ts
└── contexts/
    └── NotificationContext.tsx
```

## 📊 Métricas e Monitoramento

### Estrutura de Arquivos de Métricas

```
src/utils/
├── 📄 analytics.ts          # Google Analytics
├── 📄 performance.ts        # Web Vitals
└── 📄 errorTracking.ts      # Error tracking

coverage/                    # Relatórios de cobertura
├── 📄 lcov.info
└── 📁 lcov-report/

reports/                     # Relatórios de testes
├── 📄 cucumber-report.html
└── 📄 lighthouse-report.html
```

## 🔧 Scripts e Automação

### Scripts de Desenvolvimento

```
scripts/
├── 📄 test-setup.js         # Setup de testes
└── 📄 [outros scripts]

pipeline.sh                  # Pipeline de CI/CD
generate-tree.sh             # Geração de árvore de arquivos
```

## 🎉 Resumo da Organização

### Princípios Seguidos

1. **Separação de Responsabilidades**: Cada pasta tem uma função específica
2. **Modularidade**: Componentes e serviços independentes
3. **Testabilidade**: Estrutura que facilita testes
4. **Escalabilidade**: Fácil adição de novas funcionalidades
5. **Manutenibilidade**: Código organizado e documentado

### Benefícios da Estrutura

- ✅ **Fácil navegação** no código
- ✅ **Rápida localização** de funcionalidades
- ✅ **Desenvolvimento paralelo** de features
- ✅ **Testes organizados** por contexto
- ✅ **Documentação clara** e acessível
- ✅ **Deploy automatizado** e confiável

---

Esta estrutura foi projetada para crescer com o projeto, mantendo organização e clareza mesmo com o aumento da complexidade e do time de desenvolvimento.

_Para dúvidas sobre a organização ou sugestões de melhorias, consulte o [CONTRIBUTING.md](./CONTRIBUTING.md) ou abra uma issue no repositório._
