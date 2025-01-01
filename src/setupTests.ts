// src/setupTests.ts
import '@testing-library/jest-dom';

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

// Limpa todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});