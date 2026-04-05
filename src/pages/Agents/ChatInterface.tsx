import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useChat } from '@ai-sdk/react';
import { AgentInspectorPanel } from '../../components/agent/AgentInspectorPanel';
import { Button, Input } from '../../components/styled/styled';
import { Agent } from './types';
import { Send, Bot, User, Cpu, Circle, ArrowLeft, BookOpen, Save, Loader2, Info } from 'lucide-react';

const PageContainer = styled.div<{ $showInspector: boolean }>`
  display: grid;
  grid-template-columns: 280px 1fr ${props => props.$showInspector ? '350px' : '0px'};
  height: calc(100vh - 70px);
  background-color: #f1f3f5;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 250px 1fr 300px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 300px;
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
    display: none;
  }
`;

const SidebarHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center; gap: 0.5rem;
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
  onUpdateAgent: (updates: Partial<Agent>) => void;
  onBack: () => void;
}

const AgentChat: React.FC<Props> = ({ agent, onUpdateAgent, onBack }) => {
  const [channel, setChannel] = useState('web');
  const [context, setContext] = useState((agent && agent.context) || '');
  const [isSavingContext, setIsSavingContext] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      sessionId: (agent && agent.id) || 'default',
      instructions: (agent && agent.systemPrompt) || 'You are a helpful assistant.',
      context: context
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSaveContext = () => {
    setIsSavingContext(true);
    onUpdateAgent({ context });
    setTimeout(() => setIsSavingContext(false), 500);
  };

  if (!agent) return <div style={{ padding: '2rem' }}>Carregando agente...</div>;

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
                <Title>{agent.name || 'Agente'}</Title>
                <div style={{ fontSize: '0.75rem', color: '#868e96', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{agent.role || 'Assistente'}</span>
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
            <Button
                onClick={() => setShowInspector(!showInspector)}
                style={{
                    padding: '6px',
                    minWidth: 'auto',
                    backgroundColor: showInspector ? '#007bff' : 'transparent',
                    color: showInspector ? 'white' : '#495057',
                    border: '1px solid #dee2e6'
                }}
                title={showInspector ? "Esconder Inspetor" : "Mostrar Inspetor"}
            >
                <Info size={18} />
            </Button>
        </HeaderRight>
      </Header>

      <PageContainer $showInspector={showInspector}>
        {/* Sidebar for Context */}
        <SidebarContainer>
            <SidebarHeader>
                <BookOpen size={18} />
                Contexto do Agente
            </SidebarHeader>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value.slice(0, 250))}
                  placeholder="Insira as diretrizes mestras do agente (máx. 250 caracteres)..."
                  style={{
                    width: '100%',
                    height: '150px',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #dee2e6',
                    fontSize: '0.875rem',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  fontSize: '0.7rem',
                  color: (context || '').length >= 250 ? '#dc3545' : '#868e96'
                }}>
                  {250 - (context || '').length}
                </div>
              </div>
              <Button
                onClick={handleSaveContext}
                disabled={isSavingContext}
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Save size={14} />
                {isSavingContext ? 'Salvando...' : 'Salvar Contexto'}
              </Button>
            </div>
        </SidebarContainer>

        {/* Chat Area */}
        <ChatArea>
          <MessagesContainer>
            {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#adb5bd' }}>
                    <Bot size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Inicie a conversa com {agent.name || 'Agente'}</p>
                </div>
            )}
            {messages.map((msg) => (
              <React.Fragment key={msg.id}>
                <MessageBubble $isUser={msg.role === 'user'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', opacity: 0.8, fontSize: '0.75rem' }}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    <span>{msg.role === 'user' ? 'Você' : (agent.name || 'Agente')}</span>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                </MessageBubble>

                {msg.toolInvocations?.map((toolInvocation) => {
                    const { toolName, toolCallId, state } = toolInvocation;
                    if (state === 'result') {
                        return (
                            <div key={toolCallId} style={{ alignSelf: 'center', fontSize: '0.75rem', background: '#e9ecef', padding: '4px 12px', borderRadius: '16px', color: '#495057', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Cpu size={12} /> Executado: {toolName}
                            </div>
                        );
                    } else {
                        return (
                            <div key={toolCallId} style={{ alignSelf: 'center', fontSize: '0.75rem', background: '#fff3bf', padding: '4px 12px', borderRadius: '16px', color: '#f08c00', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Loader2 size={12} className="animate-spin" /> Chamando: {toolName}...
                            </div>
                        );
                    }
                })}
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </MessagesContainer>

          <form onSubmit={handleSubmit}>
            <InputContainer>
                <StyledInput
                value={input}
                onChange={handleInputChange}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()} aria-label="Enviar mensagem">
                <Send size={18} />
                </Button>
            </InputContainer>
          </form>
        </ChatArea>

        {/* Inspector Panel */}
        {showInspector && (
            <AgentInspectorPanel
                state={{ messages, isLoading }}
                isLoading={isLoading}
                onSendMessage={() => {}}
            />
        )}
      </PageContainer>
    </div>
  );
};

export default AgentChat;
