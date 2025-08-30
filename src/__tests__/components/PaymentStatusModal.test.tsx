import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaymentStatusModal } from '../../components/payments/PaymentStatusModal';
import { PaymentStatus } from '../../types/payment';

// Mock do QRCode
jest.mock('qrcode', () => ({
  toCanvas: jest.fn((canvas, text, options, callback) => {
    callback(null);
  })
}));

describe('PaymentStatusModal', () => {
  const mockPayment = {
    transactionId: 'tx-123',
    amount: 100,
    currency: 'BRL' as const,
    paymentUrl: 'https://example.com/pay',
    qrCode: 'pix-qr-code-data',
    qrCodeBase64: 'base64-qr-code',
    expiresAt: new Date(Date.now() + 1800000), // 30 minutos
    metadata: {
      provider: 'pix'
    }
  };

  const mockOnClose = jest.fn();
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render pending payment status', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Aguardando Pagamento')).toBeInTheDocument();
    expect(screen.getByText('Escaneie o QR Code ou clique no botão abaixo para pagar')).toBeInTheDocument();
    expect(screen.getByText('Pagar com PIX')).toBeInTheDocument();
  });

  test('should render processing payment status', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="processing"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Processando Pagamento')).toBeInTheDocument();
    expect(screen.getByText('Seu pagamento está sendo processado. Aguarde a confirmação.')).toBeInTheDocument();
  });

  test('should render completed payment status', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="completed"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Pagamento Confirmado!')).toBeInTheDocument();
    expect(screen.getByText('Seu pagamento foi processado com sucesso.')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });

  test('should render failed payment status', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="failed"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Pagamento Falhou')).toBeInTheDocument();
    expect(screen.getByText('Houve um problema com seu pagamento. Tente novamente.')).toBeInTheDocument();
    expect(screen.getByText('Tentar Novamente')).toBeInTheDocument();
  });

  test('should render expired payment status', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="expired"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Pagamento Expirado')).toBeInTheDocument();
    expect(screen.getByText('O tempo para pagamento expirou. Inicie um novo pagamento.')).toBeInTheDocument();
    expect(screen.getByText('Novo Pagamento')).toBeInTheDocument();
  });

  test('should render cancelled payment status', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="cancelled"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Pagamento Cancelado')).toBeInTheDocument();
    expect(screen.getByText('O pagamento foi cancelado.')).toBeInTheDocument();
    expect(screen.getByText('Novo Pagamento')).toBeInTheDocument();
  });

  test('should display payment amount and currency', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
  });

  test('should display transaction ID', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('ID: tx-123')).toBeInTheDocument();
  });

  test('should show countdown timer when payment has expiration', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText(/Expira em:/)).toBeInTheDocument();
    expect(screen.getByText(/29:5\d/)).toBeInTheDocument(); // 29 minutos e alguns segundos
  });

  test('should update countdown timer', async () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    // Avançar 1 minuto
    jest.advanceTimersByTime(60000);

    await waitFor(() => {
      expect(screen.getByText(/28:5\d/)).toBeInTheDocument();
    });
  });

  test('should call onClose when close button is clicked', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="completed"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const closeButton = screen.getByText('Continuar');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should call onRetry when retry button is clicked', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="failed"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByText('Tentar Novamente');
    fireEvent.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalled();
  });

  test('should open payment URL when pay button is clicked', () => {
    // Mock window.open
    const mockOpen = jest.fn();
    Object.defineProperty(window, 'open', {
      value: mockOpen,
      writable: true
    });

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const payButton = screen.getByText('Pagar com PIX');
    fireEvent.click(payButton);

    expect(mockOpen).toHaveBeenCalledWith('https://example.com/pay', '_blank');
  });

  test('should copy QR code to clipboard', async () => {
    // Mock clipboard API
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true
    });

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const copyButton = screen.getByText('Copiar Código');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('pix-qr-code-data');
    });

    expect(screen.getByText('Copiado!')).toBeInTheDocument();
  });

  test('should handle clipboard copy error', async () => {
    // Mock clipboard API with error
    const mockWriteText = jest.fn().mockRejectedValue(new Error('Clipboard error'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true
    });

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const copyButton = screen.getByText('Copiar Código');
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByText('Erro ao copiar')).toBeInTheDocument();
    });
  });

  test('should not render when isOpen is false', () => {
    render(
      <PaymentStatusModal
        isOpen={false}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.queryByText('Aguardando Pagamento')).not.toBeInTheDocument();
  });

  test('should handle missing payment data gracefully', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={null}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Aguardando Pagamento')).toBeInTheDocument();
    expect(screen.queryByText('R$')).not.toBeInTheDocument();
  });

  test('should show different icons for each status', () => {
    const statuses: PaymentStatus[] = ['pending', 'processing', 'completed', 'failed', 'expired', 'cancelled'];
    
    statuses.forEach(status => {
      const { unmount } = render(
        <PaymentStatusModal
          isOpen={true}
          payment={mockPayment}
          status={status}
          onClose={mockOnClose}
          onRetry={mockOnRetry}
        />
      );

      // Verificar se o ícone específico está presente
      const iconElement = screen.getByTestId(`status-icon-${status}`);
      expect(iconElement).toBeInTheDocument();

      unmount();
    });
  });

  test('should handle Bitcoin payment correctly', () => {
    const bitcoinPayment = {
      ...mockPayment,
      currency: 'BTC' as const,
      amount: 0.001,
      paymentAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      metadata: {
        provider: 'bitcoin'
      }
    };

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={bitcoinPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('₿ 0,001')).toBeInTheDocument();
    expect(screen.getByText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBeInTheDocument();
  });

  test('should handle USDT payment correctly', () => {
    const usdtPayment = {
      ...mockPayment,
      currency: 'USDT' as const,
      amount: 18.5,
      paymentAddress: '0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8',
      metadata: {
        provider: 'usdt'
      }
    };

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={usdtPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('$ 18,50')).toBeInTheDocument();
    expect(screen.getByText('0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8')).toBeInTheDocument();
  });

  test('should show loading state for QR code', () => {
    const paymentWithoutQR = {
      ...mockPayment,
      qrCodeBase64: undefined
    };

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={paymentWithoutQR}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText('Gerando QR Code...')).toBeInTheDocument();
  });

  test('should handle modal close on escape key', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should handle modal close on backdrop click', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('should not close modal on content click', () => {
    render(
      <PaymentStatusModal
        isOpen={true}
        payment={mockPayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    const content = screen.getByTestId('modal-content');
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('should show expiration warning when time is running out', () => {
    const soonToExpirePayment = {
      ...mockPayment,
      expiresAt: new Date(Date.now() + 300000) // 5 minutos
    };

    render(
      <PaymentStatusModal
        isOpen={true}
        payment={soonToExpirePayment}
        status="pending"
        onClose={mockOnClose}
        onRetry={mockOnRetry}
      />
    );

    expect(screen.getByText(/Expira em:/)).toBeInTheDocument();
    const timerElement = screen.getByText(/04:5\d/);
    expect(timerElement).toHaveClass('text-red-600'); // Warning color
  });
});
