import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, FlexBoxCol } from '../../components/styled/styled';
import { Agent, AgentCommandKey } from './types';
import { COMMAND_TEMPLATES } from './constants';

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

const StyledSelect = styled.select`
  padding: 10px 20px;
  border-radius: 10px;
  width: 100%;
  border: 1px solid #c2c2c2;
  background-color: white;
  font-family: inherit;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right .7em top 50%;
  background-size: .65em auto;

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

const HelperText = styled.p`
  font-size: 0.8rem;
  color: #666;
  margin-top: 4px;
  margin-bottom: 0;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (agent: Omit<Agent, 'id' | 'createdAt'>) => void;
}

const CreateAgentModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [commandKey, setCommandKey] = useState<AgentCommandKey>('new_report');
  const [customInstructions, setCustomInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let systemPrompt = COMMAND_TEMPLATES[commandKey].baseSystemPrompt;
    if (commandKey === 'custom') {
        systemPrompt = customInstructions;
    }

    onCreate({
        name,
        role,
        description,
        commandKey,
        systemPrompt
    });

    // Reset form
    setName('');
    setRole('');
    setDescription('');
    setCommandKey('new_report');
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
              <Label>Comando / Template</Label>
              <StyledSelect
                value={commandKey}
                onChange={(e) => setCommandKey(e.target.value as AgentCommandKey)}
              >
                {Object.entries(COMMAND_TEMPLATES).map(([key, template]) => (
                    <option key={key} value={key}>
                        {template.label}
                    </option>
                ))}
              </StyledSelect>
              <HelperText>
                  {COMMAND_TEMPLATES[commandKey].description}
              </HelperText>
            </div>

            {commandKey === 'custom' && (
                <div>
                  <Label>Instruções Personalizadas</Label>
                  <TextArea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    required
                    placeholder="Descreva como o agente deve se comportar, o que ele sabe e como deve responder..."
                  />
                </div>
            )}

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
