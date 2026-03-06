import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadsManager from '../LeadsManager';

// Mock fetch
global.fetch = jest.fn();

describe('LeadsManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders and fetches leads', async () => {
    const mockData = {
      submissions: [
        { id: '1', nomeAnon: 'J*****', emailAnon: 'j*****@example.com', mensagem: 'Empresa X', data: '2023-10-27T10:00:00Z' }
      ]
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<LeadsManager />);

    await waitFor(() => {
      expect(screen.getByText('J*****')).toBeInTheDocument();
      expect(screen.getByText('Empresa X')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/submissions');
  });

  it('submits a new lead', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ submissions: [] }), // Initial empty list
    });

    render(<LeadsManager />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'Maria' } });
    fireEvent.change(screen.getByPlaceholderText('Telefone'), { target: { value: '11888888888' } });
    fireEvent.change(screen.getByPlaceholderText('Empresa'), { target: { value: 'Empresa Y' } });

    // Mock response for POST and subsequent GET
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) }) // POST response
      .mockResolvedValueOnce({ // GET response after submit
        ok: true,
        json: async () => ({
          submissions: [
            { id: '2', nomeAnon: 'M*****', emailAnon: 'm*****@example.com', mensagem: 'Empresa Y', data: '2023-10-27T11:00:00Z' }
          ]
        }),
      });

    fireEvent.click(screen.getByText('Enviar Lead'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/leads', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Maria'),
      }));
    });
  });
});
