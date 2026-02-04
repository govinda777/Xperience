import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadsManager from '../LeadsManager';

// Mock fetch
global.fetch = jest.fn();

describe('LeadsManager', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders and fetches leads', async () => {
    const mockLeads = [
      { id: 1, nome: 'João Silva', telefone: '11999999999', empresa: 'Empresa X', status: 'Enviado' }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLeads,
    });

    render(<LeadsManager />);

    await waitFor(() => {
      expect(screen.getByText('J*****')).toBeInTheDocument();
      expect(screen.getByText('9999')).toBeInTheDocument();
      expect(screen.getByText('Empresa X')).toBeInTheDocument();
      expect(screen.getByText('Enviado')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/clientes');
  });

  it('submits a new lead', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [], // Initial empty list
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
        json: async () => [
            { id: 2, nome: 'Maria', telefone: '11888888888', empresa: 'Empresa Y', status: 'Enviado' }
        ],
      });

    fireEvent.click(screen.getByText('Enviar Lead'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/clientes', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Maria'),
      }));
    });
  });
});
