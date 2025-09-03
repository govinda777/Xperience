# 🧪 Guia Completo de Testes - Xperience Platform

Este documento descreve a estratégia abrangente de testes implementada para toda a plataforma Xperience, incluindo jornadas de pagamento, autenticação, componentes e serviços.

## 📋 Visão Geral

A implementação de testes segue uma abordagem em camadas com cobertura completa:

- **Testes Unitários**: Componentes e serviços isolados (70%+ cobertura)
- **Testes de Integração**: Fluxos completos de funcionalidades
- **Testes BDD**: Cenários de negócio em linguagem natural
- **Testes E2E**: Validação completa da interface do usuário
- **Testes de Performance**: Lighthouse CI e métricas de performance
- **Testes de Acessibilidade**: Conformidade com WCAG 2.1

### 🎯 Objetivos dos Testes

- **Qualidade**: Garantir funcionamento correto de todas as funcionalidades
- **Confiabilidade**: Detectar regressões antes do deploy
- **Performance**: Manter métricas de performance otimizadas
- **Acessibilidade**: Garantir usabilidade para todos os usuários
- **Segurança**: Validar fluxos de autenticação e pagamento

## 🧪 Tipos de Testes

### 1. Testes Unitários

Localização: `src/__tests__/components/`, `src/__tests__/services/`, `src/__tests__/hooks/`

#### 🧩 Componentes Testados

**Sistema de Pagamentos:**

- `PaymentMethodSelector`: Seleção de métodos de pagamento
- `PixPaymentComponent`: Interface de pagamento PIX
- `BitcoinPaymentComponent`: Interface de pagamento Bitcoin
- `USDTPaymentComponent`: Interface de pagamento USDT
- `PaymentStatusModal`: Modal de status do pagamento
- `PaymentGateway`: Orquestrador de pagamentos

**Sistema de Carrinho:**

- `CartIcon`: Ícone do carrinho com contador
- `CartSidebar`: Sidebar do carrinho
- `CheckoutForm`: Formulário de checkout

**Autenticação:**

- `AuthButton`: Botão de login/logout
- `ProtectedRoute`: Proteção de rotas

**Interface Geral:**

- `Navbar`: Navegação principal
- `Footer`: Rodapé com links
- `SEOHead`: Meta tags dinâmicas
- `LazyImage`: Carregamento otimizado de imagens

#### 🔧 Serviços Testados

**Providers de Pagamento:**

- `PixPaymentProvider`: Provider de pagamento PIX
- `BitcoinPaymentProvider`: Provider de pagamento Bitcoin
- `USDTPaymentProvider`: Provider de pagamento USDT
- `GitHubPaymentProvider`: Provider GitHub Sponsors

**Serviços de Negócio:**

- `PaymentService`: Orquestração de pagamentos
- `CartService`: Gerenciamento do carrinho
- `UserWalletService`: Gestão de carteiras
- `SEOService`: Otimização SEO

#### 🎣 Hooks Testados

**Hooks Customizados:**

- `useCart`: Gerenciamento do carrinho
- `useTonConnect`: Integração TON Connect
- `useUserWallet`: Carteira do usuário
- `useAsyncInitialize`: Inicialização assíncrona
- `usePerformance`: Métricas de performance

### 2. Testes de Integração

Localização: `src/__tests__/integration/`

**Fluxos testados:**

- Jornada completa de pagamento PIX
- Validação de dados de pagamento
- Tratamento de erros e recuperação
- Monitoramento de status de pagamento
- Funcionalidades mobile

### 3. Testes BDD (Behavior Driven Development)

Localização: `features/`

**Cenários cobertos:**

- Pagamento bem-sucedido via PIX, Bitcoin e USDT
- Validação de dados de entrada
- Tratamento de erros do servidor
- Timeout de pagamentos
- Cancelamento de pagamentos
- Verificação de segurança

### 4. Testes de Performance

Localização: `lighthouse.config.js`, `src/__tests__/performance/`

**Métricas Monitoradas:**

- **Core Web Vitals**: LCP, FID, CLS
- **Performance Score**: Lighthouse > 90
- **Accessibility Score**: > 95
- **SEO Score**: > 95
- **Best Practices**: > 90

**Ferramentas Utilizadas:**

- **Lighthouse CI**: Testes automatizados de performance
- **Web Vitals**: Métricas em tempo real
- **Bundle Analyzer**: Análise de tamanho dos chunks

