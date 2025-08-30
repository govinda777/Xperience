import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Global setup
BeforeAll(async function () {
  console.log('🚀 Iniciando testes BDD do Xperience');
  
  // Setup global mocks
  global.fetch = jest.fn();
  
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
  
  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  });
  
  // Mock window.location
  delete (window as any).location;
  (window as any).location = {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  };
  
  // Mock console methods to reduce noise in tests
  console.warn = jest.fn();
  console.error = jest.fn();
});

// Global cleanup
AfterAll(async function () {
  console.log('✅ Testes BDD do Xperience finalizados');
  
  // Cleanup global mocks
  jest.restoreAllMocks();
});

// Before each scenario
Before(async function (this: CustomWorld) {
  // Reset world state
  this.resetState();
  
  // Clear all mocks
  jest.clearAllMocks();
  
  // Reset localStorage mock
  const localStorage = window.localStorage as jest.Mocked<Storage>;
  localStorage.getItem.mockReturnValue(null);
  localStorage.setItem.mockImplementation(() => {});
  localStorage.removeItem.mockImplementation(() => {});
  localStorage.clear.mockImplementation(() => {});
  
  // Reset sessionStorage mock
  const sessionStorage = window.sessionStorage as jest.Mocked<Storage>;
  sessionStorage.getItem.mockReturnValue(null);
  sessionStorage.setItem.mockImplementation(() => {});
  sessionStorage.removeItem.mockImplementation(() => {});
  sessionStorage.clear.mockImplementation(() => {});
  
  // Reset fetch mock
  const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
  fetchMock.mockClear();
  
  // Default successful responses for common APIs
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('coingecko.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          bitcoin: { brl: 300000, usd: 50000 },
          tether: { brl: 5.5 }
        })
      } as Response);
    }
    
    if (url.includes('mercadopago.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 'mp-123',
          status: 'pending',
          point_of_interaction: {
            transaction_data: {
              qr_code: 'mock-qr-code',
              qr_code_base64: 'mock-base64'
            }
          }
        })
      } as Response);
    }
    
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    } as Response);
  });
});

// After each scenario
After(async function (this: CustomWorld, scenario) {
  // Log scenario result
  if (scenario.result?.status === 'PASSED') {
    console.log(`✅ Cenário passou: ${scenario.pickle.name}`);
  } else if (scenario.result?.status === 'FAILED') {
    console.log(`❌ Cenário falhou: ${scenario.pickle.name}`);
    if (scenario.result.message) {
      console.log(`   Erro: ${scenario.result.message}`);
    }
  }
  
  // Cleanup scenario-specific state
  this.resetState();
});

// Tag-specific hooks
Before({ tags: '@auth' }, async function (this: CustomWorld) {
  // Setup authentication-specific mocks
  this.setAuthenticatedUser({
    sub: 'test-user-123',
    email: 'test@xperience.com',
    name: 'Test User'
  });
});

Before({ tags: '@payment' }, async function (this: CustomWorld) {
  // Setup payment-specific mocks
  this.setAuthenticatedUser({
    sub: 'test-user-123',
    email: 'test@xperience.com',
    name: 'Test User'
  });
  
  // Mock MercadoPago
  const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
  fetchMock.mockImplementation((url: string) => {
    if (url.includes('mercadopago')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 'mp-test-123',
          status: 'pending',
          point_of_interaction: {
            transaction_data: {
              qr_code: 'test-pix-qr-code',
              qr_code_base64: 'test-base64-qr'
            }
          },
          date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        })
      } as Response);
    }
    
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    } as Response);
  });
});

Before({ tags: '@wallet' }, async function (this: CustomWorld) {
  // Setup wallet-specific mocks
  this.setAuthenticatedUser({
    sub: 'test-user-123',
    email: 'test@xperience.com',
    name: 'Test User'
  });
  
  this.walletState = {
    address: '0x123456789abcdef',
    balance: '1.5',
    transactions: []
  };
});

Before({ tags: '@slow' }, async function () {
  // Increase timeout for slow tests
  this.setDefaultTimeout(30000);
});

// Error handling hooks
Before({ tags: '@error' }, async function (this: CustomWorld) {
  // Setup error scenarios
  const fetchMock = global.fetch as jest.MockedFunction<typeof fetch>;
  fetchMock.mockRejectedValue(new Error('Network error'));
});

// Mobile-specific hooks
Before({ tags: '@mobile' }, async function (this: CustomWorld) {
  // Mock mobile environment
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 375,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 667,
  });
  
  // Mock touch events
  Object.defineProperty(window, 'ontouchstart', {
    value: {},
  });
});

// Performance testing hooks
Before({ tags: '@performance' }, async function (this: CustomWorld) {
  // Mock performance API
  Object.defineProperty(window, 'performance', {
    value: {
      now: jest.fn(() => Date.now()),
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByType: jest.fn(() => []),
      getEntriesByName: jest.fn(() => []),
    },
  });
});

// Accessibility testing hooks
Before({ tags: '@a11y' }, async function (this: CustomWorld) {
  // Setup accessibility testing environment
  this.uiState.currentPage = 'accessibility-test';
});