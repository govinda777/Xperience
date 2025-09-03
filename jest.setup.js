// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock crypto
global.crypto = {
  getRandomValues: jest.fn(),
  subtle: {
    digest: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    sign: jest.fn(),
    verify: jest.fn(),
    generateKey: jest.fn(),
    deriveKey: jest.fn(),
    importKey: jest.fn(),
    exportKey: jest.fn(),
    wrapKey: jest.fn(),
    unwrapKey: jest.fn(),
  },
};

// Mock window.location
delete window.location;
window.location = {
  href: '',
  hash: '',
  host: '',
  hostname: '',
  origin: '',
  pathname: '',
  port: '',
  protocol: '',
  search: '',
  assign: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  toString: jest.fn(),
};

// Mock TextEncoder/TextDecoder
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

// Mock performance API
const mockPerformanceObserver = jest.fn();
class PerformanceObserverMock {
  constructor(callback) {
    this.callback = callback;
    mockPerformanceObserver(callback);
  }
  observe = jest.fn();
  disconnect = jest.fn();
}

global.PerformanceObserver = PerformanceObserverMock;

const mockNavigationTiming = {
  requestStart: 0,
  responseStart: 100,
};

const mockPaintEntry = {
  name: 'first-contentful-paint',
  startTime: 150,
};

global.performance = {
  getEntriesByType: jest.fn((type) => {
    switch (type) {
      case 'navigation':
        return [mockNavigationTiming];
      case 'paint':
        return [mockPaintEntry];
      default:
        return [];
    }
  }),
  getEntriesByName: jest.fn().mockReturnValue([]),
  now: jest.fn().mockReturnValue(0),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  timing: {
    navigationStart: 0,
    loadEventEnd: 0,
  },
};