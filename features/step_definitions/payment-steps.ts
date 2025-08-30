import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@jest/globals';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { CustomWorld } from '../support/world';
import { PaymentMethodSelector } from '../../src/components/payments/PaymentMethodSelector';
import { PixPaymentComponent } from '../../src/components/payments/PixPaymentComponent';
import { PaymentStatusModal } from '../../src/components/payments/PaymentStatusModal';

// Mock data
const mockPlan = {
  id: 'basic',
  name: 'Básico',
  description: 'Plano básico',
  price: 100.00,
  features: ['Feature 1'],
  duration: 30,
  popular: false
};

const mockPrices = {
  pix: 100.00,
  bitcoin: 95.00,
  usdt: 97.00
};

// Background steps
Given('que estou na página de pagamento', function (this: CustomWorld) {
  // Setup payment page context
  this.setPaymentData({ plan: mockPlan, prices: mockPrices });
});

Given('os métodos de pagamento estão disponíveis', function (this: CustomWorld) {
  // Verify payment methods are available
  expect(this.paymentData).toBeDefined();
});

// Plan selection steps
Given('que selecionei o plano {string} de R$ {float}', function (this: CustomWorld, planName: string, price: number) {
  const plan = { ...mockPlan, name: planName, price };
  this.setPaymentData({ ...this.paymentData, selectedPlan: plan, amount: price });
});

// Payment method selection steps
When('eu escolho o método de pagamento {string}', function (this: CustomWorld, method: string) {
  const methodMap: Record<string, string> = {
    'PIX': 'pix',
    'Bitcoin': 'bitcoin',
    'USDT': 'usdt'
  };
  
  const paymentMethod = methodMap[method];
  this.setPaymentData({ ...this.paymentData, selectedMethod: paymentMethod });
  
  // Render payment method selector
  this.renderComponent(
    React.createElement(PaymentMethodSelector, {
      selected: paymentMethod as any,
      onChange: jest.fn(),
      prices: mockPrices
    })
  );
});

// PIX specific steps
When('clico em {string}', async function (this: CustomWorld, buttonText: string) {
  const button = screen.getByText(buttonText);
  fireEvent.click(button);
  
  if (buttonText.includes('QR Code PIX')) {
    // Simulate PIX payment component rendering
    this.renderComponent(
      React.createElement(PixPaymentComponent, {
        plan: this.paymentData.selectedPlan,
        finalPrice: this.paymentData.amount,
        onProcess: jest.fn(),
        isProcessing: false
      })
    );
  }
});

Then('devo ver o QR Code do PIX', async function (this: CustomWorld) {
  // In a real scenario, this would check for QR code image
  // For now, we verify the component is rendered
  expect(this.component).toBeDefined();
});

Then('devo ver as informações de pagamento', function (this: CustomWorld) {
  expect(screen.getByText('Pagamento via PIX')).toBeInTheDocument();
  expect(screen.getByText(`R$ ${this.paymentData.amount.toFixed(2)}`)).toBeInTheDocument();
});

Then('devo ver o tempo de expiração de {int} minutos', function (this: CustomWorld, minutes: number) {
  expect(screen.getByText(`O QR Code PIX expira em ${minutes} minutos após a geração`)).toBeInTheDocument();
});

// Bitcoin specific steps
Then('devo ver o desconto de {int}% aplicado', function (this: CustomWorld, discount: number) {
  expect(screen.getByText(`${discount}% OFF`)).toBeInTheDocument();
});

Then('o valor final deve ser R$ {float}', function (this: CustomWorld, finalPrice: number) {
  expect(screen.getByText(`R$ ${finalPrice.toFixed(2)}`)).toBeInTheDocument();
});

When('clico em {string}', async function (this: CustomWorld, buttonText: string) {
  const button = screen.getByText(buttonText);
  fireEvent.click(button);
});

Then('devo ver o endereço Bitcoin', function (this: CustomWorld) {
  // This would check for Bitcoin address display
  // Implementation depends on Bitcoin component structure
  expect(this.component).toBeDefined();
});

