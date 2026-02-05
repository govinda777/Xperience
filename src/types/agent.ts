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
}

export interface ChatSession {
  agentId: string;
  messages: Message[];
  lastUpdated: string;
}
