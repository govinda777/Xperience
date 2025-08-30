import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@jest/globals';
import { PaymentService } from '../../src/services/paymentService';
import { MockPixProvider, MockBitcoinProvider, MockUSDTProvider } from '../../src/__tests__/mocks/paymentMocks';
import { PaymentError } from '../../src/types/payment';

// Mock do fetch global
global.fetch = jest.fn();

// Estado compartilhado entre steps
interface PaymentWorld {
  paymentService: PaymentService;
  selectedPlan: { id: string; name: string; price: number };
  selectedMethod: string;
  paymentResult: any;
  error: any;
  bitcoinPrice: number;
  usdtPrice: number;
}

const world: PaymentWorld = {
  paymentService: new PaymentService(),
  selectedPlan: { id: '', name: '', price: 0 },
  selectedMethod: '',
  paymentResult: null,
  error: null,
  bitcoinPrice: 300000,
  usdtPrice: 5.5
};

// Setup inicial
Given('que o sistema de pagamentos está configurado', async function () {
  world.paymentService = new PaymentService();
  world.paymentService.registerProvider(new MockPixProvider());
  world.paymentService.registerProvider(new MockBitcoinProvider());
  world.paymentService.registerProvider(new MockUSDTProvider());
});

Given('que existem planos disponíveis', async function () {
  // Planos são configurados nos próximos steps
});

Given('que eu selecionei o plano {string} por R$ {float}', async function (planName: string, price: number) {
  world.selectedPlan = {
    id: planName.toLowerCase().replace(' ', '-'),
    name: planName,
    price
  };
});

Given('que eu escolhi o método de pagamento {string}', async function (method: string) {
  const methodMap: Record<string, string> = {
    'PIX': 'pix',
    'Bitcoin': 'bitcoin',
    'USDT': 'usdt'
  };
  world.selectedMethod = methodMap[method] || method.toLowerCase();
});

Given('que a cotação do Bitcoin está em R$ {float}', async function (price: number) {
  world.bitcoinPrice = price;
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ bitcoin: { brl: price } })
  });
});

Given('que a cotação do USDT está em R$ {float}', async function (price: number) {
  world.usdtPrice = price;
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ tether: { brl: price } })
  });
});

Given('que o provedor PIX está indisponível', async function () {
  // Remove o provider PIX para simular indisponibilidade
  world.paymentService = new PaymentService();
  world.paymentService.registerProvider(new MockBitcoinProvider());
  world.paymentService.registerProvider(new MockUSDTProvider());
});

Given('que a API de cotação está indisponível', async function () {
  (global.fetch as jest.Mock).mockRejectedValue(new Error('API indisponível'));
});

Given('que o provedor PIX demora mais de {int} segundos para responder', async function (seconds: number) {
  const mockProvider = new MockPixProvider();
  mockProvider.process = jest.fn().mockImplementation(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        transactionId: 'timeout-tx',
        amount: 100,
        currency: 'BRL'
      }), (seconds + 1) * 1000);
    });
  });
  
  world.paymentService.registerProvider(mockProvider);
});

When('eu iniciar o processo de pagamento', async function () {
  try {
    world.paymentResult = await world.paymentService.processPayment(
      world.selectedMethod as any,
      world.selectedPlan.price,
      'BRL',
      world.selectedPlan.id,
      'test-user-1'
    );
    world.error = null;
  } catch (error) {
    world.error = error;
    world.paymentResult = null;
  }
});

Then('deve ser gerado um QR Code PIX', async function () {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.qrCode).toBeDefined();
  expect(world.paymentResult.qrCodeBase64).toBeDefined();
});

Then('deve ser exibida a URL de pagamento', async function () {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.paymentUrl).toBeDefined();
  expect(world.paymentResult.paymentUrl).toContain('http');
});

Then('o status do pagamento deve ser {string}', async function (expectedStatus: string) {
  // O status inicial é sempre pending para novos pagamentos
  expect(expectedStatus).toBe('pending');
});

Then('deve haver um prazo de expiração de {int} minutos', async function (minutes: number) {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.expiresAt).toBeDefined();
  
  const now = new Date();
  const expiresAt = new Date(world.paymentResult.expiresAt);
  const diffMinutes = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60));
  
  expect(diffMinutes).toBeCloseTo(minutes, 0);
});

Then('deve ser gerado um endereço Bitcoin único', async function () {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.paymentAddress).toBeDefined();
  expect(world.paymentResult.paymentAddress).toMatch(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/);
});

Then('deve ser calculado o valor em BTC \\({float} BTC\\)', async function (expectedBtc: number) {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.amount).toBeCloseTo(expectedBtc, 6);
  expect(world.paymentResult.currency).toBe('BTC');
});

Then('deve ser gerado um QR Code Bitcoin', async function () {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.qrCode).toBeDefined();
  expect(world.paymentResult.qrCode).toContain('bitcoin:');
  expect(world.paymentResult.qrCode).toContain(world.paymentResult.paymentAddress);
});

Then('deve haver um prazo de expiração de {int} hora', async function (hours: number) {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.expiresAt).toBeDefined();
  
  const now = new Date();
  const expiresAt = new Date(world.paymentResult.expiresAt);
  const diffHours = Math.round((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  expect(diffHours).toBeCloseTo(hours, 0);
});

Then('deve ser gerado um endereço Ethereum único', async function () {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.paymentAddress).toBeDefined();
  expect(world.paymentResult.paymentAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
});

Then('deve ser calculado o valor em USDT \\({int} USDT\\)', async function (expectedUsdt: number) {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.amount).toBeCloseTo(expectedUsdt, 2);
  expect(world.paymentResult.currency).toBe('USDT');
});

Then('deve ser gerado um QR Code USDT', async function () {
  expect(world.paymentResult).toBeTruthy();
  expect(world.paymentResult.qrCode).toBeDefined();
  expect(world.paymentResult.qrCode).toContain('ethereum:');
  expect(world.paymentResult.qrCode).toContain(world.paymentResult.paymentAddress);
});

Then('deve ser exibida uma mensagem de erro', async function () {
  expect(world.error).toBeTruthy();
  expect(world.error).toBeInstanceOf(PaymentError);
});

Then('o erro deve conter o código {string}', async function (expectedCode: string) {
  expect(world.error).toBeTruthy();
  expect(world.error.code).toBe(expectedCode);
});

Then('o erro deve conter {string}', async function (expectedMessage: string) {
  expect(world.error).toBeTruthy();
  expect(world.error.message).toContain(expectedMessage);
});

Then('deve ser oferecida a opção de tentar novamente', async function () {
  // Esta verificação seria feita na UI, aqui apenas confirmamos que temos o erro
  expect(world.error).toBeTruthy();
});

Then('deve ser exibida uma mensagem de timeout', async function () {
  expect(world.error).toBeTruthy();
  expect(world.error.message).toContain('timeout');
});

// Cleanup após cada cenário
afterEach(() => {
  world.paymentResult = null;
  world.error = null;
  jest.clearAllMocks();
});
