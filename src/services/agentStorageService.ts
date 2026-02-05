import { Agent, Message } from '../types/agent';

const AGENTS_KEY = 'xperience_agents';
const CHATS_KEY = 'xperience_chats';

export const getAgents = (): Agent[] => {
  try {
    const data = sessionStorage.getItem(AGENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load agents from session storage', e);
    return [];
  }
};

export const saveAgent = (agent: Agent): void => {
  try {
    const agents = getAgents();
    agents.push(agent);
    sessionStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
  } catch (e) {
    console.error('Failed to save agent to session storage', e);
  }
};

export const getMessages = (agentId: string): Message[] => {
  try {
    const data = sessionStorage.getItem(CHATS_KEY);
    const chats = data ? JSON.parse(data) : {};
    return chats[agentId] || [];
  } catch (e) {
    console.error('Failed to load messages from session storage', e);
    return [];
  }
};

export const saveMessage = (agentId: string, message: Message): void => {
  try {
    const data = sessionStorage.getItem(CHATS_KEY);
    const chats = data ? JSON.parse(data) : {};

    if (!chats[agentId]) {
      chats[agentId] = [];
    }

    chats[agentId].push(message);
    sessionStorage.setItem(CHATS_KEY, JSON.stringify(chats));
  } catch (e) {
    console.error('Failed to save message to session storage', e);
  }
};

export const clearSession = (): void => {
  sessionStorage.removeItem(AGENTS_KEY);
  sessionStorage.removeItem(CHATS_KEY);
};
