import React, { useState } from 'react';
import styled from 'styled-components';
import { useAgents } from './useAgents';
import AgentList from './AgentList';
import CreateAgentModal from './CreateAgentModal';
import ChatInterface from './ChatInterface';
import { Button } from '../../components/styled/styled';
import { Plus, Users } from 'lucide-react';
import { Agent, Message } from './types';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const AgentsPage: React.FC = () => {
  const { agents, addAgent, deleteAgent, getMessages, addMessage } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateAgent = (agentData: Omit<Agent, 'id' | 'createdAt'>) => {
    const newAgent = addAgent(agentData);
    setIsModalOpen(false);
    // Optionally auto-select the new agent
    setSelectedAgent(newAgent);
  };

  const handleSelectAgent = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  const handleDeleteAgent = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agente?')) {
        deleteAgent(id);
        if (selectedAgent?.id === id) {
            setSelectedAgent(null);
        }
    }
  };

  // If an agent is selected, show the chat interface
  if (selectedAgent) {
    return (
      <ChatInterface
        agent={selectedAgent}
        messages={getMessages(selectedAgent.id)}
        onAddMessage={(msg) => addMessage(selectedAgent.id, msg)}
        onBack={() => setSelectedAgent(null)}
      />
    );
  }

  // Otherwise show the list
  return (
    <Container>
      <Header>
        <Title>
            <Users size={32} />
            Meus Agentes
        </Title>
        <Button onClick={() => setIsModalOpen(true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={18} />
                Novo Agente
            </div>
        </Button>
      </Header>

      <AgentList
        agents={agents}
        onSelectAgent={handleSelectAgent}
        onDeleteAgent={handleDeleteAgent}
      />

      {agents.length === 0 && (
         <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Button onClick={() => setIsModalOpen(true)}>
                Criar Primeiro Agente
            </Button>
         </div>
      )}

      <CreateAgentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateAgent}
      />
    </Container>
  );
};

export default AgentsPage;
