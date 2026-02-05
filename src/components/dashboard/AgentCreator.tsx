import React, { useState } from 'react';
import { Agent } from '../../types/agent';
import { saveAgent } from '../../services/agentStorageService';

interface AgentCreatorProps {
  onAgentCreated: (agent: Agent) => void;
  onCancel: () => void;
}

const AgentCreator: React.FC<AgentCreatorProps> = ({ onAgentCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [systemPrompt, setSystemPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !systemPrompt) return;

    const newAgent: Agent = {
      id: Date.now().toString(),
      name,
      avatar,
      systemPrompt,
      createdAt: new Date().toISOString(),
    };

    saveAgent(newAgent);
    onAgentCreated(newAgent);
  };

  const emojis = ['🤖', '👨‍💼', '👩‍🔬', '🧙‍♂️', '👽', '🧠', '💼', '🚀'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Criar Novo Agente</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Nome do Agente</label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            placeholder="Ex: Consultor de Marketing"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Avatar</label>
          <div className="flex gap-4 mb-3">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`text-2xl w-12 h-12 rounded-full flex items-center justify-center border transition ${
                  avatar === emoji
                    ? 'bg-orange-100 border-orange-500 scale-110'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Instruções (Prompt do Sistema)</label>
          <p className="text-sm text-gray-500 mb-2">Defina como o agente deve se comportar e qual seu objetivo.</p>
          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition h-32 resize-none"
            placeholder="Ex: Você é um especialista em marketing digital focado em pequenas empresas. Seu objetivo é criar estratégias de crescimento..."
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-4 justify-end pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition shadow-md"
          >
            Criar Agente
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentCreator;
