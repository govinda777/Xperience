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
    // ScrollIntoView mock
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders initial UI elements', () => {
    render(<AgentPage />);

    expect(screen.getByText('Super Agente Xperience')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua mensagem...')).toBeInTheDocument();
    expect(screen.getByText(/Hello! I am the Xperience Super Agent/i)).toBeInTheDocument();

    // Check inspector presence
    expect(screen.getByText('Resumo da Sessão')).toBeInTheDocument();
  });

  it('sends a message and updates the interface', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAgentResponse
    });

    render(<AgentPage />);

    const input = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(input, { target: { value: 'Hello agent' } });

    // Pressing Enter
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    // Or clicking button
    // const sendButton = screen.getByLabelText('Enviar mensagem');
    // fireEvent.click(sendButton);

    // Loading state should appear
    await waitFor(() => {
       // Look for "Processando" badge or similar
       expect(screen.getByText('Processando')).toBeInTheDocument();
    });

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText('I am a super agent')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/agent', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Hello agent')
    }));

    // Verify Inspector updated
    // The mock response has sessionId "mock-session-id"
    expect(screen.getByText('mock-session...')).toBeInTheDocument();
    expect(screen.getByText('test_intent')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<AgentPage />);

    const input = screen.getByPlaceholderText('Digite sua mensagem...');
    fireEvent.change(input, { target: { value: 'Fail me' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
        expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });
});
