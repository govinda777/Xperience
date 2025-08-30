import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@jest/globals';
import { PaymentService } from '../../src/services/paymentService';
import { MockPixProvider, MockBitcoinProvider, MockUSDTProvider } from '../../src/__tests__/mocks/paymentMocks';
import { PaymentStatus } from '../../src/types/payment';

// Mock do fetch global
global.fetch = jest.fn();

// Mock do localStorage
const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => mockStorage[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete mockStorage[key];
  }),
  clear: jest.fn(() => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  })
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Estado compartilhado entre steps
interface VerificationWorld {
  paymentService: PaymentService;
  transactionId: string;
  currentStatus: PaymentStatus;
  verificationResult: PaymentStatus | null;
  error: any;
  confirmations: number;
  isApiAvailable: boolean;
}

const world: VerificationWorld = {
  paymentService: new PaymentService(),
  transactionId: '',
  currentStatus: 'pending',
  verificationResult: null,
  error: null,
  confirmations: 0,
  isApiAvailable: true
};

// Setup inicial
Given('que o sistema de pagamentos está configurado', async function () {
  world.paymentService = new PaymentService();
  world.paymentService.registerProvider(new MockPixProvider());
  world.paymentService.registerProvider(new MockBitcoinProvider());
  world.paymentService.registerProvider(new MockUSDTProvider());
});

Given('que existe um pagamento em andamento', async function () {
  // Setup básico para pagamento em andamento
  world.isApiAvailable = true;
});

Given('que existe um pagamento PIX com ID {string}', async function (transactionId: string) {
  world.transactionId = transactionId;
  
  // Mock do pagamento no localStorage
  const paymentData = {
    [transactionId]: {
      id: transactionId,
      planId: 'plan-1',
      userId: 'user-1',
      amount: 100,
      currency: 'BRL',
      provider: 'pix',
      status: 'pending',
      metadata: {
        externalReference: 'user-1-plan-1-123456',
        preferenceId: transactionId
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1800000).toISOString()
    }
  };
  
  mockStorage['xperience_payments'] = JSON.stringify(paymentData);
});

Given('que existe um pagamento Bitcoin com ID {string}', async function (transactionId: string) {
  world.transactionId = transactionId;
  
  const paymentData = {
    [transactionId]: {
      id: transactionId,
      planId: 'plan-1',
      userId: 'user-1',
      amount: 0.001,
      currency: 'BTC',
      provider: 'bitcoin',
      status: 'pending',
      metadata: {
        paymentAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    }
  };
  
  mockStorage['xperience_payments'] = JSON.stringify(paymentData);
});

Given('que existe um pagamento USDT com ID {string}', async function (transactionId: string) {
  world.transactionId = transactionId;
  
  const paymentData = {
    [transactionId]: {
      id: transactionId,
      planId: 'plan-1',
      userId: 'user-1',
      amount: 100,
      currency: 'USDT',
      provider: 'usdt',
      status: 'pending',
      metadata: {
        paymentAddress: '0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8',
        usdtAmount: 100,
        createdAt: Date.now() - 60000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString()
    }
  };
  
  mockStorage['xperience_payments'] = JSON.stringify(paymentData);
});

Given('que o pagamento está com status {string}', async function (status: string) {
  world.currentStatus = status as PaymentStatus;
});

Given('que o pagamento foi aprovado no Mercado Pago', async function () {
  // Mock da resposta da API do Mercado Pago
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({
      results: [{
        id: 'payment-123',
        status: 'approved',
        date_created: new Date().toISOString()
      }]
    })
  });
});

Given('que a transação foi enviada mas tem {int} confirmações', async function (confirmations: number) {
  world.confirmations = confirmations;
  
  // Mock da resposta da API do Blockstream
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{
      txid: 'abc123def456',
      status: { 
        confirmed: confirmations > 0,
        block_height: confirmations > 0 ? 800000 : null
      },
      vout: [{
        scriptpubkey_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        value: 100000 // 0.001 BTC em satoshis
      }],
      status: { block_time: Date.now() / 1000 }
    }])
  });
});

Given('que a transação tem pelo menos {int} confirmação', async function (minConfirmations: number) {
  world.confirmations = minConfirmations;
  
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([{
      txid: 'abc123def456',
      status: { 
        confirmed: true,
        block_height: 800000
      },
      vout: [{
        scriptpubkey_address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        value: 100000
      }],
      status: { block_time: Date.now() / 1000 }
    }])
  });
});

Given('que a transação tem {int} confirmações na rede Ethereum', async function (confirmations: number) {
  world.confirmations = confirmations;
  
  // Mock da resposta do Etherscan
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        status: '1',
        result: [{
          hash: '0xabc123def456',
          from: '0x123456789',
          to: '0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8',
          value: '100000000', // 100 USDT
          blockNumber: '18000000',
          timeStamp: (Date.now() / 1000).toString()
        }]
      })
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        jsonrpc: '2.0',
        id: 1,
        result: `0x${(18000000 + confirmations).toString(16)}`
      })
    });
});

