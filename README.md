# 🚀 Xperience

**Xperience** é uma plataforma inovadora de mentoria empresarial e educação que aplica a **Estratégia do Oceano Azul** (Blue Ocean Strategy) para criar novos espaços de mercado. A plataforma combina o melhor da Web2 e Web3, oferecendo mentorias, planos de assinatura e integração com Inteligência Artificial, tudo acessível via web e Telegram.

---

## ✨ Funcionalidades Principais

- **🎓 Plataforma de Mentoria**: Sistema completo para venda e gestão de planos de mentoria.
- **🤖 Integração com IA**: Chatbots e Agentes inteligentes baseados em OpenAI para suporte e coaching.
- **💳 Pagamentos Híbridos**:
  - **Fiat**: PIX e Cartão de Crédito (via MercadoPago).
  - **Cripto**: Bitcoin, USDT e TON (The Open Network).
- **🔐 Autenticação Flexível**:
  - Login social e email via **Auth0**.
  - Login Web3 (WalletConnect) e social via **Privy**.
- **📱 Telegram Web App (TWA)**: Otimizado para rodar diretamente dentro do Telegram.
- **🛒 E-commerce**: Carrinho de compras, checkout transparente e gestão de leads.
- **🌐 Arquitetura Moderna**: Micro-frontends (preparado), Componentização e Clean Architecture.

---

## 🛠️ Tech Stack

- **Core**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Estilização**: [TailwindCSS](https://tailwindcss.com/), [Styled Components](https://styled-components.com/)
- **Web3 & Blockchain**:
  - [TON SDK](https://github.com/ton-community/ton-sdk) & [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/)
  - [Wagmi](https://wagmi.sh/) & [Viem](https://viem.sh/) (Ethereum/EVM)
  - [Privy](https://www.privy.io/) (Auth & Embedded Wallets)
- **Backend & Serverless**: [Vercel Serverless Functions](https://vercel.com/docs/functions)
- **IA**: [OpenAI API](https://openai.com/)
- **Testes**: [Jest](https://jestjs.io/), [Cypress](https://www.cypress.io/), [Cucumber](https://cucumber.io/) (BDD)

---

## 📚 Documentação

Para detalhes aprofundados sobre partes específicas do projeto, consulte os documentos abaixo:

- [📐 Arquitetura do Sistema](ARCHITECTURE.md)
- [🌊 Estratégia Blue Ocean](BLUE_OCEAN.md)
- [💰 Sistema de Pagamentos](PAYMENT.md)
- [🔒 Segurança](SECURITY.md)
- [🤝 Contribuindo](CONTRIBUTING.md)

---

## 🚀 Começando

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos

- **Node.js** (versão 18 ou superior recomendada)
- **Yarn** (gerenciador de pacotes)

### Instalação

Utilize o comando de instalação rápida para configurar as dependências:

```bash
yarn fast-install
```

### ⚙️ Configuração de Variáveis de Ambiente

O projeto depende de diversas chaves de API. Copie o arquivo de exemplo e configure suas chaves:

```bash
cp .env.example .env
```

#### Variáveis Necessárias

Edite o arquivo `.env` com suas credenciais. Abaixo estão as principais seções:

**1. Blockchain & Web3**
- `VITE_RPC_URL`: URL do provedor RPC da rede Ethereum (ex: Alchemy, Infura).
- `VITE_CHAIN_ID`: ID da rede blockchain (1 para Mainnet, 11155111 para Sepolia).
- `VITE_PRIVY_APP_ID`: ID da aplicação Privy (obtenha em [Privy Dashboard](https://dashboard.privy.io/)).

**2. Account Abstraction (ERC-4337)**
- `VITE_ENTRYPOINT_ADDRESS`: Endereço do contrato EntryPoint.
- `VITE_BUNDLER_URL`: URL do serviço bundler.
- `VITE_PAYMASTER_URL`: URL do serviço paymaster.

**3. Autenticação (Opcional)**
- Credenciais do Auth0 (`VITE_AUTH0_DOMAIN`, etc.) se for utilizar login social tradicional.

**4. Aplicação**
- `VITE_APP_NAME`: Nome da aplicação.
- `VITE_API_BASE_URL`: URL da API backend (dev: `http://localhost:3000/api`).

> **Nota de Segurança**: Nunca commite o arquivo `.env`. Mantenha suas chaves privadas seguras.

### Rodando o Projeto

Inicie o servidor de desenvolvimento:

```bash
yarn dev
```

O app estará disponível em `http://localhost:5173`.

---

## 🔧 Scripts Úteis

- `yarn dev`: Inicia o servidor de desenvolvimento.
- `yarn build`: Compila o projeto para produção.
- `yarn test`: Roda os testes unitários.
- `yarn test:e2e`: Roda os testes end-to-end com Cypress.

---

## 🚀 Deploy e GitHub Pages

O deploy para o GitHub Pages é automatizado via **GitHub Actions**.

- **Workflow**: `.github/workflows/deploy.yml`
- **Branch de Destino**: `gh-pages`

### Recuperação Automática
Se a branch `gh-pages` for deletada acidentalmente, **não se preocupe**. O workflow de deploy está configurado (`force_orphan: true`) para recriar a branch automaticamente na próxima execução.

### Verificação
Para garantir que o site está no ar após um deploy:
1. Vá em **Settings > Pages** no repositório.
2. Verifique se **Source** está como "Deploy from a branch".
3. Verifique se a branch selecionada é `gh-pages` e a pasta é `/ (root)`.

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados.
