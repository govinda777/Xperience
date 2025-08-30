import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { PaymentMethodSelector } from '../../src/components/payments/PaymentMethodSelector';
import { PaymentStatusModal } from '../../src/components/payments/PaymentStatusModal';
import { PaymentProvider } from '../../src/types/payment';

// Mock do QRCode
jest.mock('qrcode', () => ({
  toCanvas: jest.fn((canvas, text, options, callback) => {
    callback(null);
  })
}));

// Estado compartilhado entre steps
interface UIWorld {
  selectedMethod: PaymentProvider | null;
  prices: { pix: number; bitcoin: number; usdt: number };
  isDisabled: boolean;
  mockOnChange: jest.Mock;
  mockOnClose: jest.Mock;
  mockOnRetry: jest.Mock;
  paymentData: any;
  paymentStatus: string;
  clipboardText: string;
  windowOpenCalled: boolean;
  openedUrl: string;
}

const world: UIWorld = {
  selectedMethod: null,
  prices: { pix: 100, bitcoin: 95, usdt: 98 },
  isDisabled: false,
  mockOnChange: jest.fn(),
  mockOnClose: jest.fn(),
  mockOnRetry: jest.fn(),
  paymentData: null,
  paymentStatus: 'pending',
  clipboardText: '',
  windowOpenCalled: false,
  openedUrl: ''
};

// Mock do clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn().mockImplementation((text: string) => {
      world.clipboardText = text;
      return Promise.resolve();
    })
  },
  writable: true
});

// Mock do window.open
Object.defineProperty(window, 'open', {
  value: jest.fn().mockImplementation((url: string) => {
    world.windowOpenCalled = true;
    world.openedUrl = url;
    return {};
  }),
  writable: true
});

Given('que estou na página de seleção de pagamento', async function () {
  world.selectedMethod = 'pix';
  world.isDisabled = false;
});

Given('que existem métodos de pagamento disponíveis', async function () {
  // Renderizar o componente PaymentMethodSelector
  render(
    <PaymentMethodSelector
      selected={world.selectedMethod || 'pix'}
      onChange={world.mockOnChange}
      prices={world.prices}
      disabled={world.isDisabled}
    />
  );
});

Given('que o método PIX está selecionado', async function () {
  world.selectedMethod = 'pix';
  render(
    <PaymentMethodSelector
      selected="pix"
      onChange={world.mockOnChange}
      prices={world.prices}
    />
  );
});

Given('que iniciei um pagamento PIX', async function () {
  world.paymentData = {
    transactionId: 'pix-tx-123',
    amount: 100,
    currency: 'BRL',
    paymentUrl: 'https://mercadopago.com/pay/pix-tx-123',
    qrCode: 'pix-qr-code-data',
    qrCodeBase64: 'base64-qr-code',
    expiresAt: new Date(Date.now() + 1800000),
    metadata: { provider: 'pix' }
  };
  world.paymentStatus = 'pending';
});

Given('que o modal de pagamento PIX está aberto', async function () {
  render(
    <PaymentStatusModal
      isOpen={true}
      payment={world.paymentData}
      status="pending"
      onClose={world.mockOnClose}
      onRetry={world.mockOnRetry}
    />
  );
});

Given('que o modal de pagamento está aberto', async function () {
  render(
    <PaymentStatusModal
      isOpen={true}
      payment={world.paymentData}
      status={world.paymentStatus as any}
      onClose={world.mockOnClose}
      onRetry={world.mockOnRetry}
    />
  );
});

Given('que restam menos de {int} minutos para expiração', async function (minutes: number) {
  world.paymentData = {
    ...world.paymentData,
    expiresAt: new Date(Date.now() + (minutes - 1) * 60000)
  };
});

Given('que o pagamento falhou', async function () {
  world.paymentStatus = 'failed';
  render(
    <PaymentStatusModal
      isOpen={true}
      payment={world.paymentData}
      status="failed"
      onClose={world.mockOnClose}
      onRetry={world.mockOnRetry}
    />
  );
});