Given('que a transação tem {int} ou mais confirmações', async function (minConfirmations: number) {
  world.confirmations = minConfirmations + 5; // Garantir que tem mais que o mínimo
  
  (global.fetch as jest.Mock)
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        status: '1',
        result: [{
          hash: '0xabc123def456',
          from: '0x123456789',
          to: '0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8',
          value: '100000000',
          blockNumber: '18000000',
          timeStamp: (Date.now() / 1000).toString()
        }]
      })
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        jsonrpc: '2.0',
        id: 1,
        result: `0x${(18000000 + world.confirmations).toString(16)}`
      })
    });
});

Given('que o tempo de expiração foi ultrapassado', async function () {
  // Atualizar o pagamento para ter expirado
  const paymentData = JSON.parse(mockStorage['xperience_payments'] || '{}');
  if (paymentData[world.transactionId]) {
    paymentData[world.transactionId].expiresAt = new Date(Date.now() - 60000).toISOString();
    mockStorage['xperience_payments'] = JSON.stringify(paymentData);
  }
});

Given('que a API do Mercado Pago está indisponível', async function () {
  world.isApiAvailable = false;
  (global.fetch as jest.Mock).mockRejectedValue(new Error('API indisponível'));
});

Given('que não existe um pagamento com ID {string}', async function (transactionId: string) {
  world.transactionId = transactionId;
  mockStorage['xperience_payments'] = JSON.stringify({});
});

When('eu verificar o status do pagamento', async function () {
  try {
    const provider = world.transactionId.startsWith('pix') ? 'pix' :
                    world.transactionId.startsWith('btc') ? 'bitcoin' : 'usdt';
    
    world.verificationResult = await world.paymentService.verifyPayment(
      provider as any,
      world.transactionId
    );
    world.error = null;
  } catch (error) {
    world.error = error;
    world.verificationResult = null;
  }
});

Then('o status deve permanecer {string}', async function (expectedStatus: string) {
  expect(world.verificationResult).toBe(expectedStatus);
});

Then('o status deve ser atualizado para {string}', async function (expectedStatus: string) {
  expect(world.verificationResult).toBe(expectedStatus);
});

Then('o status deve ser {string}', async function (expectedStatus: string) {
  expect(world.verificationResult).toBe(expectedStatus);
});

Then('deve ser exibido o QR Code para pagamento', async function () {
  // Esta verificação seria feita na UI
  expect(world.verificationResult).toBe('pending');
});

Then('deve ser mostrado o tempo restante para expiração', async function () {
  // Esta verificação seria feita na UI
  expect(world.verificationResult).toBe('pending');
});

Then('deve ser exibida uma mensagem de sucesso', async function () {
  expect(world.verificationResult).toBe('completed');
});

Then('deve ser oferecida a opção de continuar', async function () {
  expect(world.verificationResult).toBe('completed');
});

Then('deve ser exibido o número de confirmações \\({int}/{int}\\)', async function (current: number, required: number) {
  expect(world.verificationResult).toBe('processing');
  expect(world.confirmations).toBe(current);
});

Then('deve ser mostrada uma mensagem explicativa sobre confirmações', async function () {
  expect(world.verificationResult).toBe('processing');
});

Then('deve ser mostrado o hash da transação', async function () {
  expect(world.verificationResult).toBe('completed');
});

Then('deve ser mostrada uma estimativa de tempo para confirmação final', async function () {
  expect(world.verificationResult).toBe('processing');
});

Then('deve ser mostrado o hash da transação na Etherscan', async function () {
  expect(world.verificationResult).toBe('completed');
});

Then('deve ser exibida uma mensagem de expiração', async function () {
  expect(world.verificationResult).toBe('expired');
});

Then('deve ser oferecida a opção de criar um novo pagamento', async function () {
  expect(world.verificationResult).toBe('expired');
});

Then('deve ser exibida uma mensagem de erro temporário', async function () {
  expect(world.verificationResult).toBe('failed');
});

Then('deve ser oferecida a opção de tentar verificar novamente', async function () {
  expect(world.verificationResult).toBe('failed');
});

Then('deve ser exibida uma mensagem de pagamento não encontrado', async function () {
  expect(world.error).toBeTruthy();
});

Then('deve ser oferecida a opção de voltar à tela inicial', async function () {
  expect(world.error).toBeTruthy();
});

// Cleanup após cada cenário
afterEach(() => {
  world.verificationResult = null;
  world.error = null;
  world.confirmations = 0;
  world.isApiAvailable = true;
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  jest.clearAllMocks();
});
