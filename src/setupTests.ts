// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder for Node.js environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock import.meta.env for Vite
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {
        VITE_MERCADO_PAGO_PUBLIC_KEY: 'test-key',
        VITE_RPC_URL: 'https://test-rpc.com',
        VITE_PRIVY_APP_ID: 'test-app-id',
        VITE_ALCHEMY_API_KEY: 'test-alchemy-key',
        VITE_GITHUB_CLIENT_ID: 'test-github-client-id',
        VITE_GITHUB_CLIENT_SECRET: 'test-github-secret',
        VITE_GA_MEASUREMENT_ID: 'G-TEST123',
      },
      url: 'file://test'
    }
  },
  writable: true
});

// Alternative mock for import.meta
(global as any).importMeta = {
  env: {
    VITE_MERCADO_PAGO_PUBLIC_KEY: 'test-key',
    VITE_RPC_URL: 'https://test-rpc.com',
    VITE_PRIVY_APP_ID: 'test-app-id',
    VITE_ALCHEMY_API_KEY: 'test-alchemy-key',
    VITE_GITHUB_CLIENT_ID: 'test-github-client-id',
    VITE_GITHUB_CLIENT_SECRET: 'test-github-secret',
    VITE_GA_MEASUREMENT_ID: 'G-TEST123',
  },
  url: 'file://test'
};

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('test')),
  },
  writable: true,
});

// Define o mock do WebApp do Telegram
const mockTelegramWebApp = {
  ready: jest.fn(),
  MainButton: {
    setText: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    onClick: jest.fn(),
  },
};

// Atribui o mock ao objeto window
Object.defineProperty(window, 'Telegram', {
  value: {
    WebApp: mockTelegramWebApp
  },
  writable: true
});

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true,
});

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});