### 5. Testes de Acessibilidade

**Verificações Automáticas:**

- **axe-core**: Testes de acessibilidade automatizados
- **ARIA**: Validação de atributos ARIA
- **Contraste**: Verificação de contraste de cores
- **Navegação por Teclado**: Testes de navegação

**Conformidade:**

- **WCAG 2.1 AA**: Nível de conformidade
- **Screen Readers**: Compatibilidade testada
- **Keyboard Navigation**: Navegação completa por teclado

### 6. Testes de Segurança

**Validações de Segurança:**

- **Autenticação**: Fluxos de login/logout
- **Autorização**: Proteção de rotas
- **Sanitização**: Validação de inputs
- **HTTPS**: Verificação de conexões seguras

### 7. Mocks e Simulações

Localização: `src/__tests__/mocks/`

**MSW (Mock Service Worker)** configurado para simular:

- APIs de pagamento PIX (MercadoPago)
- APIs de pagamento Bitcoin
- APIs de pagamento USDT
- APIs de autenticação (Auth0, Privy)
- Cenários de erro e timeout
- Respostas de blockchain (TON Connect)

## 🚀 Como Executar os Testes

### Comandos Disponíveis

```bash
# 🎯 Execução Completa
npm run test:all              # Todos os testes (unit + integration + bdd)
npm run test:ci               # Testes para CI/CD

# 🧪 Testes por Categoria
npm run test:unit             # Testes unitários apenas
npm run test:integration      # Testes de integração
npm run test:bdd              # Testes BDD (Cucumber)
npm run test:e2e              # Testes E2E (Cypress)

# 🎯 Testes por Funcionalidade
npm run test:payments         # Sistema de pagamentos
npm run test:components       # Componentes React
npm run test:services         # Serviços e providers
npm run test:hooks            # Custom hooks

# 📊 Cobertura e Relatórios
npm run test:coverage         # Testes com cobertura
npm run test:watch            # Modo watch (desenvolvimento)
npm run reports               # Gerar todos os relatórios

# 🚀 Performance e Qualidade
npm run test:lighthouse       # Testes de performance
npm run test:accessibility    # Testes de acessibilidade
npm run test:security         # Testes de segurança

# 🔧 Utilitários
npm run test:setup            # Configurar ambiente de testes
npm run test:clean            # Limpar arquivos de teste
```

### Executar Testes Específicos

```bash
# Testar componente específico
npm test PaymentMethodSelector

# Testar provider específico
npm test pixPaymentProvider

# Testar cenário BDD específico
npm run test:bdd -- --grep "PIX"
```

## 📊 Cobertura de Testes

### Metas de Cobertura

- **Global**: 70% (branches, functions, lines, statements)
- **Componentes de Pagamento**: 80%
- **Providers de Pagamento**: 85%

### Visualizar Cobertura

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 🎯 Cenários de Teste BDD

### Principais Features

1. **Pagamento PIX**
   - Geração de QR Code
   - Confirmação instantânea
   - Timeout e expiração

2. **Pagamento Bitcoin**
   - Desconto de 5%
   - Geração de endereço
   - Confirmação de transação

3. **Pagamento USDT**
   - Desconto de 3%
   - Seleção de rede (TRC20)
   - Confirmação de transação

4. **Validação e Segurança**
   - Validação de campos obrigatórios
   - Tratamento de erros
   - Indicadores de segurança

## 🔧 Configuração de Desenvolvimento

### Pré-requisitos

```bash
# Instalar dependências
npm install

# Configurar MSW para desenvolvimento
npm run dev
```

### Estrutura de Arquivos

```
src/
├── __tests__/
│   ├── components/
│   │   └── payments/
│   ├── services/
│   │   └── providers/
│   ├── integration/
│   └── mocks/
├── components/
│   └── payments/
└── services/
    └── providers/

features/
├── payment-journey.feature
├── step_definitions/
│   └── payment-steps.ts
└── support/
    ├── world.ts
    └── hooks.ts
```

## 📝 Escrevendo Novos Testes

### Testes Unitários

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Testes BDD

```gherkin
Feature: Nova Funcionalidade
  Scenario: Cenário de teste
    Given que tenho uma condição inicial
    When eu executo uma ação
    Then devo ver o resultado esperado
```

