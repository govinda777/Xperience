import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AgentInspectorPanel } from '../../components/agent/AgentInspectorPanel';
import { Button, Input } from '../../components/styled/styled';
import { Agent, Message } from './types';
import { Send, Bot, User, Cpu, Circle, ArrowLeft, BookOpen, Paperclip } from 'lucide-react';
import { useSessionRAG } from '../../hooks/useSessionRAG';
import { SessionRAGUpload } from '../../components/SessionRAGUpload';
import type { RAGSearchResult } from '../../types/sessionRAG';

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 350px;
  height: calc(100vh - 70px);
  background-color: #f1f3f5;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 250px 1fr 300px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 300px; // Hide files sidebar
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    height: auto;
    overflow-y: auto;
  }
`;

const SidebarContainer = styled.div`
  background: white;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none; // Hidden on smaller screens for now
  }
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 600px;
    border-right: none;
    border-bottom: 1px solid #dee2e6;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 85%;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${props => props.$isUser ? '#007bff' : 'white'};
  color: ${props => props.$isUser ? 'white' : '#212529'};
  align-self: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-bottom-right-radius: ${props => props.$isUser ? '2px' : '12px'};
  border-bottom-left-radius: ${props => props.$isUser ? '12px' : '2px'};
  border: 1px solid ${props => props.$isUser ? '#007bff' : '#dee2e6'};
`;

const RagContextInfo = styled.div`
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  font-size: 0.75rem;
`;

const SourceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0,0,0,0.05);
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
  font-size: 0.7rem;
  color: inherit;
  opacity: 0.9;
`;

const InputContainer = styled.div`
  padding: 1rem;
  background: white;
  border-top: 1px solid #dee2e6;
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
  padding: 0.75rem 1.5rem;
  background: white;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
    color: #495057;
`;

const Title = styled.h1`
  font-size: 1.1rem;
  margin: 0;
  color: #343a40;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
`;

const StatusBadge = styled.div<{ status: 'idle' | 'processing' | 'error' }>`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    color: ${props => {
        switch(props.status) {
            case 'processing': return '#f08c00';
            case 'error': return '#c92a2a';
            default: return '#2b8a3e';
        }
    }};
`;

const ChannelSelect = styled.select`
    border: 1px solid #dee2e6;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    background: white;
    color: #495057;
`;

interface Props {
  agent: Agent;
  messages: Message[];
  onAddMessage: (message: Omit<Message, 'timestamp'>) => void;
  onBack: () => void;
}

