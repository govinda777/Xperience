import { useState, useEffect } from 'react';
import { Agent, Message } from './types';

const AGENTS_STORAGE_KEY = 'xperience_agents_v1';
const CHATS_STORAGE_KEY = 'xperience_chats_v1';

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
      const storedAgents = localStorage.getItem(AGENTS_STORAGE_KEY);
      if (storedAgents) {
        setAgents(JSON.parse(storedAgents));
      }

      const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error('Failed to load agents data from localStorage', error);
    }
  }, []);

  const addAgent = (agent: Omit<Agent, 'id' | 'createdAt'>) => {
    const newAgent: Agent = {
      ...agent,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    setAgents(prevAgents => {
      const updatedAgents = [...prevAgents, newAgent];
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
      return updatedAgents;
    });

    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents(prevAgents => {
      const updatedAgents = prevAgents.map(a => a.id === id ? { ...a, ...updates } : a);
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
      return updatedAgents;
    });
  };

  const deleteAgent = (id: string) => {
    setAgents(prevAgents => {
      const updatedAgents = prevAgents.filter(a => a.id !== id);
      localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(updatedAgents));
      return updatedAgents;
    });

    // Also delete chat history
    setChats(prevChats => {
      const updatedChats = { ...prevChats };
      delete updatedChats[id];
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  const addMessage = (agentId: string, message: Omit<Message, 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      timestamp: Date.now(),
    };

    setChats(prevChats => {
      const currentMessages = prevChats[agentId] || [];
      const updatedMessages = [...currentMessages, newMessage];
      const updatedChats = {
        ...prevChats,
        [agentId]: updatedMessages
      };
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  const getMessages = (agentId: string) => {
    return chats[agentId] || [];
  };

  const clearStorage = () => {
    localStorage.removeItem(AGENTS_STORAGE_KEY);
    localStorage.removeItem(CHATS_STORAGE_KEY);
    setAgents([]);
    setChats({});
  };

  return {
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    addMessage,
    getMessages,
    clearStorage
  };
};