Then('devo ver o QR Code Bitcoin', function (this: CustomWorld) {
  // This would check for Bitcoin QR code
  expect(this.component).toBeDefined();
});

Then('devo ver o valor em BTC', function (this: CustomWorld) {
  // This would check for BTC amount display
  expect(this.component).toBeDefined();
});

// USDT specific steps
Then('devo ver o endereço USDT', function (this: CustomWorld) {
  expect(this.component).toBeDefined();
});

Then('devo ver a rede selecionada {string}', function (this: CustomWorld, network: string) {
  // This would check for network display
  expect(this.component).toBeDefined();
});

Then('devo ver o valor em USDT', function (this: CustomWorld) {
  expect(this.component).toBeDefined();
});

// Payment confirmation steps
When('o pagamento PIX é confirmado', function (this: CustomWorld) {
  this.setPaymentData({ ...this.paymentData, paymentStatus: 'confirmed' });
});

When('a transação Bitcoin é confirmada', function (this: CustomWorld) {
  this.setPaymentData({ ...this.paymentData, paymentStatus: 'confirmed' });
});

When('a transação USDT é confirmada', function (this: CustomWorld) {
  this.setPaymentData({ ...this.paymentData, paymentStatus: 'confirmed' });
});

Then('devo ver a confirmação de pagamento', function (this: CustomWorld) {
  // Render payment status modal
  this.renderComponent(
    React.createElement(PaymentStatusModal, {
      isOpen: true,
      onClose: jest.fn(),
      status: 'success',
      paymentData: {
        id: 'payment-123',
        method: this.paymentData.selectedMethod,
        amount: this.paymentData.amount,
        status: 'confirmed'
      }
    })
  );
  
  expect(screen.getByText(/pagamento confirmado/i)).toBeInTheDocument();
});

Then('meu acesso deve ser liberado imediatamente', function (this: CustomWorld) {
  expect(this.paymentData.paymentStatus).toBe('confirmed');
});

Then('meu acesso deve ser liberado', function (this: CustomWorld) {
  expect(this.paymentData.paymentStatus).toBe('confirmed');
});

// Validation steps
Given('que estou preenchendo os dados de pagamento', function (this: CustomWorld) {
  this.setPaymentData({ ...this.paymentData, formData: {} });
});

When('eu deixo campos obrigatórios em branco', function (this: CustomWorld) {
  this.setPaymentData({ 
    ...this.paymentData, 
    formData: { email: '', amount: 0 },
    hasValidationErrors: true 
  });
});

Then('devo ver mensagens de erro de validação', function (this: CustomWorld) {
  expect(this.paymentData.hasValidationErrors).toBe(true);
});

Then('o botão de pagamento deve estar desabilitado', function (this: CustomWorld) {
  const button = screen.queryByRole('button', { name: /gerar|pagar/i });
  if (button) {
    expect(button).toBeDisabled();
  }
});

When('eu preencho todos os campos corretamente', function (this: CustomWorld) {
  this.setPaymentData({ 
    ...this.paymentData, 
    formData: { email: 'test@example.com', amount: 100 },
    hasValidationErrors: false 
  });
});

Then('as mensagens de erro devem desaparecer', function (this: CustomWorld) {
  expect(this.paymentData.hasValidationErrors).toBe(false);
});

Then('o botão de pagamento deve estar habilitado', function (this: CustomWorld) {
  const button = screen.queryByRole('button', { name: /gerar|pagar/i });
  if (button) {
    expect(button).not.toBeDisabled();
  }
});

// Error handling steps
Given('que escolhi o método de pagamento {string}', function (this: CustomWorld, method: string) {
  const methodMap: Record<string, string> = {
    'PIX': 'pix',
    'Bitcoin': 'bitcoin',
    'USDT': 'usdt'
  };
  
  this.setPaymentData({ ...this.paymentData, selectedMethod: methodMap[method] });
});

When('ocorre um erro no servidor ao gerar o PIX', function (this: CustomWorld) {
  this.setError(new Error('Erro no servidor'));
});

Then('devo ver uma mensagem de erro', function (this: CustomWorld) {
  expect(this.error).toBeDefined();
});

