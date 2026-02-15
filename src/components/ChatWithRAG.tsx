// components/ChatWithRAG.tsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAgentWithRAG } from '../hooks/useAgentWithRAG';
import { useAgents } from '../pages/Agents/useAgents';
import { SessionRAGUpload } from './SessionRAGUpload';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface Props {
  agentId: string;
  onBack: () => void;
  agentName: string;
}

export const ChatWithRAG: React.FC<Props> = ({ agentId, onBack, agentName }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessageWithRAG, isProcessing, sessionRAG } = useAgentWithRAG(agentId);
  const { getMessages } = useAgents();

  const messages = getMessages(agentId);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const query = inputValue;
    setInputValue('');

    await sendMessageWithRAG(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container>
      {/* Sidebar com upload */}
      <Sidebar>
        <SidebarTitle>
            <BackButton onClick={onBack}>
                <ArrowLeft size={20} />
            </BackButton>
            📚 Documentos
        </SidebarTitle>
        <SessionRAGUpload sessionRAG={sessionRAG} />

        <SidebarStats>
          <StatsItem>
            📊 Total: {sessionRAG.ragContext.totalChunks} chunks
          </StatsItem>
        </SidebarStats>
      </Sidebar>

      {/* Área de mensagens */}
      <MainArea>
        <Header>
            <HeaderTitle>
                <BookOpen size={24} color="#007bff"/>
                {agentName} <ModeBadge>Modo RAG</ModeBadge>
            </HeaderTitle>
        </Header>
        <MessagesArea>
          {messages.length === 0 && (
            <WelcomeMessage>
              <WelcomeIcon>👋</WelcomeIcon>
              <WelcomeText>
                Olá! Faça upload de documentos e comece a fazer perguntas.
              </WelcomeText>
            </WelcomeMessage>
          )}

          {messages.map((msg, idx) => (
            <MessageBubble key={idx} $role={msg.role}>
              <MessageHeader>
                <MessageRole>
                  {msg.role === 'user' ? '👤 Você' : '🤖 Assistente'}
                </MessageRole>
                {msg.timeMs && (
                  <MessageTime>{msg.timeMs}ms</MessageTime>
                )}
              </MessageHeader>

              <MessageContent>{msg.content}</MessageContent>

              {/* Indicador de fontes RAG */}
              {msg.ragContext && msg.ragContext.length > 0 && (
                <RAGSourceIndicator>
                  <SourceIcon>📚</SourceIcon>
                  <SourceLabel>Fontes consultadas:</SourceLabel>
                  <SourceBadges>
                    {msg.ragContext.map((ctx, i) => (
                      <SourceBadge key={i}>
                        {ctx.title} ({(ctx.score * 100).toFixed(0)}%)
                      </SourceBadge>
                    ))}
                  </SourceBadges>
                </RAGSourceIndicator>
              )}
            </MessageBubble>
          ))}

          {isProcessing && (
            <LoadingIndicator>
              <Spinner />
              <LoadingText>
                Consultando documentos e gerando resposta...
              </LoadingText>
            </LoadingIndicator>
          )}

          <div ref={messagesEndRef} />
        </MessagesArea>

        {/* Input de mensagem */}
        <InputArea>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              sessionRAG.ragContext.files.length > 0
                ? "Faça uma pergunta sobre seus documentos..."
                : "Faça upload de documentos primeiro"
            }
            disabled={isProcessing || sessionRAG.ragContext.files.length === 0}
            rows={2}
          />
          <SendButton
            onClick={handleSend}
            disabled={isProcessing || !inputValue.trim() || sessionRAG.ragContext.files.length === 0}
          >
            {isProcessing ? '⏳' : '📤'} Enviar
          </SendButton>
        </InputArea>
      </MainArea>
    </Container>
  );
};

// Estilos
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f8f9fa;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarTitle = styled.h2`
  padding: 1rem;
  margin: 0;
  font-size: 1.25rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 4px;
    &:hover {
        background: #f1f3f5;
    }
`;

const SidebarStats = styled.div`
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  margin-top: auto;
`;

const StatsItem = styled.div`
  font-size: 0.875rem;
  color: #6c757d;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
`;

const HeaderTitle = styled.h2`
    margin: 0;
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

const ModeBadge = styled.span`
    font-size: 0.75rem;
    background: #e7f5ff;
    color: #007bff;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  text-align: center;
`;

const WelcomeIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.div`
  font-size: 1.125rem;
`;

const MessageBubble = styled.div<{ $role: string }>`
  align-self: ${props => props.$role === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  background: ${props => props.$role === 'user' ? '#007bff' : 'white'};
  color: ${props => props.$role === 'user' ? 'white' : '#212529'};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.8;
`;

const MessageRole = styled.div`
  font-weight: 600;
`;

const MessageTime = styled.div``;

const MessageContent = styled.div`
  line-height: 1.5;
  white-space: pre-wrap;
`;

const RAGSourceIndicator = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  font-size: 0.875rem;
`;

const SourceIcon = styled.span`
  margin-right: 0.5rem;
`;

const SourceLabel = styled.span`
  font-weight: 500;
`;

const SourceBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SourceBadge = styled.div`
  background: rgba(0,0,0,0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  align-self: flex-start;
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: #6c757d;
`;

const InputArea = styled.div`
  padding: 1rem;
  background: white;
  border-top: 1px solid #dee2e6;
  display: flex;
  gap: 1rem;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  resize: none;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:disabled {
    background: #e9ecef;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #0056b3;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;
