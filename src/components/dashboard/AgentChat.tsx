import React, { useEffect, useState, useRef } from 'react';
import { Agent, Message } from '../../types/agent';
import { getMessages, saveMessage } from '../../services/agentStorageService';
import { sendMessageToAgent } from '../../services/chatService';
import { ArrowLeft, Send } from 'lucide-react';

interface AgentChatProps {
  agent: Agent;
  onBack: () => void;
}

const AgentChat: React.FC<AgentChatProps> = ({ agent, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(getMessages(agent.id));
  }, [agent.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveMessage(agent.id, userMessage);
    setInputValue('');
    setLoading(true);

    try {
      const apiMessages = [
        { role: 'system', content: agent.systemPrompt },
        ...newMessages.map(m => ({ role: m.role, content: m.content }))
      ];

      const responseMessage = await sendMessageToAgent(apiMessages as any);

      const assistantMessage: Message = {
        ...responseMessage,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      saveMessage(agent.id, assistantMessage);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        role: 'system',
        content: 'Ocorreu um erro ao processar sua mensagem. Verifique se a API Key está configurada corretamente.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4 flex items-center text-white shadow-md z-10">
        <button onClick={onBack} className="mr-4 hover:bg-white/20 p-2 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center">
            <div className="text-3xl mr-3 bg-white/20 w-10 h-10 rounded-full flex items-center justify-center">
                {agent.avatar}
            </div>
            <div>
                <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
                <p className="text-xs text-orange-100 opacity-90">Assistente Virtual</p>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                <div className="text-6xl mb-4 grayscale opacity-50">{agent.avatar}</div>
                <p className="font-medium">Comece uma conversa com {agent.name}</p>
                <p className="text-sm opacity-70 mt-1 max-w-md">{agent.systemPrompt}</p>
            </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-orange-600 text-white rounded-tr-none'
                  : msg.role === 'system'
                    ? 'bg-red-50 text-red-600 border border-red-200 text-center w-full max-w-full'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 px-4 py-4 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 bg-gray-50 transition"
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || loading}
            className="p-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
