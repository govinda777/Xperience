import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AgentList from '../../components/dashboard/AgentList';
import AgentCreator from '../../components/dashboard/AgentCreator';
import AgentChat from '../../components/dashboard/AgentChat';
import { Agent } from '../../types/agent';

const Dashboard = () => {
  const { user, logout, ready } = useAuth();
  const [view, setView] = useState<'list' | 'create' | 'chat'>('list');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setView('chat');
  };

  const handleAgentCreated = () => {
    setView('list');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedAgent(null);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-xl font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-[80vh]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
          <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Área Logada</h1>
                <p className="mt-2 text-amber-100">
                    Bem-vindo à sua área exclusiva de usuário
                </p>
              </div>
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-black/20 text-white rounded hover:bg-black/30 transition text-sm font-medium"
              >
                Sair
              </button>
          </div>
        </div>

        {/* User Profile Summary - Simplified */}
        <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold">
                    {(user?.email?.address?.charAt(0) || user?.wallet?.address?.charAt(0) || "U").toUpperCase()}
                </div>
                <div className="text-sm">
                    <p className="font-bold text-gray-800">{user?.email?.address || "Usuário"}</p>
                    <p className="text-gray-500 text-xs">ID: {user?.id.slice(0, 8)}...</p>
                </div>
            </div>
            {view !== 'list' && (
                <button
                    onClick={handleBackToList}
                    className="text-orange-600 text-sm hover:underline"
                >
                    Voltar para lista
                </button>
            )}
        </div>

        {/* Content Area */}
        <div className="p-6 bg-[#F9F9F9] min-h-[600px]">
            {view === 'list' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-800">Meus Agentes de IA</h2>
                    </div>
                    <AgentList
                        onSelectAgent={handleAgentSelect}
                        onCreateNew={() => setView('create')}
                        refreshTrigger={refreshTrigger}
                    />
                </div>
            )}

            {view === 'create' && (
                <AgentCreator
                    onAgentCreated={handleAgentCreated}
                    onCancel={handleBackToList}
                />
            )}

            {view === 'chat' && selectedAgent && (
                <AgentChat
                    agent={selectedAgent}
                    onBack={handleBackToList}
                />
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
