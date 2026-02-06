
# Architecture

## Overview
Xperience is a Mentorship and Education Platform. The architecture is primarily a Single Page Application (SPA) built with React/Vite, served by Vercel. It utilizes Vercel Serverless Functions for backend logic to keep the architecture simple and scalable.

## Layers

### 1. Presentation Layer (Frontend)
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS + Styled Components
- **State Management**: React Context + Hooks (e.g., `useAgents`, `useLeads`)
- **Routing**: React Router DOM
- **Key Components**:
  - `src/pages/Agents`: Super Agent Interface (Chat + State Inspector)
  - `src/components`: Reusable UI components

### 2. Backend Layer (Serverless)
- **Runtime**: Node.js (Vercel Functions)
- **Location**: `api/` directory
- **Key Functions**:
  - `api/agent.ts`: Entry point for the AI Super Agent.
  - `api/chat.ts`: Legacy chat proxy (OpenAI).
  - `api/leads.ts`: Lead capture and processing.
  - `api/webhooks/{provider}/route.ts`: Inbound message handlers (WhatsApp, Telegram, etc.)

### 3. Agent Layer (AI & Logic)
- **Framework**: LangChain + LangGraph (TypeScript)
- **Location**: `api/agent/` and `lib/agent.ts`
- **Architecture**: State Machine (Graph) with 7 phases:
  1. **Hydration**: Load session and user context.
  2. **Perception**: Detect intent and entities.
  3. **Retrieval**: Fetch knowledge (Vector DB).
  4. **Reasoning**: LLM decision making.
  5. **Tool Execution**: Execute actions (Email, Calendar, WhatsApp, etc.).
  6. **Response**: Format output.
  7. **State Update**: Persist history and logs.
- **Tools**:
  - All tools are audited via `lib/tools/baseTool.ts` wrapper.
  - Tools include: `send_email`, `schedule_meeting`, `send_whatsapp_message`, etc.
- **State Inspector**: Exposes internal state (audit logs, intent) to the UI.

### 4. Data Layer
- **Database**: Vercel Postgres (Planned for Vector/Audit logs), Vercel KV (Redis) for sessions.
- **Tables**:
  - `agent_tool_audit`: Logs every tool execution with input/output/duration.
  - `inbound_messages`: Logs raw incoming webhook payloads.
- **Storage**: LocalStorage/SessionStorage for client-side persistence.

## Key Flows

### Super Agent Interaction
1. User sends message via `AgentChat` UI.
2. `POST /api/agent` is called with `message` and `sessionId`.
3. Vercel Function invokes `agentGraph`.
4. Graph executes through nodes (Perception -> Reasoning -> Tools...).
5. Function returns `message` (response) and `state` (full internal state).
6. UI updates Chat and **State Inspector** simultaneously.

### Inbound Webhook Flow
1. External Provider (e.g., WhatsApp) calls `POST /api/webhooks/whatsapp`.
2. Handler normalizes payload to `InboundMessage` format.
3. Message is logged to `inbound_messages` table.
4. `agentGraph` is invoked with the message text and resolved session ID.
5. Agent processes message and may use tools to reply.

## Deployment
- **Platform**: Vercel
- **CI/CD**: GitHub Actions
- **Environment Variables**: Managed in Vercel Project Settings (synced via `sync-vercel-env.yml`).
