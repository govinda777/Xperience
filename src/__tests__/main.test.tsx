// src/__tests__/main.test.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import App from '../App';

// Mock das dependências
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@tonconnect/ui-react', () => ({
  TonConnectUIProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock('../App', () => ({
  __esModule: true,
  default: () => null,
}));

describe('Main entry point', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup DOM
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  });

  afterEach(() => {
    // Cleanup
    document.body.innerHTML = '';
  });

  it('should render app using createRoot', () => {
    // Carrega o main
    require('../main');

    // Verifica se createRoot foi chamado
    expect(createRoot).toHaveBeenCalledWith(
      document.getElementById('root')
    );

    // Verifica se render foi chamado
    const mockRoot = (createRoot as jest.Mock).mock.results[0].value;
    expect(mockRoot.render).toHaveBeenCalled();

    // Verifica se QueryClient foi instanciado
    expect(QueryClient).toHaveBeenCalled();
  });
});