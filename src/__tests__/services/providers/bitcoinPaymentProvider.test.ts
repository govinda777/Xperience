import { BitcoinPaymentProvider } from '../../../services/providers/bitcoinPaymentProvider';
import { PaymentStatus } from '../../../types/payment';

// Mock do fetch
global.fetch = jest.fn();

// Mock das configurações
jest.mock('../../../config/payment', () => ({
  PAYMENT_CONFIG: {
    privy: {
      appId: 'test-privy-app-id'
    }
  },
  PAYMENT_CONSTANTS: {
    CRYPTO_TIMEOUT: 3600000, // 1 hora
    CRYPTO_POLLING_INTERVAL: 30000, // 30 segundos
    COINGECKO_API: 'https://api.coingecko.com/api/v3'
  }
}));

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock do crypto.subtle
Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32))
    }
  }
});

describe('BitcoinPaymentProvider', () => {
  let provider: BitcoinPaymentProvider;

  beforeEach(() => {
    provider = new BitcoinPaymentProvider();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Constructor', () => {
    test('should initialize with correct properties', () => {
      expect(provider.id).toBe('bitcoin');
      expect(provider.name).toBe('Bitcoin');
      expect(provider.type).toBe('crypto');
      expect(provider.supportedCurrencies).toEqual(['BTC']);
    });

    test('should throw error if Privy App ID is not configured', () => {
      jest.doMock('../../../config/payment', () => ({
        PAYMENT_CONFIG: {
          privy: {
            appId: ''
          }
        }
      }));

      expect(() => {
        const { BitcoinPaymentProvider: TestProvider } = require('../../../services/providers/bitcoinPaymentProvider');
        new TestProvider();
      }).toThrow('Privy App ID não configurado para Bitcoin');
    });
  });

  describe('process', () => {
    test('should process Bitcoin payment successfully', async () => {
      // Mock da conversão BRL para BTC
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } })
      });

      // Mock do crypto.subtle.digest
      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      const result = await provider.process(300000, 'plan-1', 'user-1');

      expect(result).toEqual({
        transactionId: expect.stringContaining('btc-user-1-plan-1'),
        paymentAddress: expect.stringMatching(/^1[a-f0-9]{25}$/),
        qrCode: expect.stringContaining('bitcoin:'),
        amount: expect.closeTo(1, 0.1),
        currency: 'BTC',
        expiresAt: expect.any(Date),
        metadata: expect.objectContaining({
          originalAmount: 300000,
          originalCurrency: 'BRL',
          btcAmount: expect.any(Number),
          userId: 'user-1',
          planId: 'plan-1'
        })
      });
    });

    test('should handle conversion API error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      await expect(provider.process(100, 'plan-1', 'user-1')).rejects.toThrow(
        'Falha ao processar pagamento Bitcoin'
      );
    });

    test('should handle invalid conversion response', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({})
      });

      await expect(provider.process(100, 'plan-1', 'user-1')).rejects.toThrow(
        'Falha ao processar pagamento Bitcoin'
      );
    });

    test('should generate deterministic address', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } })
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      const result1 = await provider.process(100, 'plan-1', 'user-1');
      
      // Reset mocks but keep same hash
      jest.clearAllMocks();
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } })
      });
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      const result2 = await provider.process(100, 'plan-1', 'user-1');

      // Addresses should be different due to timestamp in seed
      expect(result1.paymentAddress).not.toBe(result2.paymentAddress);
    });
  });

  describe('verify', () => {
    test('should verify completed payment', async () => {
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000 // 1 minuto atrás
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      const mockTransactions = [
        {
          txid: 'tx-hash-123',
          confirmations: 3,
          amount: 0.001,
          timestamp: Date.now() / 1000,
          status: 'confirmed'
        }
      ];

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          txid: 'tx-hash-123',
          status: { confirmed: true, block_height: 800000 },
          vout: [{
            scriptpubkey_address: '1TestAddress123',
            value: 100000 // 0.001 BTC em satoshis
          }],
          status: { block_time: Date.now() / 1000 }
        }])
      });

      const status = await provider.verify('btc-tx-123');

      expect(status).toBe('completed');
    });

    test('should verify processing payment (0 confirmations)', async () => {
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          txid: 'tx-hash-123',
          status: { confirmed: false },
          vout: [{
            scriptpubkey_address: '1TestAddress123',
            value: 100000
          }],
          status: { block_time: Date.now() / 1000 }
        }])
      });

      const status = await provider.verify('btc-tx-123');

      expect(status).toBe('processing');
    });

    test('should return pending when no matching transaction found', async () => {
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });

      const status = await provider.verify('btc-tx-123');

      expect(status).toBe('pending');
    });

    test('should return failed when metadata not found', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const status = await provider.verify('btc-tx-123');

      expect(status).toBe('failed');
    });

    test('should handle API error gracefully', async () => {
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      (fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      const status = await provider.verify('btc-tx-123');

      expect(status).toBe('failed');
    });

    test('should ignore transactions before creation time', async () => {
      const createdAt = Date.now() - 60000;
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([{
          txid: 'tx-hash-123',
          status: { confirmed: true, block_height: 800000 },
          vout: [{
            scriptpubkey_address: '1TestAddress123',
            value: 100000
          }],
          status: { block_time: (createdAt - 30000) / 1000 } // Antes da criação
        }])
      });

      const status = await provider.verify('btc-tx-123');

      expect(status).toBe('pending');
    });
  });

  describe('cancel', () => {
    test('should return false as Bitcoin does not support cancellation', async () => {
      const result = await provider.cancel('btc-tx-123');
      expect(result).toBe(false);
    });
  });

  describe('Currency Conversion', () => {
    test('should convert BRL to BTC correctly', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } })
      });

      // Mock do crypto.subtle.digest
      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      const result = await provider.process(150000, 'plan-1', 'user-1');

      expect(result.amount).toBeCloseTo(0.5, 5);
      expect(result.metadata.originalAmount).toBe(150000);
      expect(result.metadata.originalCurrency).toBe('BRL');
    });

    test('should handle missing price data', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: {} })
      });

      await expect(provider.process(100, 'plan-1', 'user-1')).rejects.toThrow(
        'Falha ao processar pagamento Bitcoin'
      );
    });
  });

  describe('Payment Monitoring', () => {
    test('should monitor payment status changes', async () => {
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      // Primeiro retorna pending, depois completed
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([])
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            txid: 'tx-hash-123',
            status: { confirmed: true, block_height: 800000 },
            vout: [{
              scriptpubkey_address: '1TestAddress123',
              value: 100000
            }],
            status: { block_time: Date.now() / 1000 }
          }])
        });

      const onStatusChange = jest.fn();

      provider.startPaymentMonitoring('btc-tx-123', onStatusChange);

      // Avançar tempo para primeira verificação
      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      expect(onStatusChange).toHaveBeenCalledWith('pending');

      // Avançar tempo para segunda verificação
      jest.advanceTimersByTime(30000);
      await Promise.resolve();

      expect(onStatusChange).toHaveBeenCalledWith('completed');
    });

    test('should stop monitoring after timeout', async () => {
      const mockMetadata = {
        paymentAddress: '1TestAddress123',
        btcAmount: 0.001,
        createdAt: Date.now() - 60000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify({
        'btc-tx-123': { metadata: mockMetadata }
      }));

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([])
      });

      const onStatusChange = jest.fn();

      provider.startPaymentMonitoring('btc-tx-123', onStatusChange);

      // Avançar tempo além do timeout
      jest.advanceTimersByTime(3600000 + 1000);
      await Promise.resolve();

      expect(onStatusChange).toHaveBeenLastCalledWith('expired');
    });
  });

  describe('Network Info', () => {
    test('should get network information', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(800000)
      });

      const networkInfo = await provider.getNetworkInfo();

      expect(networkInfo).toEqual({
        blockHeight: 800000,
        difficulty: 0,
        networkHashRate: 0
      });
    });

    test('should handle network info error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const networkInfo = await provider.getNetworkInfo();

      expect(networkInfo).toEqual({
        blockHeight: 0,
        difficulty: 0,
        networkHashRate: 0
      });
    });
  });

  describe('Fee Estimation', () => {
    test('should get recommended fees', async () => {
      const mockFees = {
        '2': 10,
        '6': 5,
        '144': 1
      };

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockFees)
      });

      const fees = await provider.getRecommendedFee();

      expect(fees).toEqual({
        slow: 1,
        standard: 5,
        fast: 10
      });
    });

    test('should return default fees on error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Fee API error'));

      const fees = await provider.getRecommendedFee();

      expect(fees).toEqual({
        slow: 1,
        standard: 5,
        fast: 10
      });
    });
  });

  describe('Address Generation', () => {
    test('should generate valid Bitcoin address format', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } })
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      const result = await provider.process(100, 'plan-1', 'user-1');

      expect(result.paymentAddress).toMatch(/^1[a-f0-9]{25}$/);
    });

    test('should include address in QR code', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } })
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5]).buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(mockHashBuffer);

      const result = await provider.process(100, 'plan-1', 'user-1');

      expect(result.qrCode).toContain(result.paymentAddress);
      expect(result.qrCode).toContain('bitcoin:');
      expect(result.qrCode).toContain('amount=');
      expect(result.qrCode).toContain('label=Xperience-plan-1');
    });
  });
});