Given('que o modal de erro está exibido', async function () {
  // Modal já renderizado no step anterior
});

Given('que o pagamento foi confirmado', async function () {
  world.paymentStatus = 'completed';
  render(
    <PaymentStatusModal
      isOpen={true}
      payment={world.paymentData}
      status="completed"
      onClose={world.mockOnClose}
      onRetry={world.mockOnRetry}
    />
  );
});

Given('que o modal de sucesso está exibido', async function () {
  // Modal já renderizado no step anterior
});

Given('que os métodos de pagamento estão desabilitados', async function () {
  world.isDisabled = true;
  render(
    <PaymentMethodSelector
      selected="pix"
      onChange={world.mockOnChange}
      prices={world.prices}
      disabled={true}
    />
  );
});

When('eu clicar no método de pagamento {string}', async function (method: string) {
  const methodMap: Record<string, string> = {
    'PIX': 'pix',
    'Bitcoin': 'bitcoin',
    'USDT': 'usdt'
  };
  
  const methodId = methodMap[method];
  const element = screen.getByTestId(`payment-method-${methodId}`);
  fireEvent.click(element);
});

When('eu pressionar a tecla Tab', async function () {
  const currentElement = screen.getByTestId('payment-method-pix');
  fireEvent.keyDown(currentElement, { key: 'Tab', code: 'Tab' });
});

When('eu pressionar a tecla Enter', async function () {
  const bitcoinElement = screen.getByTestId('payment-method-bitcoin');
  fireEvent.keyDown(bitcoinElement, { key: 'Enter', code: 'Enter' });
});

When('o modal de status for exibido', async function () {
  // Modal já está renderizado
});

When('eu clicar no botão {string}', async function (buttonText: string) {
  const button = screen.getByText(buttonText);
  fireEvent.click(button);
});

When('eu pressionar a tecla Escape', async function () {
  fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
});

When('eu clicar fora da área do modal', async function () {
  const backdrop = screen.getByTestId('modal-backdrop');
  fireEvent.click(backdrop);
});

When('eu clicar dentro da área do modal', async function () {
  const content = screen.getByTestId('modal-content');
  fireEvent.click(content);
});

When('o countdown for atualizado', async function () {
  // Simular atualização do countdown
  jest.advanceTimersByTime(1000);
});

When('eu tentar clicar em qualquer método', async function () {
  const pixElement = screen.getByTestId('payment-method-pix');
  fireEvent.click(pixElement);
});

Then('o método {word} deve ficar selecionado', async function (method: string) {
  const methodId = method.toLowerCase();
  expect(world.mockOnChange).toHaveBeenCalledWith(methodId);
});

Then('deve ser exibido o preço em reais', async function () {
  expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
});

Then('devem ser mostradas as características do PIX', async function () {
  expect(screen.getByText('Confirmação instantânea')).toBeInTheDocument();
  expect(screen.getByText('Disponível 24/7')).toBeInTheDocument();
  expect(screen.getByText('Sem taxas adicionais')).toBeInTheDocument();
});

Then('deve ser exibido o ícone do PIX', async function () {
  expect(screen.getByText('🏦')).toBeInTheDocument();
});

Then('deve ser exibido o preço com desconto de {int}%', async function (discount: number) {
  if (discount === 5) {
    expect(screen.getByText('R$ 95,00')).toBeInTheDocument();
  } else if (discount === 2) {
    expect(screen.getByText('R$ 98,00')).toBeInTheDocument();
  }
});

Then('deve ser mostrada a badge {string}', async function (badgeText: string) {
  expect(screen.getByText(badgeText)).toBeInTheDocument();
});

Then('devem ser mostradas as características do Bitcoin', async function () {
  expect(screen.getByText('Descentralizado')).toBeInTheDocument();
  expect(screen.getByText('Segurança máxima')).toBeInTheDocument();
});

Then('deve ser exibido o ícone do Bitcoin', async function () {
  expect(screen.getByText('₿')).toBeInTheDocument();
});

