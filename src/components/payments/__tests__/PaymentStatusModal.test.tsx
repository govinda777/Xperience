import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PaymentStatusModal } from '../PaymentStatusModal';
import { PaymentStatus } from '../../../types/payment';

// Mock do QRCode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqrcode')
}));

describe('PaymentStatusModal', () => {
  const mockOnClose = jest.fn();
  const mockOnRetry = jest.fn();
  const mockOnCancel = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    status: 'pending' as PaymentStatus,
    paymentData: {
      transactionId: 'test-123',
      amount: 297.00,
      currency: 'BRL' as const,
      provider: 'pix' as const,
      qrCode: 'pix-qr-code-data',
      pixKey: 'test@pix.com',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    },
    onRetry: mockOnRetry,
    onCancel: mockOnCancel
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pending payment modal', async () => {
    render(<PaymentStatusModal {...defaultProps} />);

    expect(screen.getByText('Aguardando Pagamento')).toBeInTheDocument();
    expect(screen.getByText('R$ 297,00')).toBeInTheDocument();
    expect(screen.getByText('PIX')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByRole('img', { name: /qr code/i })).toBeInTheDocument();
    });
  });

  it('should render success payment modal', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        status="completed"
      />
    );

    expect(screen.getByText('Pagamento Confirmado!')).toBeInTheDocument();
    expect(screen.getByText('Seu pagamento foi processado com sucesso.')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });

  it('should render failed payment modal', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        status="failed"
        error="Pagamento rejeitado pelo banco"
      />
    );

    expect(screen.getByText('Pagamento Falhou')).toBeInTheDocument();
    expect(screen.getByText('Pagamento rejeitado pelo banco')).toBeInTheDocument();
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
  });

  it('should render expired payment modal', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        status="expired"
      />
    );

    expect(screen.getByText('Pagamento Expirado')).toBeInTheDocument();
    expect(screen.getByText('O tempo limite para pagamento foi excedido.')).toBeInTheDocument();
    expect(screen.getByText('Gerar Novo Pagamento')).toBeInTheDocument();
  });

  it('should render cancelled payment modal', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        status="cancelled"
      />
    );

    expect(screen.getByText('Pagamento Cancelado')).toBeInTheDocument();
    expect(screen.getByText('O pagamento foi cancelado.')).toBeInTheDocument();
    expect(screen.getByText('Fechar')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<PaymentStatusModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /fechar/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onRetry when retry button is clicked', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        status="failed"
      />
    );

    const retryButton = screen.getByText('Tentar Novamente');
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<PaymentStatusModal {...defaultProps} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should display countdown timer for pending payments', () => {
    render(<PaymentStatusModal {...defaultProps} />);

    expect(screen.getByText(/Expira em:/)).toBeInTheDocument();
    expect(screen.getByText(/29:/)).toBeInTheDocument(); // Should show minutes remaining
  });

  it('should display PIX key for PIX payments', () => {
    render(<PaymentStatusModal {...defaultProps} />);

    expect(screen.getByText('Chave PIX:')).toBeInTheDocument();
    expect(screen.getByText('test@pix.com')).toBeInTheDocument();
  });

  it('should display Bitcoin address for Bitcoin payments', () => {
    const bitcoinProps = {
      ...defaultProps,
      paymentData: {
        ...defaultProps.paymentData,
        provider: 'bitcoin' as const,
        bitcoinAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amount: 0.0045
      }
    };

    render(<PaymentStatusModal {...bitcoinProps} />);

    expect(screen.getByText('Endereço Bitcoin:')).toBeInTheDocument();
    expect(screen.getByText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh')).toBeInTheDocument();
  });

  it('should display USDT address for USDT payments', () => {
    const usdtProps = {
      ...defaultProps,
      paymentData: {
        ...defaultProps.paymentData,
        provider: 'usdt' as const,
        usdtAddress: '0x742d35Cc6634C0532925a3b8D4C9db4C0532925a',
        amount: 53.50
      }
    };

    render(<PaymentStatusModal {...usdtProps} />);

    expect(screen.getByText('Endereço USDT:')).toBeInTheDocument();
    expect(screen.getByText('0x742d35Cc6634C0532925a3b8D4C9db4C0532925a')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        isOpen={false}
      />
    );

    expect(screen.queryByText('Aguardando Pagamento')).not.toBeInTheDocument();
  });

  it('should copy payment data to clipboard', async () => {
    // Mock clipboard API
    const mockWriteText = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<PaymentStatusModal {...defaultProps} />);

    const copyButton = screen.getByRole('button', { name: /copiar/i });
    fireEvent.click(copyButton);

    expect(mockWriteText).toHaveBeenCalledWith('test@pix.com');
  });

  it('should handle processing status', () => {
    render(
      <PaymentStatusModal
        {...defaultProps}
        status="processing"
      />
    );

    expect(screen.getByText('Processando Pagamento')).toBeInTheDocument();
    expect(screen.getByText('Aguarde enquanto confirmamos seu pagamento...')).toBeInTheDocument();
  });

  it('should show loading state when generating QR code', () => {
    render(<PaymentStatusModal {...defaultProps} />);

    // Initially should show loading
    expect(screen.getByText('Gerando QR Code...')).toBeInTheDocument();
  });

  it('should display correct currency formatting', () => {
    const bitcoinProps = {
      ...defaultProps,
      paymentData: {
        ...defaultProps.paymentData,
        provider: 'bitcoin' as const,
        currency: 'BTC' as const,
        amount: 0.0045
      }
    };

    render(<PaymentStatusModal {...bitcoinProps} />);

    expect(screen.getByText('₿ 0.0045')).toBeInTheDocument();
  });
});