const AgentChat: React.FC<Props> = ({ agent, messages, onAddMessage, onBack }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agentState, setAgentState] = useState<any>(null);
  const [channel, setChannel] = useState('web');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // RAG Hook integration
  const sessionRAG = useSessionRAG();
  const { ragContext } = sessionRAG;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    // Optimistically add user message
    onAddMessage({ role: 'user', content: content });

    try {
      // 1. Search for relevant context if files are present
      let augmentedInstructions = agent.systemPrompt || "You are a helpful assistant.";
      let ragResults: RAGSearchResult[] = [];

      if (ragContext.files.length > 0) {
        console.log('🔍 Searching local knowledge base...');
        ragResults = await sessionRAG.searchSimilar(content, {
          topK: 3,
          threshold: 0.4
        });

        if (ragResults.length > 0) {
           console.log(`✅ Found ${ragResults.length} relevant chunks`);
           const contextText = ragResults.map((r, i) =>
             `[SOURCE ${i+1}: ${r.fileName}]\n${r.text}`
           ).join('\n\n');

           augmentedInstructions += `\n\n═══════════════════════════════════════════════════════════
CONTEXTO RELEVANTE (RAG):
═══════════════════════════════════════════════════════════
${contextText}
═══════════════════════════════════════════════════════════
INSTRUÇÕES: Use o contexto acima para responder a pergunta do usuário se relevante. Cite a fonte.`;
        }
      }

      // 2. Call Agent API
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: content,
            sessionId: agentState?.sessionId,
            instructions: augmentedInstructions,
            history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const data = await response.json();

      // 3. Add assistant message with RAG context metadata
      onAddMessage({
          role: 'assistant',
          content: data.message,
          ragContext: ragResults.map(r => ({
            title: r.fileName,
            score: r.score,
            source: `chunk_${r.index}`
          }))
      });

      setAgentState(data.state); // Update inspector
    } catch (error) {
      console.error('Error:', error);
      onAddMessage({ role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    const userMessageContent = input;
    setInput('');
    await sendMessage(userMessageContent);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      zIndex: 1000,
      backgroundColor: '#f1f3f5'
    }}>
      <Header>
        <HeaderLeft>
            <Button onClick={onBack} style={{ padding: '4px 8px', minWidth: 'auto', marginRight: '8px' }} aria-label="Voltar">
                <ArrowLeft size={16} />
            </Button>
            <Cpu size={24} color="#007bff" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Title>{agent.name}</Title>
                <div style={{ fontSize: '0.75rem', color: '#868e96', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{agent.role}</span>
                    <span style={{ color: '#dee2e6' }}>|</span>
                    <StatusBadge status={isLoading ? 'processing' : 'idle'}>
                        <Circle size={8} fill="currentColor" />
                        {isLoading ? 'Processando' : 'Ocioso'}
                    </StatusBadge>
                </div>
            </div>
        </HeaderLeft>
        <HeaderRight>
            <label>Canal:</label>
            <ChannelSelect value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option value="web">Web</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telegram">Telegram</option>
            </ChannelSelect>
        </HeaderRight>
      </Header>

      <PageContainer>
        {/* Files Sidebar */}
        <SidebarContainer>
            <SidebarHeader>
                <BookOpen size={18} />
                Base de Conhecimento
            </SidebarHeader>
            <SessionRAGUpload sessionRAG={sessionRAG} />
        </SidebarContainer>

        {/* Chat Area */}
        <ChatArea>
          <MessagesContainer>
            {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#adb5bd' }}>
                    <Bot size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Inicie a conversa com {agent.name}</p>
                    {ragContext.files.length === 0 && (
                        <small>Faça upload de documentos na barra lateral para dar contexto ao agente.</small>
                    )}
                </div>
            )}
            {messages.map((msg, idx) => (
              <MessageBubble key={idx} $isUser={msg.role === 'user'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', opacity: 0.8, fontSize: '0.75rem' }}>
                  {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  <span>{msg.role === 'user' ? 'Você' : agent.name}</span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>

                {/* RAG Context Display */}
                {msg.ragContext && msg.ragContext.length > 0 && (
                    <RagContextInfo>
                        <div style={{ marginBottom: '4px', fontWeight: 600 }}>Fontes Consultadas:</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {msg.ragContext.map((ctx, i) => (
                                <SourceBadge key={i} title={`Score: ${(ctx.score * 100).toFixed(0)}%`}>
                                    <Paperclip size={10} />
                                    {ctx.title}
                                </SourceBadge>
                            ))}
                        </div>
                    </RagContextInfo>
                )}
              </MessageBubble>
            ))}
            {isLoading && (
               <MessageBubble $isUser={false}>
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
              placeholder={ragContext.files.length > 0 ? "Faça uma pergunta sobre os documentos..." : "Digite sua mensagem..."}
              disabled={isLoading}
            />
            <Button onClick={handleSubmit} disabled={isLoading || !input.trim()} aria-label="Enviar mensagem">
              <Send size={18} />
            </Button>
          </InputContainer>
        </ChatArea>

        {/* Inspector Panel */}
        <AgentInspectorPanel
            state={agentState}
            isLoading={isLoading}
            onSendMessage={sendMessage}
        />
      </PageContainer>
    </div>
  );
};

export default AgentChat;
