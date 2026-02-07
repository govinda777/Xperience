import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AgentPage from '../index';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = jest.fn();

const mockAgentResponse = {
  message: "I am a super agent",
  state: {
    sessionId: "mock-session-id",
    intent: "test_intent",
    securityLevel: 1,
    nodes: [],
    variables: {
        intent: "test_intent",
        slots: {},
        ragContext: [],
        rawState: {}
    },
    auditLog: [
        { step: "Reasoning", timestamp: "2025-01-01T00:00:00Z", details: "Thinking" }
    ],
    messages: [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'I am a super agent' }
    ]
  }
};

describe('AgentPage Integration', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    localStorage.clear();
    // ScrollIntoView mock
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders list view initially', () => {
    render(<AgentPage />);
    expect(screen.getByText('Meus Agentes')).toBeInTheDocument();
    // Empty state logic: assuming initially empty
    expect(screen.getByText('Criar Primeiro Agente')).toBeInTheDocument();
  });

  it('can create an agent and start chatting', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockAgentResponse
    });

    render(<AgentPage />);

    // Open modal
    const createButton = screen.getByText('Criar Primeiro Agente');
    fireEvent.click(createButton);

    // Fill form
    const nameInput = screen.getByPlaceholderText('Ex: Consultor de Vendas');
    fireEvent.change(nameInput, { target: { value: 'Test Bot' } });

    const roleInput = screen.getByPlaceholderText('Ex: Especialista em Marketing');
    fireEvent.change(roleInput, { target: { value: 'Tester' } });

    const descInput = screen.getByPlaceholderText('Breve descrição para identificar este agente na lista...');
    fireEvent.change(descInput, { target: { value: 'Description' } });

    // Submit
    const submitButton = screen.getByText('Criar Agente');
    fireEvent.click(submitButton);

    // Should now show chat (auto-selected)
    await waitFor(() => {
        expect(screen.getByText('Test Bot')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Digite sua mensagem...')).toBeInTheDocument();
    });

    // Send message
    const input = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('I am a super agent')).toBeInTheDocument();
    });
  });
});
