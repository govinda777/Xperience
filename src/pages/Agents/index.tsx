import React, { useState } from "react";
import { useAgents } from "./useAgents";
import AgentList from "./AgentList";
import CreateAgentModal from "./CreateAgentModal";
import ChatInterface from "./ChatInterface";
import { Agent } from "./types";
import { Button } from "../../components/styled/styled";
import { Plus } from "lucide-react";

const Agents = () => {
  const { agents, addAgent, deleteAgent, addMessage, getMessages } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAgent = (agentData: Omit<Agent, 'id' | 'createdAt'>) => {
    addAgent(agentData);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedAgent) return;

    // Get current history for API context (before adding the new message to state)
    // Note: This gets what's currently in state. The new message is added below.
    const currentHistory = getMessages(selectedAgent.id);

    // Prepare messages for OpenAI
    // Map internal message type to OpenAI message format if needed, but they seem compatible
    const messagesForApi = [
      {
        role: 'system',
        content: `Você é ${selectedAgent.name}, que atua como ${selectedAgent.role}. ${selectedAgent.description}. Responda sempre em português.`
      },
      ...currentHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content }
    ];

    // Optimistically add user message to UI
    addMessage(selectedAgent.id, { role: 'user', content });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesForApi }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();

      if (data.message) {
        addMessage(selectedAgent.id, {
          role: 'assistant',
          content: data.message.content
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Optional: Add a system message indicating error
      addMessage(selectedAgent.id, {
        role: 'system',
        content: 'Erro ao conectar com o servidor. Tente novamente mais tarde.'
      });
    }
  };

  if (selectedAgent) {
    return (
      <div className="container mx-auto px-4 py-8 h-full">
        <ChatInterface
          agent={selectedAgent}
          messages={getMessages(selectedAgent.id)}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedAgent(null)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meus Agentes de IA</h1>
          <p className="text-gray-500 mt-1">Crie e gerencie sua equipe de inteligência artificial</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-2">
            <Plus size={20} />
            Novo Agente
          </div>
        </Button>
      </div>

      <AgentList
        agents={agents}
        onSelectAgent={setSelectedAgent}
        onDeleteAgent={deleteAgent}
      />

      <CreateAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAgent}
      />
    </div>
  );
};

export default Agents;
