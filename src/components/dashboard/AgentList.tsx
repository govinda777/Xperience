import React, { useEffect, useState } from 'react';
import { Agent } from '../../types/agent';
import { getAgents } from '../../services/agentStorageService';

interface AgentListProps {
  onSelectAgent: (agent: Agent) => void;
  onCreateNew: () => void;
  refreshTrigger: number;
}

const AgentList: React.FC<AgentListProps> = ({ onSelectAgent, onCreateNew, refreshTrigger }) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    setAgents(getAgents());
  }, [refreshTrigger]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Create New Card */}
      <button
        onClick={onCreateNew}
        className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition group h-64"
      >
        <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 group-hover:scale-110 transition">
          <span className="text-3xl text-orange-600">+</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 group-hover:text-orange-700">Criar Novo Agente</h3>
        <p className="text-sm text-gray-500 mt-2 text-center">Configure um novo assistente personalizado</p>
      </button>

      {/* Agent Cards */}
      {agents.slice().reverse().map((agent) => (
        <div
            key={agent.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col h-64 cursor-pointer group"
            onClick={() => onSelectAgent(agent)}
        >
          <div className="p-6 flex flex-col items-center flex-grow">
            <div className="text-5xl mb-4 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-105 transition">
                {agent.avatar}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center truncate w-full">{agent.name}</h3>
            <p className="text-gray-500 text-sm text-center line-clamp-3 w-full">
              {agent.systemPrompt}
            </p>
          </div>
          <div className="bg-gray-50 p-4 border-t text-center text-orange-600 font-medium text-sm group-hover:bg-orange-600 group-hover:text-white transition">
            Conversar agora →
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentList;