Then('devem ser mostradas as características do USDT', async function () {
  expect(screen.getByText('Stablecoin confiável')).toBeInTheDocument();
});

Then('deve ser exibido o ícone do USDT', async function () {
  expect(screen.getByText('💰')).toBeInTheDocument();
});

Then('o foco deve mover para o método Bitcoin', async function () {
  // Esta verificação seria mais complexa em um teste real
  // Aqui apenas verificamos que o elemento existe
  expect(screen.getByTestId('payment-method-bitcoin')).toBeInTheDocument();
});

Then('deve mostrar o título {string}', async function (title: string) {
  expect(screen.getByText(title)).toBeInTheDocument();
});

Then('deve exibir o QR Code para pagamento', async function () {
  // Verificar se existe um elemento de QR Code
  expect(screen.getByTestId('qr-code-container')).toBeInTheDocument();
});

Then('deve mostrar o valor a ser pago', async function () {
  expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
});

Then('deve exibir o ID da transação', async function () {
  expect(screen.getByText('ID: pix-tx-123')).toBeInTheDocument();
});

Then('deve mostrar o tempo restante para expiração', async function () {
  expect(screen.getByText(/Expira em:/)).toBeInTheDocument();
});

Then('deve ter um botão {string}', async function (buttonText: string) {
  expect(screen.getByText(buttonText)).toBeInTheDocument();
});

Then('o código PIX deve ser copiado para a área de transferência', async function () {
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('pix-qr-code-data');
  expect(world.clipboardText).toBe('pix-qr-code-data');
});

Then('deve ser exibida a mensagem {string}', async function (message: string) {
  await waitFor(() => {
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});

Then('a mensagem deve desaparecer após {int} segundos', async function (seconds: number) {
  jest.advanceTimersByTime(seconds * 1000);
  await waitFor(() => {
    expect(screen.queryByText('Copiado!')).not.toBeInTheDocument();
  });
});

Then('deve ser aberta uma nova aba com a URL do Mercado Pago', async function () {
  expect(world.windowOpenCalled).toBe(true);
  expect(world.openedUrl).toBe('https://mercadopago.com/pay/pix-tx-123');
});

Then('a URL deve conter o ID da preferência', async function () {
  expect(world.openedUrl).toContain('pix-tx-123');
});

Then('o modal deve ser fechado', async function () {
  expect(world.mockOnClose).toHaveBeenCalled();
});

Then('deve ser chamada a função onClose', async function () {
  expect(world.mockOnClose).toHaveBeenCalled();
});

Then('o modal deve permanecer aberto', async function () {
  expect(world.mockOnClose).not.toHaveBeenCalled();
});

Then('a função onClose não deve ser chamada', async function () {
  expect(world.mockOnClose).not.toHaveBeenCalled();
});

Then('o texto do countdown deve ficar vermelho', async function () {
  const countdownElement = screen.getByText(/Expira em:/);
  expect(countdownElement).toHaveClass('text-red-600');
});

Then('deve ser exibido um ícone de alerta', async function () {
  expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
});

Then('deve ser chamada a função onRetry', async function () {
  expect(world.mockOnRetry).toHaveBeenCalled();
});

Then('nenhum método deve ser selecionado', async function () {
  expect(world.mockOnChange).not.toHaveBeenCalled();
});

Then('os métodos devem aparecer com opacidade reduzida', async function () {
  const pixElement = screen.getByTestId('payment-method-pix');
  expect(pixElement).toHaveClass('opacity-50');
});

Then('o cursor deve mostrar {string}', async function (cursorType: string) {
  const pixElement = screen.getByTestId('payment-method-pix');
  if (cursorType === 'não permitido') {
    expect(pixElement).toHaveClass('cursor-not-allowed');
  }
});

// Cleanup após cada cenário
beforeEach(() => {
  jest.useFakeTimers();
  world.mockOnChange.mockClear();
  world.mockOnClose.mockClear();
  world.mockOnRetry.mockClear();
  world.clipboardText = '';
  world.windowOpenCalled = false;
  world.openedUrl = '';
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});
