# Infraestrutura e Serviços

Este documento mapeia a infraestrutura atual da aplicação e fornece detalhes sobre os serviços externos utilizados, com foco especial na configuração e manutenção do sistema de Health Check.

## 🏗️ Visão Geral da Arquitetura

A aplicação segue uma arquitetura **Serverless** moderna, hospedada na **Vercel**, combinando um frontend Single Page Application (SPA) com funções backend para lógica de negócios.

### Componentes Principais

1.  **Frontend (SPA)**:
    *   **Framework**: React 18 + Vite.
    *   **Estilização**: Tailwind CSS + Styled Components.
    *   **Estado**: React Context + Hooks (`useAgents`, `useLeads`).
    *   **Roteamento**: React Router DOM (SPA).
    *   **Build**: O comando `yarn build` gera arquivos estáticos na pasta `dist/`.

2.  **Backend (Serverless Functions)**:
    *   **Runtime**: Node.js (Vercel Functions).
    *   **Localização**: Diretório `api/`.
    *   **Execução**: As funções em `api/` são mapeadas automaticamente para endpoints (ex: `api/health.ts` -> `/api/health`).
    *   **Lógica de Agente**: Implementada com LangChain e LangGraph, rodando dentro das funções serverless.

3.  **Banco de Dados & Armazenamento**:
    *   **Vercel KV (Redis)**: Utilizado para:
        *   Armazenar configurações do Health Check (`health:config`).
        *   Gerenciar sessões e estados temporários.
        *   Filas de mensagens (`inbound_messages`).
    *   **Vercel Postgres**: (Planejado/Em uso parcial) Para logs de auditoria e dados estruturados de longo prazo.

---

## 🌐 Serviços Externos e Dependências

A aplicação integra-se com diversos serviços de terceiros para funcionalidades específicas:

| Serviço | Função Principal | Dependência Chave |
| :--- | :--- | :--- |
| **Vercel** | Hospedagem, Serverless Functions, KV, Postgres | `@vercel/node`, `@vercel/kv`, `@vercel/postgres` |
| **OpenAI** | Inteligência Artificial (LLM) para o Agente | `openai`, `@langchain/openai` |
| **Privy** | Autenticação e Gestão de Carteiras Web3 | `@privy-io/react-auth`, `@privy-io/node` |
| **MercadoPago** | Processamento de Pagamentos | `mercadopago` |
| **Auth0** | Autenticação (Integração legada/específica) | `@auth0/auth0-react` |
| **TON Blockchain** | Interação com a rede TON (The Open Network) | `ton`, `@orbs-network/ton-access` |
| **Google APIs** | Integrações diversas (ex: Agenda, Gmail - via Agente) | `googleapis` |

---

## 🏥 Sistema de Health Check

O sistema de Health Check monitora a saúde dos serviços críticos e externos em tempo real. Ele é composto por uma API de verificação, uma API de configuração e um Dashboard UI.

### 1. Endpoints da API

*   **`GET /api/health`** (Público)
    *   **Função**: Executa verificações em paralelo para todos os serviços configurados.
    *   **Retorno**: JSON com status global (`healthy`, `degraded`, `unhealthy`), latência e detalhes por serviço.
    *   **Uso**: Monitoramento automatizado (uptime robots) e pelo Dashboard UI.

*   **`GET /api/health-config`** (Público)
    *   **Função**: Retorna a configuração atual dos serviços (quais estão ativados, limites de latência, etc.).

*   **`POST /api/health-config`** (Protegido)
    *   **Função**: Atualiza a configuração de um serviço (ativar/desativar, alterar thresholds).
    *   **Segurança**: Requer autenticação via Header `Authorization: Bearer <TOKEN>`.

### 2. Dashboard UI (`/health`)

O painel visual está acessível na rota `/health`.

*   **Acesso**: A página é pública para visualização (read-only) para usuários autenticados na aplicação.
*   **Funcionalidades**:
    *   Visualização de status em tempo real.
    *   Identificação de serviços críticos vs. não críticos.
    *   Exibição de latência e mensagens de erro.

### 3. Configuração e Segurança

Para alterar as configurações do Health Check (ex: desativar temporariamente um serviço que está instável para evitar alertas falsos), é necessário utilizar o **Painel de Configuração** dentro do Dashboard.

#### 🔐 Configurando o Acesso (Admin Token)

O acesso à escrita nas configurações é protegido por um token definido nas variáveis de ambiente.

1.  **Defina a Variável de Ambiente**:
    No painel da Vercel (ou no arquivo `.env` local), adicione a seguinte variável:
    ```env
    HEALTH_CHECK_TOKEN=seu_token_super_secreto_aqui
    ```
    *Recomendação: Use um gerador de senhas para criar uma string longa e aleatória.*

2.  **Acessando o Painel de Configuração**:
    1.  Navegue até a rota `/health`.
    2.  Clique no botão **"Configurar"** no canto superior direito.
    3.  Um painel se abrirá solicitando o **"Token de Admin"**.
    4.  Insira o valor definido em `HEALTH_CHECK_TOKEN`.

3.  **Gerenciando Serviços**:
    *   Com o token inserido corretamente, você verá a lista de serviços com botões "Ativar/Desativar".
    *   Ao clicar em uma ação, o frontend enviará uma requisição autenticada para `/api/health-config`.
    *   As alterações são persistidas no **Vercel KV** e têm efeito imediato.

#### Solução de Problemas Comuns

*   **Erro "Unauthorized" ao tentar configurar**: Verifique se o token inserido no campo de input corresponde exatamente ao valor da variável `HEALTH_CHECK_TOKEN` no ambiente de execução (Vercel ou local).
*   **Status "Configuration missing"**: Isso indica que o serviço não tem uma configuração salva no Redis (Vercel KV). O sistema usa um fallback padrão, mas é ideal salvar uma configuração inicial via API ou UI.
