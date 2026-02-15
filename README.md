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
- [🏗️ Infraestrutura & Health Check](docs/INFRASTRUCTURE.md)
- [🧠 RAG Local (Docs & Chat)](docs/RAG_LOCAL.md)
- [🤝 Contribuindo](CONTRIBUTING.md)

---

## 🏥 Health Check

A aplicação possui um sistema completo de monitoramento de saúde dos serviços.
- **Dashboard**: Acesse `/health` para visualizar o status em tempo real.
- **Configuração**: Consulte a [documentação de infraestrutura](docs/INFRASTRUCTURE.md) para aprender a configurar o token de administração e gerenciar os serviços.

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

## 🚀 Deployment

O projeto está otimizado para deploy na [Vercel](https://vercel.com).

### Reutilizando Builds (Deploy Prebuilt)

Para realizar o deploy sem rebuildar nos servidores da Vercel (reaproveitando builds locais ou de CI), utilize a Vercel CLI:

1.  **Build do Projeto**:
    ```bash
    vercel build --prod
    ```
    Este comando gera o diretório `.vercel/output`, contendo tanto o frontend estático (via `yarn build`) quanto as serverless functions (de `api/`).

2.  **Deploy do Artefato**:
    ```bash
    vercel deploy --prebuilt --prod
    ```
    Este comando envia a pasta `.vercel/output` diretamente para a Vercel.

> **Nota**: O comando padrão `yarn build` gera apenas os arquivos estáticos do frontend em `dist/`. Para um deploy completo incluindo as rotas de API, você deve utilizar `vercel build` ou deixar a Vercel gerenciar o processo de build.

### 🤖 Configuração de CI/CD (GitHub Actions)

O projeto possui um workflow configurado para deploy automático na Vercel (`.github/workflows/build-deploy.yml`). Para que ele funcione, você precisa adicionar os seguintes segredos no repositório GitHub:

1.  **Obtenha as Credenciais do Projeto**:
    Certifique-se de que o projeto está linkado localmente (`vercel link`) e rode o script auxiliar:

    ```bash
    node scripts/get-vercel-config.js
    ```

    Este comando exibirá o `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID`.

2.  **Gere um Token da Vercel**:
    - Acesse [Vercel Tokens](https://vercel.com/account/tokens) e crie um token.

3.  **Adicione os Segredos no GitHub**:
    - Vá em `Settings` > `Secrets and variables` > `Actions` no repositório.
    - Adicione:
        - `VERCEL_ORG_ID`
        - `VERCEL_PROJECT_ID`
        - `VERCEL_TOKEN`

---

## 📄 Licença

Este projeto é privado. Todos os direitos reservados.
