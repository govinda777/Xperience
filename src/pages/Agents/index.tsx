import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { StateInspector } from './components/StateInspector';
import { Button, Input, FlexBoxRow, FlexBoxCol, Card } from '../../components/styled/styled';
import { Send, Bot, User, Cpu } from 'lucide-react';

const PageContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px); /* Adjust based on header height */
  background-color: #f1f3f5;
  overflow: hidden;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  max-width: 80%;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${props => props.isUser ? '#007bff' : 'white'};
  color: ${props => props.isUser ? 'white' : '#212529'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  border-bottom-right-radius: ${props => props.isUser ? '2px' : '12px'};
  border-bottom-left-radius: ${props => props.isUser ? '12px' : '2px'};
`;

const InputContainer = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StyledInput = styled(Input)`
  flex: 1;
  border: 1px solid #dee2e6;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Header = styled.div`
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  margin: 0;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AgentPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([
    { role: 'assistant', content: 'Hello! I am the Xperience Super Agent. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: userMessage,
            sessionId: agentState?.sessionId // Pass existing session ID if available
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      setAgentState(data.state); // Update the inspector with the full state
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header>
        <Cpu size={24} color="#007bff" />
        <Title>Xperience Super Agent</Title>
      </Header>

      <PageContainer>
        <ChatArea>
          <MessagesContainer>
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} isUser={msg.role === 'user'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', opacity: 0.8, fontSize: '0.75rem' }}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span>{msg.role === 'user' ? 'You' : 'Agent'}</span>
                </div>
                {msg.content}
              </MessageBubble>
            ))}
            {isLoading && (
               <MessageBubble isUser={false}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="dot" style={{ animation: 'pulse 1s infinite' }}>●</span>
                    <span className="dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>●</span>
                    <span className="dot" style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>●</span>
                  </div>
               </MessageBubble>
            )}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <StyledInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button onClick={handleSubmit} disabled={isLoading || !input.trim()}>
              <Send size={18} />
            </Button>
          </InputContainer>
        </ChatArea>

        <StateInspector state={agentState} isLoading={isLoading} />
      </PageContainer>
    </div>
  );
};

export default AgentPage;
