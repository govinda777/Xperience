export interface Agent {
  id: string;
  name: string;
  avatar: string;
  systemPrompt: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  // Extended properties for UI
  tools?: string[];
  timeMs?: number;
}

export interface ChatSession {
  agentId: string;
  messages: Message[];
  lastUpdated: string;
}

export type AgentChannel = "web" | "whatsapp" | "telegram" | "email" | "x";

export interface AgentNodeState {
  name:
    | "hydration"
    | "perception"
    | "retrieval"
    | "reasoning"
    | "tool_execution"
    | "response"
    | "state_update";
  label: string; // "HYDRATION", etc.
  status: "pending" | "running" | "done" | "error";
  durationMs?: number;
  errorMessage?: string;
}

export interface AgentToolRun {
  id: string;
  name: string; // "send_email", "schedule_meeting", etc.
  status: "ok" | "error";
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  inputSummary: string;
  outputSummary?: string;
}

export interface AgentLogEvent {
  id: string;
  timestamp: string;
  type: "tool" | "llm" | "system" | "error";
  message: string;
}

export interface AgentVariables {
  intent?: string;
  slots: Record<string, any>;
  ragContext: { title: string; score: number; source?: string }[];
  rawState: unknown;
}

export interface AgentInspectorState {
  sessionId: string;
  userDisplayName?: string;
  channel: AgentChannel;
  currentNode: AgentNodeState["name"];
  securityLevel: number;
  messageCount: number;
  toolCount: number;
  nodes: AgentNodeState[];
  variables: AgentVariables;
  toolRuns: AgentToolRun[];
  logs: AgentLogEvent[];
}
