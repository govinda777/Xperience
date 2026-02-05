import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Input, FlexBoxCol } from '../../components/styled/styled';
import { Agent } from './types';

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
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ name, role, description });
    setName('');
    setRole('');
    setDescription('');
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
              <Label>Descrição / Instruções</Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Descreva como o agente deve se comportar, o que ele sabe e como deve responder..."
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
