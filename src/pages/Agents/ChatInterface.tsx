import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Button, Input } from '../../components/styled/styled';
import { Agent, Message } from './types';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';

const ChatContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
  min-height: 500px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
`;

const ChatHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #fff;
  z-index: 10;
`;

const MessagesArea = styled.div`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #fafafa;
`;

const InputArea = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 12px;
  background-color: #fff;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 12px 18px;
  border-radius: 16px;
  align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) => (props.$isUser ? 'var(--tg-theme-button-color, #FD9526)' : '#fff')};
  color: ${(props) => (props.$isUser ? 'var(--tg-theme-button-text-color, #fff)' : '#333')};
  border-bottom-right-radius: ${(props) => (props.$isUser ? '4px' : '16px')};
  border-bottom-left-radius: ${(props) => (!props.$isUser ? '4px' : '16px')};
  line-height: 1.5;
  box-shadow: ${(props) => (props.$isUser ? 'none' : '0 2px 5px rgba(0,0,0,0.05)')};
  white-space: pre-wrap;
`;

interface Props {
  agent: Agent;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onBack: () => void;
}

const ChatInterface: React.FC<Props> = ({ agent, messages, onSendMessage, onBack }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Focus input on mount
    inputRef.current?.focus();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageContent = input;
    setInput('');
    setIsLoading(true);

    try {
      await onSendMessage(messageContent);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Could add error handling UI here
    } finally {
      setIsLoading(false);
      // Re-focus input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-50">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-tight">{agent.name}</h3>
          <p className="text-xs text-gray-500 font-medium">{agent.role}</p>
        </div>
      </ChatHeader>

      <MessagesArea>
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bot size={40} className="text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-600 mb-2">Comece uma conversa com {agent.name}</h4>
                <p className="text-sm opacity-70 max-w-xs">{agent.description}</p>
            </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <MessageBubble $isUser={msg.role === 'user'}>
              {msg.content}
            </MessageBubble>
          </div>
        ))}

        {isLoading && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center shadow-sm">
               <Bot size={16} />
             </div>
             <MessageBubble $isUser={false}>
               <div className="flex gap-1 py-1">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </MessageBubble>
           </div>
        )}
        <div ref={messagesEndRef} />
      </MessagesArea>

      <InputArea>
        <div className="relative flex-grow">
          <Input
            ref={inputRef} // Fix: use ref here
            as="input" // Ensure it renders as input if styled component is generic
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            style={{ paddingRight: '50px' }}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Send size={20} />
        </Button>
      </InputArea>
    </ChatContainer>
  );
};

export default ChatInterface;
