import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { PaymentProvider } from '../../../types/payment';

describe('PaymentMethodSelector', () => {
  const mockPrices = {
    pix: 297.00,
    bitcoin: 282.15,
    usdt: 288.09,
    github: 297.00
  };

  const mockOnChange = jest.fn();

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
    expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
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

    expect(screen.getByText('R$ 297.00')).toBeInTheDocument();
    expect(screen.getByText('R$ 282.15')).toBeInTheDocument();
    expect(screen.getByText('R$ 288.09')).toBeInTheDocument();
    expect(screen.getByText('$53 USD')).toBeInTheDocument(); // GitHub price in USD
  });

  it('should highlight selected payment method', () => {
    render(
      <PaymentMethodSelector
        selected="bitcoin"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    const bitcoinOption = screen.getByText('Bitcoin').closest('div');
    expect(bitcoinOption).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  it('should call onChange when payment method is clicked', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    const bitcoinOption = screen.getByText('Bitcoin').closest('div');
    fireEvent.click(bitcoinOption!);

    expect(mockOnChange).toHaveBeenCalledWith('bitcoin');
  });

  it('should display discount badges', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('5% OFF')).toBeInTheDocument(); // Bitcoin
    expect(screen.getByText('3% OFF')).toBeInTheDocument(); // USDT
    expect(screen.getByText('NOVO')).toBeInTheDocument(); // GitHub
  });

  it('should show additional info for selected method', () => {
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

  it('should be disabled when disabled prop is true', () => {
    render(
      <PaymentMethodSelector
        selected="pix"
        onChange={mockOnChange}
        prices={mockPrices}
        disabled={true}
      />
    );

    const pixOption = screen.getByText('PIX').closest('div');
    expect(pixOption).toHaveClass('opacity-50', 'cursor-not-allowed');

    fireEvent.click(pixOption!);
    expect(mockOnChange).not.toHaveBeenCalled();
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
  });

  it('should handle different selected methods correctly', () => {
    const { rerender } = render(
      <PaymentMethodSelector
        selected="github"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('🐙 Patrocínio via GitHub')).toBeInTheDocument();

    rerender(
      <PaymentMethodSelector
        selected="usdt"
        onChange={mockOnChange}
        prices={mockPrices}
      />
    );

    expect(screen.getByText('💎 Stablecoin estável')).toBeInTheDocument();
  });
});
