import { PixPaymentProvider } from '../pixPaymentProvider';
import { PaymentError } from '../../../types/payment';

// Mock do MercadoPago
jest.mock('mercadopago', () => ({
  configure: jest.fn(),
  payment: {
    create: jest.fn(),
    get: jest.fn(),
    cancel: jest.fn()
  },
  preferences: {
    create: jest.fn()
  }
}));

// Mock do QRCode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockqrcode')
}));

import mercadopago from 'mercadopago';

describe('PixPaymentProvider', () => {
  let provider: PixPaymentProvider;

  beforeEach(() => {
    provider = new PixPaymentProvider();
    jest.clearAllMocks();
  });

  describe('Basic Properties', () => {
    it('should have correct id and name', () => {
      expect(provider.id).toBe('pix');
      expect(provider.name).toBe('PIX');
    });

    it('should be available', () => {
      expect(provider.isAvailable()).toBe(true);
    });

    it('should support BRL currency', () => {
      const currencies = provider.getSupportedCurrencies();
      expect(currencies).toContain('BRL');
    });

    it('should have instant confirmation time', () => {
      expect(provider.getEstimatedConfirmationTime()).toBe(0);
    });

    it('should have no transaction fee', () => {
      expect(provider.getTransactionFee(100)).toBe(0);
    });
  });

  describe('Payment Processing', () => {
    it('should process payment successfully', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'pending',
          point_of_interaction: {
            transaction_data: {
              qr_code: 'pix-qr-code-data',
              qr_code_base64: 'base64-qr-code'
            }
          },
          date_of_expiration: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        }
      };

      (mercadopago.payment.create as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const result = await provider.process(297.00, 'plan-1', 'user-123');

      expect(result.transactionId).toBe('mp-123');
      expect(result.status).toBe('pending');
      expect(result.qrCode).toBe('pix-qr-code-data');
      expect(result.expiresAt).toBeInstanceOf(Date);
      expect(mercadopago.payment.create).toHaveBeenCalledWith({
        transaction_amount: 297.00,
        description: 'Xperience - Programa de Mentoria - plan-1',
        payment_method_id: 'pix',
        payer: {
          email: 'user-123@xperience.com',
          identification: {
            type: 'CPF',
            number: '00000000000'
          }
        },
        notification_url: expect.stringContaining('/webhook/mercadopago'),
        external_reference: expect.stringContaining('user-123')
      });
    });

    it('should handle MercadoPago API errors', async () => {
      (mercadopago.payment.create as jest.Mock).mockRejectedValue(
        new Error('MercadoPago API Error')
      );

      await expect(
        provider.process(297.00, 'plan-1', 'user-123')
      ).rejects.toThrow(PaymentError);
    });

    it('should handle missing QR code in response', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'pending',
          point_of_interaction: {
            transaction_data: {}
          }
        }
      };

      (mercadopago.payment.create as jest.Mock).mockResolvedValue(mockPaymentResponse);

      await expect(
        provider.process(297.00, 'plan-1', 'user-123')
      ).rejects.toThrow(PaymentError);
    });

    it('should generate external reference correctly', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'pending',
          point_of_interaction: {
            transaction_data: {
              qr_code: 'pix-qr-code-data'
            }
          }
        }
      };

      (mercadopago.payment.create as jest.Mock).mockResolvedValue(mockPaymentResponse);

      await provider.process(297.00, 'plan-1', 'user-123');

      const createCall = (mercadopago.payment.create as jest.Mock).mock.calls[0][0];
      expect(createCall.external_reference).toMatch(/^xperience-user-123-\d+$/);
    });
  });

  describe('Payment Verification', () => {
    it('should verify completed payment', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'approved',
          status_detail: 'accredited'
        }
      };

      (mercadopago.payment.get as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const status = await provider.verify('mp-123');

      expect(status).toBe('completed');
      expect(mercadopago.payment.get).toHaveBeenCalledWith('mp-123');
    });

    it('should verify pending payment', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'pending',
          status_detail: 'pending_waiting_payment'
        }
      };

      (mercadopago.payment.get as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const status = await provider.verify('mp-123');

      expect(status).toBe('pending');
    });

    it('should verify failed payment', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'rejected',
          status_detail: 'cc_rejected_other_reason'
        }
      };

      (mercadopago.payment.get as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const status = await provider.verify('mp-123');

      expect(status).toBe('failed');
    });

    it('should verify cancelled payment', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'cancelled'
        }
      };

      (mercadopago.payment.get as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const status = await provider.verify('mp-123');

      expect(status).toBe('cancelled');
    });

    it('should handle verification API errors', async () => {
      (mercadopago.payment.get as jest.Mock).mockRejectedValue(
        new Error('MercadoPago API Error')
      );

      await expect(
        provider.verify('mp-123')
      ).rejects.toThrow(PaymentError);
    });

    it('should handle unknown payment status', async () => {
      const mockPaymentResponse = {
        body: {
          id: 'mp-123',
          status: 'unknown_status'
        }
      };

      (mercadopago.payment.get as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const status = await provider.verify('mp-123');

      expect(status).toBe('pending');
    });
  });

  describe('Payment Cancellation', () => {
    it('should cancel payment successfully', async () => {
      const mockCancelResponse = {
        body: {
          id: 'mp-123',
          status: 'cancelled'
        }
      };

      (mercadopago.payment.cancel as jest.Mock).mockResolvedValue(mockCancelResponse);

      const result = await provider.cancel!('mp-123');

      expect(result).toBe(true);
      expect(mercadopago.payment.cancel).toHaveBeenCalledWith('mp-123');
    });

    it('should handle cancellation API errors', async () => {
      (mercadopago.payment.cancel as jest.Mock).mockRejectedValue(
        new Error('MercadoPago API Error')
      );

      const result = await provider.cancel!('mp-123');

      expect(result).toBe(false);
    });

    it('should handle unsuccessful cancellation', async () => {
      const mockCancelResponse = {
        body: {
          id: 'mp-123',
          status: 'approved' // Still approved, cancellation failed
        }
      };

      (mercadopago.payment.cancel as jest.Mock).mockResolvedValue(mockCancelResponse);

      const result = await provider.cancel!('mp-123');

      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should throw PaymentError with correct details', async () => {
      const mpError = {
        message: 'Invalid payment data',
        status: 400,
        response: {
          data: {
            message: 'Bad request'
          }
        }
      };

      (mercadopago.payment.create as jest.Mock).mockRejectedValue(mpError);

      try {
        await provider.process(297.00, 'plan-1', 'user-123');
      } catch (error) {
        expect(error).toBeInstanceOf(PaymentError);
        expect(error.code).toBe('PIX_PROCESSING_ERROR');
        expect(error.provider).toBe('pix');
        expect(error.details).toEqual({ originalError: mpError });
      }
    });

    it('should handle network errors', async () => {
      (mercadopago.payment.create as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      await expect(
        provider.process(297.00, 'plan-1', 'user-123')
      ).rejects.toThrow(PaymentError);
    });
  });

  describe('Configuration', () => {
    it('should configure MercadoPago on initialization', () => {
      new PixPaymentProvider();

      expect(mercadopago.configure).toHaveBeenCalledWith({
        access_token: expect.any(String)
      });
    });

    it('should use environment variable for access token', () => {
      const originalEnv = process.env.MERCADOPAGO_ACCESS_TOKEN;
      process.env.MERCADOPAGO_ACCESS_TOKEN = 'test-token';

      new PixPaymentProvider();

      expect(mercadopago.configure).toHaveBeenCalledWith({
        access_token: 'test-token'
      });

      process.env.MERCADOPAGO_ACCESS_TOKEN = originalEnv;
    });
  });
});
