import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaymentMethodSelector } from '../../../components/payments/PaymentMethodSelector';
import { PaymentProvider } from '../../../types/payment';

describe('PaymentMethodSelector', () => {
  const mockOnChange = jest.fn();
  const mockPrices = {
    pix: 100.00,
    bitcoin: 95.00,
    usdt: 97.00
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render all payment methods', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('PIX')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('USDT')).toBeInTheDocument();
  });

  it('should display correct prices for each method', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
    expect(screen.getByText('R$ 95.00')).toBeInTheDocument();
    expect(screen.getByText('R$ 97.00')).toBeInTheDocument();
  });

  it('should show discount badges for bitcoin and usdt', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('5% OFF')).toBeInTheDocument();
    expect(screen.getByText('3% OFF')).toBeInTheDocument();
  });

  it('should highlight selected payment method', () => {
    render(
      <PaymentMethodSelector
        selected="bitcoin"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    // Find the parent container of the Bitcoin method
    const bitcoinText = screen.getByText('Bitcoin');
    const bitcoinMethod = bitcoinText.closest('[class*="border-"]');
    expect(bitcoinMethod).toHaveClass('border-blue-500');
    expect(bitcoinMethod).toHaveClass('bg-blue-50');
  });

  it('should call onChange when payment method is clicked', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    const bitcoinMethod = screen.getByText('Bitcoin').closest('[class*="border-"]');
    fireEvent.click(bitcoinMethod!);

    expect(mockOnChange).toHaveBeenCalledWith('bitcoin');
  });

  it('should not call onChange when disabled', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
        disabled={true}
      />
    );

    const bitcoinMethod = screen.getByText('Bitcoin').closest('[class*="border-"]');
    fireEvent.click(bitcoinMethod!);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should show additional information for selected method', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('⚡ Pagamento instantâneo')).toBeInTheDocument();
    expect(screen.getByText('Após o pagamento, seu acesso será liberado imediatamente.')).toBeInTheDocument();
  });

  it('should show bitcoin specific information when bitcoin is selected', () => {
    render(
      <PaymentMethodSelector
        selected="bitcoin"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('🔒 Pagamento descentralizado')).toBeInTheDocument();
    expect(screen.getByText(/Confirmação em até 30 minutos/)).toBeInTheDocument();
  });

  it('should show usdt specific information when usdt is selected', () => {
    render(
      <PaymentMethodSelector
        selected="usdt"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('💎 Stablecoin estável')).toBeInTheDocument();
    expect(screen.getByText(/Valor fixo em dólar/)).toBeInTheDocument();
  });

  it('should display security information', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('Pagamento 100% seguro')).toBeInTheDocument();
    expect(screen.getByText(/Todos os pagamentos são processados de forma segura/)).toBeInTheDocument();
  });

  it('should show features for each payment method', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    // PIX features
    expect(screen.getByText('Confirmação instantânea')).toBeInTheDocument();
    expect(screen.getByText('Disponível 24/7')).toBeInTheDocument();
    expect(screen.getByText('Sem taxas adicionais')).toBeInTheDocument();

    // Bitcoin features
    expect(screen.getByText('Descentralizado')).toBeInTheDocument();
    expect(screen.getByText('Privacidade')).toBeInTheDocument();
    expect(screen.getByText('5% de desconto')).toBeInTheDocument();

    // USDT features
    expect(screen.getByText('Stablecoin')).toBeInTheDocument();
    expect(screen.getByText('Valor estável')).toBeInTheDocument();
    expect(screen.getByText('3% de desconto')).toBeInTheDocument();
  });

  it('should apply disabled styles when disabled', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
        disabled={true}
      />
    );

    const pixMethod = screen.getByText('PIX').closest('[class*="border-"]');
    expect(pixMethod).toHaveClass('opacity-50');
    expect(pixMethod).toHaveClass('cursor-not-allowed');
  });
});