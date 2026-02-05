export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  agentId: string;
  messages: Message[];
}
