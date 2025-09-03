# Guia de Contribuição - Xperience Platform

Obrigado pelo seu interesse em contribuir com a Xperience! Este guia fornece todas as informações necessárias para contribuir de forma efetiva com o projeto.

## 📋 Índice

- [Como Contribuir](#-como-contribuir)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Padrões de Código](#-padrões-de-código)
- [Processo de Desenvolvimento](#-processo-de-desenvolvimento)
- [Testes](#-testes)
- [Documentação](#-documentação)
- [Pull Requests](#-pull-requests)
- [Issues](#-issues)
- [Comunidade](#-comunidade)

## 🤝 Como Contribuir

Existem várias maneiras de contribuir com o projeto:

### 🐛 Reportar Bugs

- Verifique se o bug já foi reportado nas [Issues](https://github.com/gosouza/Xperience/issues)
- Use o template de bug report
- Inclua informações detalhadas sobre o ambiente
- Adicione steps para reproduzir o problema

### 💡 Sugerir Melhorias

- Abra uma issue com a tag `enhancement`
- Descreva claramente a funcionalidade desejada
- Explique o problema que seria resolvido
- Considere implementações alternativas

### 🔧 Contribuir com Código

- Corrija bugs existentes
- Implemente novas funcionalidades
- Melhore a performance
- Adicione testes
- Melhore a documentação

### 📚 Melhorar Documentação

- Corrija erros de digitação
- Adicione exemplos práticos
- Traduza conteúdo
- Crie tutoriais

## 🛠 Configuração do Ambiente

### Pré-requisitos

- **Node.js** 18+
- **npm** ou **yarn**
- **Git**
- **Editor** com suporte a TypeScript (recomendado: VS Code)

### Setup Inicial

1. **Fork do Repositório**

   ```bash
   # Clique em "Fork" no GitHub
   # Clone seu fork
   git clone https://github.com/SEU_USERNAME/Xperience.git
   cd Xperience
   ```

2. **Configurar Remote Upstream**

   ```bash
   git remote add upstream https://github.com/gosouza/Xperience.git
   git remote -v
   ```

3. **Instalar Dependências**

   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Configurar Ambiente**

   ```bash
   # Copie o arquivo de exemplo (quando disponível)
   cp .env.example .env

   # Configure as variáveis necessárias
   # Para desenvolvimento, muitas podem ficar vazias
   ```

5. **Verificar Setup**
   ```bash
   npm run dev
   npm run test
   npm run lint
   ```

### Extensões Recomendadas (VS Code)

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-jest",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 📏 Padrões de Código

### TypeScript

- **Tipagem Estrita**: Sempre use tipos explícitos
- **Interfaces**: Prefira interfaces a types para objetos
- **Naming**: Use PascalCase para tipos, camelCase para variáveis

```typescript
// ✅ Bom
interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
}

const processPayment = async (
  request: PaymentRequest,
): Promise<PaymentResult> => {
  // implementação
};

// ❌ Evitar
const processPayment = async (request: any) => {
  // implementação
};
```

### React Components

- **Functional Components**: Sempre use function components
- **Props Interface**: Defina interface para props
- **Default Props**: Use destructuring com valores padrão

```typescript
// ✅ Bom
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Styling

- **Tailwind CSS**: Use classes utilitárias
- **Responsive**: Mobile-first approach
- **Consistência**: Siga o design system

```typescript
// ✅ Bom
<div className="flex flex-col md:flex-row gap-4 p-6 bg-white rounded-lg shadow-md">
  <div className="flex-1">
    <h2 className="text-xl font-semibold text-gray-900 mb-2">Título</h2>
    <p className="text-gray-600">Descrição</p>
  </div>
</div>
```

### Naming Conventions

- **Arquivos**: kebab-case para arquivos, PascalCase para components
- **Variáveis**: camelCase
- **Constantes**: UPPER_SNAKE_CASE
- **Funções**: camelCase, verbos descritivos

```typescript
// ✅ Bom
const API_BASE_URL = "https://api.example.com";
const userName = "john_doe";
const fetchUserData = async (userId: string) => {};

// Arquivos
payment - service.ts;
PaymentButton.tsx;
use - cart.ts;
```

## 🔄 Processo de Desenvolvimento

### Workflow Git

1. **Sincronizar com Upstream**

   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Criar Branch Feature**

   ```bash
   git checkout -b feature/payment-integration
   # ou
   git checkout -b fix/cart-total-calculation
   # ou
   git checkout -b docs/api-documentation
   ```

3. **Desenvolver e Commitar**

   ```bash
   # Fazer mudanças
   git add .
   git commit -m "feat: add PIX payment integration"
   ```

4. **Push e Pull Request**
   ```bash
   git push origin feature/payment-integration
   # Abrir PR no GitHub
   ```

### Conventional Commits

Use o padrão de [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos principais
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, sem mudança de lógica
refactor: refatoração de código
test: adição ou correção de testes
chore: tarefas de manutenção

# Exemplos
feat(payments): add Bitcoin payment support
fix(cart): resolve total calculation error
docs(api): update payment service documentation
test(components): add PaymentButton tests
```

### Branch Naming

```bash
# Features
feature/payment-integration
feature/user-dashboard
feature/mobile-optimization

# Bug fixes
fix/cart-total-calculation
fix/auth-redirect-loop
fix/mobile-layout-issues

# Documentation
docs/api-reference
docs/contributing-guide
docs/deployment-instructions

# Refactoring
refactor/payment-service
refactor/component-structure
```

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm run test:all

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes BDD
npm run test:bdd

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

### Escrever Testes

#### Testes de Componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentButton } from '../PaymentButton';

describe('PaymentButton', () => {
  it('should render with correct text', () => {
    render(<PaymentButton>Pagar Agora</PaymentButton>);
    expect(screen.getByText('Pagar Agora')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<PaymentButton onClick={handleClick}>Pagar</PaymentButton>);

    fireEvent.click(screen.getByText('Pagar'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testes de Serviços

```typescript
import { PaymentService } from "../paymentService";
import { PixPaymentProvider } from "../providers/pixPaymentProvider";

jest.mock("../providers/pixPaymentProvider");

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let mockPixProvider: jest.Mocked<PixPaymentProvider>;

  beforeEach(() => {
    mockPixProvider =
      new PixPaymentProvider() as jest.Mocked<PixPaymentProvider>;
    paymentService = new PaymentService(mockPixProvider);
  });

  it("should process PIX payment successfully", async () => {
    mockPixProvider.createPayment.mockResolvedValue({
      id: "payment-123",
      qrCode: "qr-code-data",
    });

    const result = await paymentService.processPayment({
      method: "pix",
      amount: 100,
      currency: "BRL",
    });

    expect(result.success).toBe(true);
    expect(result.qrCode).toBe("qr-code-data");
  });
});
```

#### Testes BDD

```gherkin
Feature: Payment Processing
  Scenario: Successful PIX payment
    Given I am on the checkout page
    And I have items in my cart
    When I select PIX as payment method
    And I fill in my payment details
    And I click "Confirmar Pagamento"
    Then I should see a QR code
    And I should see payment instructions
```

### Cobertura de Testes

- **Mínimo**: 70% de cobertura geral
- **Componentes críticos**: 85%+ (pagamentos, autenticação)
- **Serviços**: 80%+
- **Utilitários**: 90%+

## 📚 Documentação

### Documentar Código

````typescript
/**
 * Processa um pagamento usando o provider apropriado
 * @param request - Dados do pagamento
 * @returns Promise com resultado do pagamento
 * @throws PaymentError quando dados são inválidos
 *
 * @example
 * ```typescript
 * const result = await paymentService.processPayment({
 *   method: 'pix',
 *   amount: 100,
 *   currency: 'BRL'
 * });
 * ```
 */
async processPayment(request: PaymentRequest): Promise<PaymentResult> {
  // implementação
}
````

### README de Componentes

Para componentes complexos, adicione README:

````markdown
# PaymentGateway Component

## Uso

```tsx
<PaymentGateway
  amount={299.9}
  currency="BRL"
  onSuccess={handleSuccess}
  onError={handleError}
/>
```
````

## Props

| Prop      | Tipo     | Obrigatório | Descrição              |
| --------- | -------- | ----------- | ---------------------- |
| amount    | number   | Sim         | Valor do pagamento     |
| currency  | string   | Sim         | Moeda (BRL, USD, etc.) |
| onSuccess | function | Não         | Callback de sucesso    |
| onError   | function | Não         | Callback de erro       |

````

## 🔀 Pull Requests

### Antes de Abrir um PR

- [ ] Código está funcionando localmente
- [ ] Testes estão passando
- [ ] Lint está passando
- [ ] Documentação foi atualizada
- [ ] Branch está atualizada com main

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças realizadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar
1. Passo 1
2. Passo 2
3. Resultado esperado

## Checklist
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Lint passando
- [ ] Build passando

## Screenshots (se aplicável)
````

### Review Process

1. **Automated Checks**: CI/CD deve passar
2. **Code Review**: Pelo menos 1 aprovação
3. **Testing**: Reviewer deve testar localmente
4. **Merge**: Squash and merge preferido

## 🐛 Issues

### Template de Bug Report

```markdown
## Descrição do Bug

Descrição clara e concisa do bug.

## Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado

O que deveria acontecer.

## Comportamento Atual

O que está acontecendo.

## Screenshots

Se aplicável, adicione screenshots.

## Ambiente

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 91]
- Versão: [ex: 1.2.3]

## Informações Adicionais

Qualquer outra informação relevante.
```

### Template de Feature Request

```markdown
## Descrição da Funcionalidade

Descrição clara da funcionalidade desejada.

## Problema Resolvido

Que problema esta funcionalidade resolveria?

## Solução Proposta

Como você imagina que isso deveria funcionar?

## Alternativas Consideradas

Outras soluções que você considerou?

## Informações Adicionais

Qualquer outra informação relevante.
```

## 🏷️ Labels

Usamos as seguintes labels para organizar issues e PRs:

### Tipo

- `bug` - Correção de bug
- `enhancement` - Nova funcionalidade
- `documentation` - Documentação
- `question` - Pergunta
- `help wanted` - Ajuda necessária

### Prioridade

- `priority: high` - Alta prioridade
- `priority: medium` - Média prioridade
- `priority: low` - Baixa prioridade

### Status

- `status: in progress` - Em desenvolvimento
- `status: needs review` - Precisa de review
- `status: blocked` - Bloqueado

### Área

- `area: payments` - Sistema de pagamentos
- `area: auth` - Autenticação
- `area: ui` - Interface do usuário
- `area: tests` - Testes

## 🌟 Reconhecimento

Contribuidores são reconhecidos de várias formas:

### Contributors List

- Adicionados automaticamente ao README
- Baseado em commits e PRs

### Special Thanks

- Contribuições significativas destacadas
- Menções em releases

### Badges

- Contributor badge no perfil
- Special badges para contribuições específicas

## 📞 Suporte

### Canais de Comunicação

- **Issues**: Para bugs e feature requests
- **Discussions**: Para perguntas gerais
- **Email**: contato@xperience.com.br
- **WhatsApp**: [Grupo de Desenvolvedores](https://chat.whatsapp.com/xperience-dev)

### Horários de Resposta

- **Issues críticas**: 24 horas
- **Issues normais**: 3-5 dias úteis
- **Feature requests**: 1-2 semanas
- **Perguntas**: 1-3 dias úteis

## 🎉 Primeiros Passos

### Issues para Iniciantes

Procure por issues com as labels:

- `good first issue` - Bom para iniciantes
- `help wanted` - Ajuda necessária
- `documentation` - Melhorias na documentação

### Mentoria

- Desenvolvedores experientes disponíveis para mentoria
- Pair programming sessions disponíveis
- Code review detalhado para iniciantes

---

## 📜 Código de Conduta

Este projeto adere ao [Código de Conduta](CODE_OF_CONDUCT.md). Ao participar, você concorda em manter um ambiente respeitoso e inclusivo.

---

Obrigado por contribuir com a Xperience! Juntos estamos construindo uma plataforma incrível para transformar ideias em negócios de sucesso. 🚀
