export type AgentCommandKey = 'new_report' | 'new_project' | 'custom';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  commandKey?: AgentCommandKey;
  commandKeys?: AgentCommandKey[];
  systemPrompt?: string;
  context?: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  timeMs?: number;
  ragContext?: {
    title: string;
    score: number;
    source: string;
  }[];
}

export interface ChatSession {
  agentId: string;
  messages: Message[];
}
