// jest.setup.js
const { TextEncoder, TextDecoder } = require('util');

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock import.meta
const mockImportMeta = {
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

// Define import.meta globally
Object.defineProperty(global, 'import', {
  value: {
    meta: mockImportMeta
  },
  writable: true
});

// Also define it on globalThis
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: mockImportMeta
  },
  writable: true
});

// Mock for modules that use import.meta
global.importMeta = mockImportMeta;

// Mock URL constructor for asset imports
global.URL = class URL {
  constructor(url, base) {
    this.href = url.startsWith('/') ? `file://${url}` : url;
    this.pathname = url;
  }
};

// Mock navigator
Object.defineProperty(global, 'navigator', {
  value: {
    clipboard: {
      writeText: jest.fn(() => Promise.resolve()),
      readText: jest.fn(() => Promise.resolve('test')),
    },
    userAgent: 'test'
  },
  writable: true
});

// Mock window
Object.defineProperty(global, 'window', {
  value: {
    ...global.window,
    open: jest.fn(),
    Telegram: {
      WebApp: {
        ready: jest.fn(),
        MainButton: {
          setText: jest.fn(),
          show: jest.fn(),
          hide: jest.fn(),
          onClick: jest.fn(),
        },
      }
    }
  },
  writable: true
});

