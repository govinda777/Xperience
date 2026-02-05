import React from 'react';
import styled from 'styled-components';
import { Card, Button } from '../../components/styled/styled';
import { Agent } from './types';
import { Trash2, MessageSquare } from 'lucide-react';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const AgentCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    border-color: #f0f0f0;
  }
`;

const RoleTag = styled.span`
  background-color: #e0e7ff;
  color: #4338ca;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Description = styled.p`
  color: #666;
  font-size: 0.9rem;
  flex-grow: 1;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

interface Props {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
  onDeleteAgent: (id: string) => void;
}

const AgentList: React.FC<Props> = ({ agents, onSelectAgent, onDeleteAgent }) => {
  if (agents.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 mt-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum agente encontrado</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Crie seu primeiro agente de IA para começar a interagir e automatizar tarefas.
        </p>
      </div>
    );
  }

  return (
    <Grid>
      {agents.map((agent) => (
        <AgentCard key={agent.id}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteAgent(agent.id); }}
              className="text-gray-400 hover:text-red-500 p-1 transition-colors rounded hover:bg-red-50"
              title="Excluir agente"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div>
             <RoleTag>{agent.role}</RoleTag>
          </div>
          <Description>{agent.description}</Description>
          <Button onClick={() => onSelectAgent(agent)} style={{ width: '100%' }}>
            <div className="flex items-center gap-2 justify-center">
              <MessageSquare size={18} />
              Conversar
            </div>
          </Button>
        </AgentCard>
      ))}
    </Grid>
  );
};

export default AgentList;