### Mocks MSW

```typescript
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/new-endpoint", () => {
    return HttpResponse.json({ success: true });
  }),
];
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Testes falhando por timeout**
   - Verificar configuração do MSW
   - Aumentar timeout nos testes assíncronos

2. **Componentes não renderizando**
   - Verificar imports e mocks
   - Conferir setup do testing-library

3. **Cobertura baixa**
   - Adicionar testes para branches não cobertas
   - Verificar exclusões no jest.config.cjs

### Debug de Testes

```bash
# Executar teste específico com debug
npm test -- --testNamePattern="nome do teste" --verbose

# Executar com logs detalhados
DEBUG=* npm test
```

## 📈 Métricas e Relatórios

### Relatórios Gerados

- **Coverage Report**: `coverage/lcov-report/index.html`
- **BDD Report**: `reports/cucumber-report.html`
- **Test Results**: Console output com detalhes

### CI/CD Integration

Os testes são executados automaticamente em:

- Pull Requests
- Commits na branch main
- Builds de produção

```yaml
# Exemplo de configuração CI
- name: Run Tests
  run: |
    npm run test:all
    npm run reports
```

## 🔄 CI/CD e Automação

### GitHub Actions Workflow

```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run BDD tests
        run: npm run test:bdd:ci

      - name: Generate coverage report
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun

      - name: Run accessibility tests
        run: npm run test:accessibility

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Configuração de Quality Gates

```javascript
// jest.config.cjs - Thresholds de cobertura
module.exports = {
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    "./src/components/payments/": {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    "./src/services/": {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Lighthouse CI Configuration

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ["http://localhost:3000"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

## 🔄 Manutenção e Boas Práticas

### Atualizações Regulares

1. **Revisar cobertura mensalmente**
   - Identificar áreas com baixa cobertura
   - Adicionar testes para código crítico
   - Remover testes obsoletos

2. **Atualizar cenários BDD**
   - Sincronizar com novos requisitos
   - Revisar cenários existentes
   - Adicionar casos edge

3. **Manter mocks atualizados**
   - Sincronizar com APIs reais
   - Atualizar contratos de dados
   - Testar cenários de erro

4. **Refatorar testes**
   - Melhorar legibilidade
   - Reduzir duplicação
   - Otimizar performance

### Boas Práticas de Desenvolvimento

#### Escrevendo Testes

```typescript
// ✅ Bom - Teste focado e descritivo
describe('PaymentButton', () => {
  it('should disable button when payment is processing', () => {
    render(<PaymentButton isProcessing={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// ❌ Evitar - Teste genérico demais
describe('PaymentButton', () => {
  it('should work correctly', () => {
    // teste muito amplo
  });
});
```

#### Organizando Testes

```typescript
// ✅ Bom - Agrupamento lógico
describe("PaymentService", () => {
  describe("PIX payments", () => {
    it("should create PIX payment successfully");
    it("should handle PIX payment errors");
  });

  describe("Bitcoin payments", () => {
    it("should apply 5% discount for Bitcoin");
    it("should generate Bitcoin address");
  });
});
```

#### Mocks Eficientes

```typescript
// ✅ Bom - Mock específico e reutilizável
const mockPaymentProvider = {
  createPayment: jest.fn(),
  checkStatus: jest.fn(),
  cancelPayment: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});
```

### Métricas e Monitoramento

#### Dashboard de Qualidade

```typescript
// src/utils/testMetrics.ts
export const getTestMetrics = () => ({
  coverage: {
    statements: 85.2,
    branches: 78.9,
    functions: 82.1,
    lines: 84.7,
  },
  performance: {
    lighthouse: 94,
    webVitals: "good",
    bundleSize: "245kb",
  },
  accessibility: {
    score: 96,
    violations: 0,
    wcagLevel: "AA",
  },
});
```

#### Alertas Automáticos

```yaml
# .github/workflows/quality-check.yml
- name: Check quality gates
  run: |
    if [ $(npm run test:coverage --silent | grep "Statements" | awk '{print $3}' | sed 's/%//') -lt 70 ]; then
      echo "Coverage below threshold"
      exit 1
    fi
```

---

Para mais informações, consulte a documentação específica de cada ferramenta:

- [Jest](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Cucumber.js](https://cucumber.io/docs/cucumber/)
- [MSW](https://mswjs.io/docs/)
