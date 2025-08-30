import { PaymentService } from '../paymentService';
import { PaymentProviderInterface, PaymentProvider, PaymentCurrency, PaymentError } from '../../types/payment';

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

// Mock fetch
global.fetch = jest.fn();

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockProvider: PaymentProviderInterface;

  beforeEach(() => {
    paymentService = new PaymentService();
    
    // Mock provider
    mockProvider = {
      id: 'pix' as PaymentProvider,
      name: 'PIX',
      process: jest.fn(),
      verify: jest.fn(),
      cancel: jest.fn(),
      isAvailable: jest.fn(() => true),
      getSupportedCurrencies: jest.fn(() => ['BRL']),
      getEstimatedFee: jest.fn(() => 0)
    };

    // Clear mocks
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Provider Management', () => {
    it('should register a provider', () => {
      paymentService.registerProvider(mockProvider);
      
      const providers = paymentService.getAvailableProviders();
      expect(providers).toHaveLength(1);
      expect(providers[0]).toBe(mockProvider);
    });

    it('should get a specific provider', () => {
      paymentService.registerProvider(mockProvider);
      
      const provider = paymentService.getProvider('pix');
      expect(provider).toBe(mockProvider);
    });

    it('should return undefined for non-existent provider', () => {
      const provider = paymentService.getProvider('bitcoin' as PaymentProvider);
      expect(provider).toBeUndefined();
    });

    it('should get all available providers', () => {
      const provider2: PaymentProviderInterface = {
        ...mockProvider,
        id: 'bitcoin' as PaymentProvider,
        name: 'Bitcoin'
      };

      paymentService.registerProvider(mockProvider);
      paymentService.registerProvider(provider2);
      
      const providers = paymentService.getAvailableProviders();
      expect(providers).toHaveLength(2);
    });
  });

  describe('Payment Processing', () => {
    beforeEach(() => {
      paymentService.registerProvider(mockProvider);
    });

    it('should process payment successfully', async () => {
      const mockResult = {
        success: true,
        transactionId: 'tx-123',
        status: 'pending' as const,
        paymentUrl: 'https://example.com/pay',
        qrCode: 'qr-code-data',
        expiresAt: new Date(Date.now() + 3600000)
      };

      mockProvider.process = jest.fn().mockResolvedValue(mockResult);
      
      const result = await paymentService.processPayment('pix', 100, 'BRL', 'plan-1', 'user-1');
      
      expect(result).toEqual(mockResult);
      expect(mockProvider.process).toHaveBeenCalledWith(100, 'plan-1', 'user-1');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should throw error for non-existent provider', async () => {
      await expect(
        paymentService.processPayment('bitcoin' as PaymentProvider, 100, 'BRL', 'plan-1', 'user-1')
      ).rejects.toThrow(PaymentError);
    });

    it('should handle provider processing errors', async () => {
      mockProvider.process = jest.fn().mockRejectedValue(new Error('Provider error'));
      
      await expect(
        paymentService.processPayment('pix', 100, 'BRL', 'plan-1', 'user-1')
      ).rejects.toThrow(PaymentError);
    });
  });

  describe('Payment Verification', () => {
    beforeEach(() => {
      paymentService.registerProvider(mockProvider);
    });

    it('should verify payment successfully', async () => {
      const mockStatus = 'completed' as const;
      mockProvider.verify = jest.fn().mockResolvedValue(mockStatus);
      
      const status = await paymentService.verifyPayment('pix', 'tx-123');
      
      expect(status).toBe(mockStatus);
      expect(mockProvider.verify).toHaveBeenCalledWith('tx-123');
    });

    it('should throw error for non-existent provider', async () => {
      await expect(
        paymentService.verifyPayment('bitcoin' as PaymentProvider, 'tx-123')
      ).rejects.toThrow(PaymentError);
    });

    it('should handle verification errors', async () => {
      mockProvider.verify = jest.fn().mockRejectedValue(new Error('Verification error'));
      
      await expect(
        paymentService.verifyPayment('pix', 'tx-123')
      ).rejects.toThrow(PaymentError);
    });
  });

  describe('Payment Cancellation', () => {
    beforeEach(() => {
      paymentService.registerProvider(mockProvider);
    });

    it('should cancel payment successfully', async () => {
      mockProvider.cancel = jest.fn().mockResolvedValue(true);
      
      const result = await paymentService.cancelPayment('pix', 'tx-123');
      
      expect(result).toBe(true);
      expect(mockProvider.cancel).toHaveBeenCalledWith('tx-123');
    });

    it('should return false for provider without cancel support', async () => {
      const providerWithoutCancel = { ...mockProvider };
      delete providerWithoutCancel.cancel;
      
      paymentService.registerProvider(providerWithoutCancel);
      
      const result = await paymentService.cancelPayment('pix', 'tx-123');
      expect(result).toBe(false);
    });

    it('should return false for non-existent provider', async () => {
      const result = await paymentService.cancelPayment('bitcoin' as PaymentProvider, 'tx-123');
      expect(result).toBe(false);
    });

    it('should handle cancellation errors gracefully', async () => {
      mockProvider.cancel = jest.fn().mockRejectedValue(new Error('Cancel error'));
      
      const result = await paymentService.cancelPayment('pix', 'tx-123');
      expect(result).toBe(false);
    });
  });

  describe('Currency Conversion', () => {
    it('should return same amount for same currency', async () => {
      const result = await paymentService.convertCurrency(100, 'BRL', 'BRL');
      expect(result).toBe(100);
    });

    it('should convert currency using cached rates', async () => {
      // Mock a cached exchange rate
      const mockConversion = {
        from: 'BRL' as PaymentCurrency,
        to: 'BTC' as PaymentCurrency,
        rate: 0.000020,
        timestamp: new Date()
      };

      // Access private method through any
      (paymentService as any).exchangeRates.set('BRL_BTC', mockConversion);
      
      const result = await paymentService.convertCurrency(100, 'BRL', 'BTC');
      expect(result).toBe(0.002); // 100 * 0.000020
    });

    it('should fetch new rates when not cached', async () => {
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          bitcoin: { brl: 300000 }
        })
      } as Response);

      const result = await paymentService.convertCurrency(100, 'BRL', 'BTC');
      
      expect(mockFetch).toHaveBeenCalled();
      expect(result).toBeCloseTo(100 / 300000);
    });

    it('should handle API errors gracefully', async () => {
      // Clear existing exchange rates to force API call
      paymentService.exchangeRates.clear();
      
      const mockFetch = fetch as jest.MockedFunction<typeof fetch>;
      mockFetch.mockRejectedValue(new Error('API Error'));

      await expect(
        paymentService.convertCurrency(100, 'BRL', 'BTC')
      ).rejects.toThrow();
    });
  });

  describe('Payment History', () => {
    it('should get payment history for user', async () => {
      const mockPayments = {
        'tx-1': {
          id: 'tx-1',
          userId: 'user-1',
          planId: 'plan-1',
          amount: 100,
          currency: 'BRL' as PaymentCurrency,
          provider: 'pix' as PaymentProvider,
          status: 'completed' as const,
          metadata: {},
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01')
        },
        'tx-2': {
          id: 'tx-2',
          userId: 'user-2',
          planId: 'plan-2',
          amount: 200,
          currency: 'BRL' as PaymentCurrency,
          provider: 'pix' as PaymentProvider,
          status: 'pending' as const,
          metadata: {},
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02')
        }
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPayments));
      
      const history = await paymentService.getPaymentHistory('user-1');
      
      expect(history).toHaveLength(1);
      expect(history[0].id).toBe('tx-1');
      expect(history[0].userId).toBe('user-1');
    });

    it('should return empty array when no payments found', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      const history = await paymentService.getPaymentHistory('user-1');
      expect(history).toEqual([]);
    });

    it('should handle localStorage errors gracefully', async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      const history = await paymentService.getPaymentHistory('user-1');
      expect(history).toEqual([]);
    });
  });

  describe('Get Payment', () => {
    it('should get specific payment', async () => {
      const mockPayment = {
        id: 'tx-1',
        userId: 'user-1',
        planId: 'plan-1',
        amount: 100,
        currency: 'BRL' as PaymentCurrency,
        provider: 'pix' as PaymentProvider,
        status: 'completed' as const,
        metadata: {},
        createdAt: '2025-08-30T17:56:00.139Z',
        updatedAt: '2025-08-30T17:56:00.140Z'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({ 'tx-1': mockPayment }));
      
      const payment = await paymentService.getPayment('tx-1');
      expect(payment).toEqual(mockPayment);
    });

    it('should return null for non-existent payment', async () => {
      localStorageMock.getItem.mockReturnValue('{}');
      
      const payment = await paymentService.getPayment('tx-1');
      expect(payment).toBeNull();
    });
  });

  describe('Exchange Rate Management', () => {
    it('should detect expired exchange rates', () => {
      const expiredConversion = {
        from: 'BRL' as PaymentCurrency,
        to: 'BTC' as PaymentCurrency,
        rate: 0.000020,
        timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      };

      const isExpired = (paymentService as any).isExchangeRateExpired(expiredConversion);
      expect(isExpired).toBe(true);
    });

    it('should detect fresh exchange rates', () => {
      const freshConversion = {
        from: 'BRL' as PaymentCurrency,
        to: 'BTC' as PaymentCurrency,
        rate: 0.000020,
        timestamp: new Date() // Now
      };

      const isExpired = (paymentService as any).isExchangeRateExpired(freshConversion);
      expect(isExpired).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should create PaymentError with correct properties', () => {
      const error = new PaymentError({
        code: 'TEST_ERROR',
        message: 'Test error message',
        provider: 'pix',
        transactionId: 'tx-123'
      });

      expect(error.code).toBe('TEST_ERROR');
      expect(error.message).toBe('Test error message');
      expect(error.provider).toBe('pix');
      expect(error.transactionId).toBe('tx-123');
    });
  });
});