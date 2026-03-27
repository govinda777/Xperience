import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, FlexBoxCol } from '../../components/styled/styled';
import { Agent, AgentCommandKey } from './types';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalCard = styled(Card)`
  width: 100%;
  max-width: 500px;
  position: relative;
  margin: 0 20px;
  max-height: 90vh;
  overflow-y: auto;
`;

const TextArea = styled.textarea`
  padding: 10px 20px;
  border-radius: 10px;
  width: 100%;
  border: 1px solid #c2c2c2;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  @media (prefers-color-scheme: dark) {
    border: 1px solid #fefefe;
    background-color: #222;
    color: white;
  }
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
  font-size: 0.9rem;
  color: #555;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Omit<Agent, 'id' | 'createdAt'>) => void;
}

const CreateAgentModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [context, setContext] = useState('');
  const [description, setDescription] = useState('');
  const [commandKeys, setCommandKeys] = useState<AgentCommandKey[]>(['custom']);
  const [customInstructions, setCustomInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onCreate({
        name,
        role,
        context: context.trim(),
        description,
        commandKeys: ['custom'],
        commandKey: 'custom',
        systemPrompt: customInstructions.trim()
    });

    // Reset form
    setName('');
    setRole('');
    setContext('');
    setDescription('');
    setCommandKeys(['custom']);
    setCustomInstructions('');
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Criar Novo Agente</h2>
        <form onSubmit={handleSubmit}>
          <FlexBoxCol>
            <div>
              <Label>Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ex: Consultor de Vendas"
              />
            </div>

            <div>
              <Label>Função</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="Ex: Especialista em Marketing"
              />
            </div>

            <div>
              <Label>Contexto do Agente (Máx. 250 caracteres)</Label>
              <div style={{ position: 'relative' }}>
                <TextArea
                  value={context}
                  onChange={(e) => setContext(e.target.value.slice(0, 250))}
                  placeholder="Diretrizes mestras e conhecimentos específicos..."
                  style={{ minHeight: '80px' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '12px',
                  fontSize: '0.75rem',
                  color: context.length >= 250 ? '#dc3545' : '#868e96'
                }}>
                  {250 - context.length}
                </div>
              </div>
            </div>

            <div>
              <Label>Instruções do Agente (Regras de Negócio e Tom)</Label>
              <TextArea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                required
                placeholder="Descreva como o agente deve se comportar, o que ele sabe e como deve responder..."
              />
            </div>

            <div>
              <Label>Descrição (para listagem)</Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição para identificar este agente na lista..."
                style={{ minHeight: '60px' }}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" onClick={onClose} style={{ backgroundColor: '#e5e7eb', color: '#374151' }}>Cancelar</Button>
              <Button type="submit">Criar Agente</Button>
            </div>
          </FlexBoxCol>
        </form>
      </ModalCard>
    </Overlay>
  );
};

export default CreateAgentModal;