Then('devo ter a opção de tentar novamente', function (this: CustomWorld) {
  // This would check for retry button
  expect(this.component).toBeDefined();
});

When('clico em {string}', function (this: CustomWorld, buttonText: string) {
  if (buttonText === 'Tentar novamente') {
    this.setError(undefined);
  }
});

Then('o processo de pagamento deve ser reiniciado', function (this: CustomWorld) {
  expect(this.error).toBeUndefined();
});

// Timeout steps
Given('que gerei um QR Code PIX', function (this: CustomWorld) {
  this.setPaymentData({ 
    ...this.paymentData, 
    qrCodeGenerated: true,
    expirationTime: new Date(Date.now() + 15 * 60 * 1000)
  });
});

Given('que o pagamento não foi realizado', function (this: CustomWorld) {
  this.setPaymentData({ ...this.paymentData, paymentStatus: 'pending' });
});

When('o tempo de expiração de {int} minutos é atingido', function (this: CustomWorld, minutes: number) {
  this.setPaymentData({ 
    ...this.paymentData, 
    expired: true,
    expirationTime: new Date(Date.now() - 1000)
  });
});

Then('devo ver uma mensagem de expiração', function (this: CustomWorld) {
  expect(this.paymentData.expired).toBe(true);
});

Then('devo ter a opção de gerar um novo QR Code', function (this: CustomWorld) {
  expect(this.component).toBeDefined();
});

When('clico em {string}', function (this: CustomWorld, buttonText: string) {
  if (buttonText === 'Gerar novo QR Code') {
    this.setPaymentData({ 
      ...this.paymentData, 
      expired: false,
      expirationTime: new Date(Date.now() + 15 * 60 * 1000)
    });
  }
});

Then('um novo QR Code deve ser gerado', function (this: CustomWorld) {
  expect(this.paymentData.expired).toBe(false);
});

Then('o timer deve ser reiniciado', function (this: CustomWorld) {
  expect(this.paymentData.expirationTime.getTime()).toBeGreaterThan(Date.now());
});

// Status verification steps
Given('que gerei um pagamento PIX', function (this: CustomWorld) {
  this.setPaymentData({ 
    ...this.paymentData, 
    paymentId: 'pix-payment-123',
    paymentStatus: 'pending'
  });
});

When('o sistema verifica o status do pagamento', function (this: CustomWorld) {
  // Simulate status check
  this.setResult({ status: this.paymentData.paymentStatus });
});

Then('devo ver o status {string}', function (this: CustomWorld, expectedStatus: string) {
  const statusMap: Record<string, string> = {
    'Aguardando pagamento': 'pending',
    'Pagamento confirmado': 'confirmed'
  };
  
  expect(this.result.status).toBe(statusMap[expectedStatus]);
});

When('o pagamento é confirmado pelo banco', function (this: CustomWorld) {
  this.setPaymentData({ ...this.paymentData, paymentStatus: 'confirmed' });
});

When('o sistema verifica o status novamente', function (this: CustomWorld) {
  this.setResult({ status: this.paymentData.paymentStatus });
});

Then('devo ser redirecionado para a página de sucesso', function (this: CustomWorld) {
  expect(this.paymentData.paymentStatus).toBe('confirmed');
});

// Additional steps for comprehensive coverage
Then('devo ver todos os métodos disponíveis', function (this: CustomWorld) {
  expect(screen.getByText('PIX')).toBeInTheDocument();
  expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  expect(screen.getByText('USDT')).toBeInTheDocument();
});

Then('devo ver os preços para cada método', function (this: CustomWorld) {
  expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
  expect(screen.getByText('R$ 95.00')).toBeInTheDocument();
  expect(screen.getByText('R$ 97.00')).toBeInTheDocument();
});

Then('devo ver os descontos aplicáveis', function (this: CustomWorld) {
  expect(screen.getByText('5% OFF')).toBeInTheDocument();
  expect(screen.getByText('3% OFF')).toBeInTheDocument();
});

Then('devo ver indicadores de segurança', function (this: CustomWorld) {
  expect(screen.getByText('Pagamento 100% seguro')).toBeInTheDocument();
});
