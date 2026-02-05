import { useState, useEffect } from 'react';
import { Agent, Message } from './types';

const AGENTS_STORAGE_KEY = 'xperience_agents';
const CHATS_STORAGE_KEY = 'xperience_chats';

const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [chats, setChats] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    try {
      const storedAgents = sessionStorage.getItem(AGENTS_STORAGE_KEY);
      if (storedAgents) {
        setAgents(JSON.parse(storedAgents));
      }

      const storedChats = sessionStorage.getItem(CHATS_STORAGE_KEY);
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error('Failed to load agents data from sessionStorage', error);
    }
  }, []);

  const addAgent = (agent: Omit<Agent, 'id' | 'createdAt'>) => {
    const newAgent: Agent = {
      ...agent,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    sessionStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
    return newAgent;
  };

  const deleteAgent = (id: string) => {
    const updatedAgents = agents.filter(a => a.id !== id);
    setAgents(updatedAgents);
    sessionStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));

    // Also delete chat history
    const updatedChats = { ...chats };
    delete updatedChats[id];
    setChats(updatedChats);
    sessionStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
  };

  const addMessage = (agentId: string, message: Omit<Message, 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      timestamp: Date.now(),
    };

    const currentMessages = chats[agentId] || [];
    const updatedMessages = [...currentMessages, newMessage];

    const updatedChats = {
      ...chats,
      [agentId]: updatedMessages
    };

    setChats(updatedChats);
    sessionStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
  };

  const getMessages = (agentId: string) => {
    return chats[agentId] || [];
  };

  const clearStorage = () => {
    sessionStorage.removeItem(AGENTS_STORAGE_KEY);
    sessionStorage.removeItem(CHATS_STORAGE_KEY);
    setAgents([]);
    setChats({});
  };

  return {
    agents,
    addAgent,
    deleteAgent,
    addMessage,
    getMessages,
    clearStorage
  };
};
