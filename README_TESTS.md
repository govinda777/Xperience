# Guia de Testes - Xperience

Este documento descreve a estrutura de testes implementada na aplicação Xperience, incluindo testes de unidade e testes BDD (Behavior Driven Development).

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Testes](#estrutura-de-testes)
- [Testes de Unidade](#testes-de-unidade)
- [Testes BDD](#testes-bdd)
- [Comandos de Teste](#comandos-de-teste)
- [Configuração](#configuração)
- [Relatórios](#relatórios)

## 🎯 Visão Geral

A aplicação Xperience possui uma suíte completa de testes que inclui:

- **Testes de Unidade**: Testam componentes, services e hooks isoladamente
- **Testes BDD**: Testam cenários de negócio em linguagem natural (português)
- **Testes de Integração**: Testam a integração entre diferentes partes do sistema
- **Testes E2E**: Testam fluxos completos da aplicação (Cypress)

## 🏗️ Estrutura de Testes

```
├── src/
│   ├── components/
│   │   └── __tests__/           # Testes de componentes
│   ├── services/
│   │   └── __tests__/           # Testes de services
│   ├── hooks/
│   │   └── __tests__/           # Testes de hooks
│   └── setupTests.ts            # Configuração global dos testes
├── features/                    # Testes BDD
│   ├── *.feature              # Arquivos de cenários
│   ├── step_definitions/       # Implementação dos steps
│   └── support/               # Configuração e hooks do Cucumber
├── reports/                    # Relatórios de teste
├── test-data/                 # Dados de teste
└── scripts/
    └── test-setup.js          # Script de configuração
```

## 🧪 Testes de Unidade

### Componentes Testados

#### PaymentMethodSelector
- ✅ Renderização de métodos de pagamento
- ✅ Exibição de preços corretos
- ✅ Seleção de métodos
- ✅ Estados desabilitados
- ✅ Badges de desconto

#### PaymentStatusModal
- ✅ Estados de pagamento (pending, completed, failed, expired)
- ✅ Exibição de QR codes
- ✅ Informações específicas por método
- ✅ Ações de usuário (retry, cancel)

### Services Testados

#### PaymentService
- ✅ Gerenciamento de provedores
- ✅ Processamento de pagamentos
- ✅ Verificação de status
- ✅ Conversão de moedas
- ✅ Histórico de pagamentos

#### PixPaymentProvider
- ✅ Configuração do MercadoPago
- ✅ Criação de pagamentos PIX
- ✅ Verificação de status
- ✅ Cancelamento de pagamentos
- ✅ Tratamento de erros

### Hooks Testados

#### useUserWallet
- ✅ Inicialização de carteira
- ✅ Envio de transações
- ✅ Atualização de saldo
- ✅ Estados de loading
- ✅ Tratamento de erros

## 🥒 Testes BDD

### Funcionalidades Cobertas

#### Autenticação de Usuário (`user_authentication.feature`)
- Login bem-sucedido com Auth0
- Tentativas de login inválidas
- Logout do sistema
- Proteção de rotas
- Persistência de sessão
- Expiração de sessão

#### Fluxo de Pagamento (`payment_flow.feature`)
- Seleção de métodos de pagamento (PIX, Bitcoin, USDT, GitHub)
- Processamento de pagamentos
- Cancelamento e expiração
- Falhas no processamento
- Verificação de status

#### Gerenciamento de Carteira (`wallet_management.feature`)
- Visualização de informações da carteira
- Inicialização automática
- Envio de transações
- Histórico de transações
- Estados de erro
- Integração com Auth0

#### Experiência do Usuário (`user_experience.feature`)
- Navegação e responsividade
- Formulários e validações
- SEO e performance
- Acessibilidade
- Estados de erro
- Analytics

## 🚀 Comandos de Teste

### Configuração Inicial
```bash
npm run test:setup    # Configura ambiente de teste
```

### Testes de Unidade
```bash
npm run test                    # Executa todos os testes Jest
npm run test:unit              # Executa apenas testes de unidade
npm run test:components        # Testa apenas componentes
npm run test:services          # Testa apenas services
npm run test:hooks             # Testa apenas hooks
npm run test:watch             # Executa testes em modo watch
npm run test:coverage          # Executa testes com cobertura
```

### Testes BDD
```bash
npm run test:bdd               # Executa testes BDD
npm run test:bdd:ci            # Executa testes BDD para CI
npm run test:bdd:debug         # Executa testes BDD em modo debug
npm run test:bdd:html          # Gera relatório HTML dos testes BDD
```

### Testes Completos
```bash
npm run test:all               # Executa todos os tipos de teste
npm run test:ci                # Executa testes para CI/CD
npm run reports                # Gera todos os relatórios
npm run test:clean             # Limpa arquivos de teste
```

## ⚙️ Configuração

### Jest (jest.config.cjs)
- Ambiente: jsdom
- Cobertura: 70% global, 80% para pagamentos, 85% para providers
- Transformações: TypeScript com ts-jest
- Mocks: CSS e assets

### Cucumber (cucumber.js)
- Perfis: default, ci, debug
- Formatos: progress-bar, JSON, HTML
- Paralelização: 2-4 workers
- Retry: 1-2 tentativas para testes instáveis

### Hooks e World
- Estado global compartilhado entre steps
- Mocks automáticos para APIs externas
- Limpeza automática entre cenários
- Configuração por tags (@auth, @payment, @wallet)

## 📊 Relatórios

### Cobertura de Código
- Localização: `coverage/lcov-report/index.html`
- Métricas: Linhas, funções, branches, statements
- Threshold: Configurado por diretório

### Relatórios BDD
- JSON: `reports/cucumber_report.json`
- HTML: `reports/cucumber_report.html`
- Console: Formatação colorida com progresso

### Dados de Teste
- Usuários: `test-data/test-users.json`
- Planos: `test-data/test-plans.json`
- Transações: `test-data/test-transactions.json`
- Configuração: `test-data/mock-config.json`

## 🏷️ Tags BDD

- `@auth` - Testes de autenticação
- `@payment` - Testes de pagamento
- `@wallet` - Testes de carteira
- `@mobile` - Testes mobile
- `@slow` - Testes lentos (timeout estendido)
- `@error` - Cenários de erro
- `@performance` - Testes de performance
- `@a11y` - Testes de acessibilidade
- `@skip` - Pular teste
- `@flaky` - Teste instável (retry automático)
- `@manual` - Teste manual (não executar no CI)
- `@debug` - Teste para debug

## 🎯 Metas de Cobertura

| Área | Meta | Atual |
|------|------|-------|
| Global | 70% | ✅ |
| Componentes de Pagamento | 80% | ✅ |
| Providers de Pagamento | 85% | ✅ |
| Services | 75% | ✅ |
| Hooks | 70% | ✅ |

## 🚨 Troubleshooting

### Problemas Comuns

1. **Testes falhando por timeout**
   ```bash
   npm run test:bdd:debug  # Para investigar
   ```

2. **Mocks não funcionando**
   ```bash
   npm run test:clean && npm run test:setup
   ```

3. **Cobertura baixa**
   ```bash
   npm run test:coverage  # Verificar relatório detalhado
   ```

4. **Testes BDD não encontrando steps**
   - Verificar se os arquivos estão em `features/step_definitions/`
   - Verificar imports nos step definitions

### Logs e Debug

- Use `console.log` nos step definitions para debug
- Execute `npm run test:bdd:debug` para testes específicos
- Verifique os relatórios em `reports/` para detalhes

## 📝 Contribuindo

1. **Novos Testes de Unidade**
   - Criar arquivo `*.test.ts` ou `*.test.tsx`
   - Seguir padrão AAA (Arrange, Act, Assert)
   - Mockar dependências externas

2. **Novos Cenários BDD**
   - Escrever em português claro
   - Usar formato Gherkin
   - Implementar steps correspondentes

3. **Melhores Práticas**
   - Testes independentes e isolados
   - Nomes descritivos
   - Cobertura de casos edge
   - Documentação clara

---

Para mais informações, consulte a documentação específica de cada ferramenta:
- [Jest](https://jestjs.io/)
- [Cucumber.js](https://cucumber.io/docs/cucumber/)
- [Testing Library](https://testing-library.com/)
- [Cypress](https://docs.cypress.io/)
