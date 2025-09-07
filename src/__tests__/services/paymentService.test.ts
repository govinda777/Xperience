import { PaymentService } from "../../services/paymentService";
import {
  PaymentError,
  PaymentProviderInterface,
  PaymentResult,
  PaymentStatus,
  PaymentState,
  PaymentProvider,
  PaymentCurrency,
} from "../../types/payment";

// Mock para o console.error para evitar poluição nos logs
const mockConsoleError = jest.fn();
global.console.error = mockConsoleError;

// Mock para o AbortController
class MockAbortController {
  signal = { aborted: false };
  abort() {
    this.signal.aborted = true;
  }
}

// Store the original AbortController
const OriginalAbortController = global.AbortController;

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  // Reset the AbortController mock before each test
  global.AbortController = MockAbortController as any;
  // Reset fetch mock
  (fetch as jest.Mock).mockReset();
  // Reset localStorage mocks
  (localStorageMock.getItem as jest.Mock).mockReset();
  (localStorageMock.setItem as jest.Mock).mockReset();
  (localStorageMock.removeItem as jest.Mock).mockReset();
  (localStorageMock.clear as jest.Mock).mockReset();
});

afterAll(() => {
  // Restore the original AbortController after all tests
  global.AbortController = OriginalAbortController;
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock do fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Create PaymentService instance
let paymentService: PaymentService;

// Initialize paymentService before each test
beforeEach(() => {
  paymentService = new PaymentService();
  jest.clearAllMocks();
});

// Mock provider para tests
const mockProvider: PaymentProviderInterface = {
  id: "pix",
  name: "PIX Test",
  type: "fiat",
  supportedCurrencies: ["BRL"],
  process: jest.fn(),
  verify: jest.fn(),
  cancel: jest.fn(),
};

describe("PaymentService", () => {
  let paymentService: PaymentService;

  beforeEach(() => {
    paymentService = new PaymentService();
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("Provider Management", () => {
    test("should register a payment provider", () => {
      paymentService.registerProvider(mockProvider);

      const providers = paymentService.getAvailableProviders();
      expect(providers).toHaveLength(1);
      expect(providers[0]).toBe(mockProvider);
    });

    test("should get a specific provider", () => {
      paymentService.registerProvider(mockProvider);

      const provider = paymentService.getProvider("pix");
      expect(provider).toBe(mockProvider);
    });

    test("should return undefined for non-existent provider", () => {
      const provider = paymentService.getProvider("bitcoin");
      expect(provider).toBeUndefined();
    });

    test("should get all available providers", () => {
      const provider2: PaymentProviderInterface = {
        ...mockProvider,
        id: "bitcoin",
        name: "Bitcoin Test",
      };

      paymentService.registerProvider(mockProvider);
      paymentService.registerProvider(provider2);

      const providers = paymentService.getAvailableProviders();
      expect(providers).toHaveLength(2);
    });
  });

  describe("Payment Processing", () => {
    beforeEach(() => {
      paymentService.registerProvider(mockProvider);
    });

    test("should process payment successfully", async () => {
      const mockResult: PaymentResult = {
        transactionId: "test-tx-123",
        amount: 100,
        currency: "BRL",
        paymentUrl: "https://test.com/pay",
        expiresAt: new Date(Date.now() + 3600000),
      };

      (mockProvider.process as jest.Mock).mockResolvedValue(mockResult);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      const result = await paymentService.processPayment(
        "pix",
        100,
        "BRL",
        "plan-1",
        "user-1",
      );

      expect(result).toEqual(mockResult);
      expect(mockProvider.process).toHaveBeenCalledWith(
        100,
        "plan-1",
        "user-1",
      );
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test("should throw error for non-existent provider", async () => {
      await expect(
        paymentService.processPayment(
          "bitcoin",
          100,
          "BRL",
          "plan-1",
          "user-1",
        ),
      ).rejects.toThrow(PaymentError);
    });

    test("should handle provider processing error", async () => {
      (mockProvider.process as jest.Mock).mockRejectedValue(
        new Error("Provider error"),
      );
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      await expect(
        paymentService.processPayment("pix", 100, "BRL", "plan-1", "user-1"),
      ).rejects.toThrow(PaymentError);
    });

    test("should convert currency when needed", async () => {
      const mockResult: PaymentResult = {
        transactionId: "test-tx-123",
        amount: 0.00033,
        currency: "BTC",
      };

      (mockProvider.process as jest.Mock).mockResolvedValue(mockResult);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      await paymentService.processPayment(
        "pix",
        100,
        "BTC",
        "plan-1",
        "user-1",
      );

      // Verifica se a conversão foi feita
      expect(mockProvider.process).toHaveBeenCalledWith(
        expect.closeTo(0.00033333, 8), // 100 / 300000
        "plan-1",
        "user-1",
      );
    });

    test("should handle currency conversion errors", async () => {
      // Mock the fetch to reject with an error
      const errorMessage = "Falha ao buscar taxa de câmbio";
      (fetch as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      
      // Create a new instance to avoid cached rates
      const testService = new PaymentService();
      
      // Mock the updateExchangeRate method to throw the expected error
      const originalUpdateExchangeRate = testService['updateExchangeRate'].bind(testService);
      testService['updateExchangeRate'] = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
      
      await expect(
        testService.convertCurrency(100, "BRL", "BTC")
      ).rejects.toThrow(`Falha ao converter 100 BRL para BTC: ${errorMessage}`);
      
      // Verify the error was thrown
      expect(testService['updateExchangeRate']).toHaveBeenCalledWith("BRL", "BTC");
      
      // Restore the original method
      testService['updateExchangeRate'] = originalUpdateExchangeRate;
    });

    test("should use cached exchange rates when available", async () => {
      // Mock the fetch response for the first call
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      // First call - should fetch from API
      const result1 = await paymentService.convertCurrency(300000, "BRL", "BTC");
      expect(fetch).toHaveBeenCalledTimes(1);
      
      // Reset fetch mock to track subsequent calls
      (fetch as jest.Mock).mockClear();
      
      // Second call - should use cache
      const result2 = await paymentService.convertCurrency(300000, "BRL", "BTC");
      expect(fetch).not.toHaveBeenCalled(); // Should not call fetch again
      
      // Third call - should still use cache
      const result3 = await paymentService.convertCurrency(600000, "BRL", "BTC");
      expect(fetch).not.toHaveBeenCalled(); // Should still not call fetch again
      expect(result3).toBeCloseTo(2, 5); // 600000 / 300000 = 2 BTC
    });
  });

  describe("Payment State Management", () => {
    const mockPaymentState: PaymentState = {
      id: "test-tx-123",
      planId: "plan-1",
      userId: "user-1",
      amount: 100,
      currency: "BRL",
      provider: "pix" as PaymentProvider,
      status: "pending" as PaymentStatus,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      paymentService.registerProvider(mockProvider);
      // Default mock for getItem
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'xperience_payments') {
          return JSON.stringify({ [mockPaymentState.id]: mockPaymentState });
        }
        return null;
      });
    });

    test("should save payment state to localStorage", async () => {
      const setItemSpy = jest.spyOn(localStorageMock, 'setItem');
      // Reset getItem to return empty object for this test
      localStorageMock.getItem.mockImplementationOnce(() => '{}');
      
      await paymentService['savePaymentState'](mockPaymentState);
      
      expect(setItemSpy).toHaveBeenCalledWith(
        'xperience_payments',
        expect.stringContaining(`"id":"${mockPaymentState.id}"`)
      );
    });

    test("should update payment status", async () => {
      // Set up initial state in localStorage
      const paymentId = "test-tx-123";
      const initialPayment = {
        ...mockPaymentState,
        id: paymentId,
        status: 'pending' as const,
        updatedAt: new Date()
      };
      
      // Mock getItem to return our test payment
      localStorageMock.getItem.mockImplementation(() => 
        JSON.stringify({ [paymentId]: initialPayment })
      );
      
      // Get the current time before the update
      const beforeUpdate = new Date();
      
      // Spy on setItem to verify the update
      const setItemSpy = jest.spyOn(localStorageMock, 'setItem');
      
      // Update the status
      await paymentService['updatePaymentStatus'](paymentId, "completed");
      
      // Verify that setItem was called with the updated payment
      expect(setItemSpy).toHaveBeenCalled();
      const updatedPayments = JSON.parse(setItemSpy.mock.calls[0][1]);
      const updatedPayment = updatedPayments[paymentId];
      
      // Verify the update
      expect(updatedPayment).toBeDefined();
      expect(updatedPayment.status).toBe("completed");
      
      // Check if the updatedAt is after or equal to the time before the update
      const updatedAt = new Date(updatedPayment.updatedAt).getTime();
      expect(updatedAt).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    test("should not throw when updating non-existent payment", async () => {
      // Mock getItem to return empty object (no payments)
      localStorageMock.getItem.mockImplementationOnce(() => '{}');
      
      // This should not throw
      await expect(
        paymentService['updatePaymentStatus']("non-existent-tx", "completed")
      ).resolves.not.toThrow();
    });
  });

  describe("Exchange Rate Management", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
      (fetch as jest.Mock).mockClear();
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    test("should load exchange rates on initialization", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      const service = new PaymentService();
      // Aguarda um pouco para a inicialização assíncrona
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("https://api.coingecko.com"),
        expect.any(Object)
      );
    });

    test("should handle exchange rate API errors gracefully", async () => {
      const service = new PaymentService();
      
      // Mock the updateExchangeRate method to throw a specific error
      const originalUpdateExchangeRate = service['updateExchangeRate'].bind(service);
      service['updateExchangeRate'] = jest.fn().mockImplementationOnce(async () => {
        throw new Error("Falha ao buscar taxa de câmbio");
      });
      
      // Tenta fazer uma conversão que deve falhar
      await expect(
        service.convertCurrency(100, "BRL", "BTC")
      ).rejects.toThrow("Falha ao buscar taxa de câmbio");
      
      // Restore the original method
      service['updateExchangeRate'] = originalUpdateExchangeRate;
    });

    test("should handle exchange rate timeout", async () => {
      const service = new PaymentService();
      
      // Mock the updateExchangeRate method to simulate a timeout
      const originalUpdateExchangeRate = service['updateExchangeRate'].bind(service);
      service['updateExchangeRate'] = jest.fn().mockImplementationOnce(async () => {
        throw new Error("Timeout");
      });
      
      // Tenta fazer uma conversão que deve falhar por timeout
      await expect(
        service.convertCurrency(100, "BRL", "BTC")
      ).rejects.toThrow("Timeout");
      
      // Restore the original method
      service['updateExchangeRate'] = originalUpdateExchangeRate;
    });
  });

  describe("Payment Verification", () => {
    beforeEach(() => {
      paymentService.registerProvider(mockProvider);
    });

    test("should verify payment successfully", async () => {
      (mockProvider.verify as jest.Mock).mockResolvedValue("completed");

      const status = await paymentService.verifyPayment("pix", "tx-123");

      expect(status).toBe("completed");
      expect(mockProvider.verify).toHaveBeenCalledWith("tx-123");
    });

    test("should throw error for non-existent provider", async () => {
      await expect(
        paymentService.verifyPayment("bitcoin", "tx-123"),
      ).rejects.toThrow(PaymentError);
    });

    test("should handle verification error", async () => {
      (mockProvider.verify as jest.Mock).mockRejectedValue(
        new Error("Verification failed"),
      );

      await expect(
        paymentService.verifyPayment("pix", "tx-123"),
      ).rejects.toThrow(PaymentError);
    });
  });

  describe("Payment Cancellation", () => {
    beforeEach(() => {
      paymentService.registerProvider(mockProvider);
    });

    test("should cancel payment successfully", async () => {
      (mockProvider.cancel as jest.Mock).mockResolvedValue(true);

      const result = await paymentService.cancelPayment("pix", "tx-123");

      expect(result).toBe(true);
      expect(mockProvider.cancel).toHaveBeenCalledWith("tx-123");
    });

    test("should return false for provider without cancel support", async () => {
      const providerWithoutCancel = { ...mockProvider };
      delete providerWithoutCancel.cancel;

      paymentService.registerProvider(providerWithoutCancel);

      const result = await paymentService.cancelPayment("pix", "tx-123");

      expect(result).toBe(false);
    });

    test("should return false for non-existent provider", async () => {
      const result = await paymentService.cancelPayment("bitcoin", "tx-123");

      expect(result).toBe(false);
    });

    test("should handle cancellation error gracefully", async () => {
      (mockProvider.cancel as jest.Mock).mockRejectedValue(
        new Error("Cancel failed"),
      );

      const result = await paymentService.cancelPayment("pix", "tx-123");

      expect(result).toBe(false);
    });
  });

  describe("Currency Conversion", () => {
    test("should return same amount for same currency", async () => {
      const result = await paymentService.convertCurrency(100, "BRL", "BRL");
      expect(result).toBe(100);
    });

    test("should convert BRL to BTC", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      const result = await paymentService.convertCurrency(300000, "BRL", "BTC");
      expect(result).toBeCloseTo(1, 5);
    });

    test("should convert BRL to USDT", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const result = await paymentService.convertCurrency(55, "BRL", "USDT");
      expect(result).toBeCloseTo(10, 2);
    });

    test("should handle conversion API error", async () => {
      // Mock fetch to reject with an error
      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      // Try to convert currency - should propagate the error
      await expect(
        paymentService.convertCurrency(100, "BRL", "BTC")
      ).rejects.toThrow("API Error");
    });

    test("should use cached exchange rate if not expired", async () => {
      // Primeiro, fazer uma conversão para cachear a taxa
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      await paymentService.convertCurrency(300000, "BRL", "BTC");

      // Limpar o mock para verificar se não é chamado novamente
      (fetch as jest.Mock).mockClear();

      // Segunda conversão deve usar cache
      const result = await paymentService.convertCurrency(150000, "BRL", "BTC");

      expect(result).toBeCloseTo(0.5, 5);
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe("Payment History", () => {
    test("should get payment history for user", async () => {
      const mockPayments = {
        "tx-1": {
          id: "tx-1",
          userId: "user-1",
          planId: "plan-1",
          amount: 100,
          currency: "BRL",
          provider: "pix",
          status: "completed",
          createdAt: new Date("2023-01-01"),
          updatedAt: new Date("2023-01-01"),
          metadata: {},
        },
        "tx-2": {
          id: "tx-2",
          userId: "user-2",
          planId: "plan-1",
          amount: 200,
          currency: "BRL",
          provider: "pix",
          status: "pending",
          createdAt: new Date("2023-01-02"),
          updatedAt: new Date("2023-01-02"),
          metadata: {},
        },
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPayments));

      const history = await paymentService.getPaymentHistory("user-1");

      expect(history).toHaveLength(1);
      expect(history[0].id).toBe("tx-1");
      expect(history[0].userId).toBe("user-1");
    });

    test("should return empty array for user with no payments", async () => {
      localStorageMock.getItem.mockReturnValue("{}");

      const history = await paymentService.getPaymentHistory("user-3");

      expect(history).toHaveLength(0);
    });

    test("should handle localStorage error gracefully", async () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error("Storage error");
      });

      const history = await paymentService.getPaymentHistory("user-1");

      expect(history).toHaveLength(0);
    });
  });
});

describe("Payment Cancellation", () => {
  beforeEach(() => {
    paymentService.registerProvider(mockProvider);
  });

  test("should cancel payment successfully", async () => {
    (mockProvider.cancel as jest.Mock).mockResolvedValue(true);

    const result = await paymentService.cancelPayment("pix", "tx-123");

    expect(result).toBe(true);
    expect(mockProvider.cancel).toHaveBeenCalledWith("tx-123");
  });

  test("should return false for provider without cancel support", async () => {
    const providerWithoutCancel = { ...mockProvider };
    delete providerWithoutCancel.cancel;

    paymentService.registerProvider(providerWithoutCancel);

    const result = await paymentService.cancelPayment("pix", "tx-123");

    expect(result).toBe(false);
  });

  test("should return false for non-existent provider", async () => {
    const result = await paymentService.cancelPayment("bitcoin", "tx-123");

    expect(result).toBe(false);
  });

  test("should handle cancellation error gracefully", async () => {
    (mockProvider.cancel as jest.Mock).mockRejectedValue(
      new Error("Cancel failed"),
    );

    const result = await paymentService.cancelPayment("pix", "tx-123");

    expect(result).toBe(false);
  });
});

describe("Currency Conversion", () => {
  test("should return same amount for same currency", async () => {
    const result = await paymentService.convertCurrency(100, "BRL", "BRL");
    expect(result).toBe(100);
  });

  test("should convert BRL to BTC", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
    });

    const result = await paymentService.convertCurrency(300000, "BRL", "BTC");
    expect(result).toBeCloseTo(1, 5);
  });

  test("should convert BRL to USDT", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tether: { brl: 5.5 } }),
    });

    const result = await paymentService.convertCurrency(55, "BRL", "USDT");
    expect(result).toBeCloseTo(10, 2);
  });

  test("should handle conversion API error", async () => {
    // Mock fetch to reject with an error
    (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

    // Try to convert currency - should propagate the error
    await expect(
      paymentService.convertCurrency(100, "BRL", "BTC")
    ).rejects.toThrow("API Error");
  });

  test("should use cached exchange rate if not expired", async () => {
    // Primeiro, fazer uma conversão para cachear a taxa
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
    });

    await paymentService.convertCurrency(300000, "BRL", "BTC");

    // Limpar o mock para verificar se não é chamado novamente
    (fetch as jest.Mock).mockClear();

    // Segunda conversão deve usar cache
    const result = await paymentService.convertCurrency(150000, "BRL", "BTC");

    expect(result).toBeCloseTo(0.5, 5);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("Payment History", () => {
  test("should get payment history for user", async () => {
    const mockPayments = {
      "tx-1": {
        id: "tx-1",
        userId: "user-1",
        planId: "plan-1",
        amount: 100,
        currency: "BRL",
        provider: "pix",
        status: "completed",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-01"),
        metadata: {},
      },
      "tx-2": {
        id: "tx-2",
        userId: "user-2",
        planId: "plan-1",
        amount: 200,
        currency: "BRL",
        provider: "pix",
        status: "pending",
        createdAt: new Date("2023-01-02"),
        updatedAt: new Date("2023-01-02"),
        metadata: {},
      },
    };

    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockPayments));

    const history = await paymentService.getPaymentHistory("user-1");

    expect(history).toHaveLength(1);
    expect(history[0].id).toBe("tx-1");
    expect(history[0].userId).toBe("user-1");
    
    // Test with non-existent user ID
    const nonExistentUserHistory = await paymentService.getPaymentHistory("non-existent-user");
    expect(nonExistentUserHistory).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
      
      // Configura o console mock
      (global as any).console = {
        error: jest.fn(),
        log: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
      };
      
      // Garante que o provider mock está registrado
      paymentService.registerProvider(mockProvider);
      
      // Configura o mock do fetch para retornar uma resposta padrão
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });
    });

    test("should handle provider processing error with details", async () => {
      // Configura o mock para retornar um erro
      const error = new Error("Specific provider error");
      (mockProvider.process as jest.Mock).mockRejectedValue(error);
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });

      // Executa o teste
      try {
        await paymentService.processPayment("pix", 100, "BRL", "plan-1", "user-1");
        fail("Should have thrown an error");
      } catch (err: unknown) {
        // Verificações de tipo
        if (!(err instanceof PaymentError)) {
          fail('Error should be an instance of PaymentError');
          return;
        }
        
        // Verificações específicas do erro
        expect(err.details).toBeDefined();
        expect(err.message).toContain("Erro ao processar pagamento");
        expect((err as any).provider).toBe("pix");
      }
    });

    test("should handle verification error with details", async () => {
      // Configura o mock para retornar um erro
      const error = new Error("Verification failed");
      (mockProvider.verify as jest.Mock).mockRejectedValue(error);

      // Executa o teste
      try {
        await paymentService.verifyPayment("pix", "tx-123");
        fail("Should have thrown an error");
      } catch (err: unknown) {
        // Verificações de tipo
        if (!(err instanceof PaymentError)) {
          fail('Error should be an instance of PaymentError');
          return;
        }
        
        // Verificações específicas do erro
        expect(err.details).toBeDefined();
        expect(err.message).toContain("Erro ao verificar pagamento");
        expect((err as any).provider).toBe("pix");
        expect((err as any).transactionId).toBe("tx-123");
      }
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
      paymentService.registerProvider(mockProvider);
      
      // Configura o mock para retornar taxas de câmbio válidas por padrão
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ bitcoin: { brl: 300000 } }),
      });
    });

    test("should handle invalid provider in processPayment", async () => {
      await expect(
        paymentService.processPayment(
          "" as PaymentProvider, // Provider vazio
          100,
          "BRL",
          "plan-1",
          "user-1"
        )
      ).rejects.toThrow(PaymentError);
    });

    test("should handle negative amount in processPayment", async () => {
      await expect(
        paymentService.processPayment(
          "pix",
          -100, // Valor negativo
          "BRL",
          "plan-1",
          "user-1"
        )
      ).rejects.toThrow(PaymentError);
    });

    test("should handle missing provider in verifyPayment", async () => {
      await expect(
        paymentService.verifyPayment("" as PaymentProvider, "tx-123")
      ).rejects.toThrow(PaymentError);
    });

    test("should handle missing transaction ID in verifyPayment", async () => {
      await expect(
        paymentService.verifyPayment("pix", "")
      ).rejects.toThrow(PaymentError);
    });

    test("should handle missing provider in cancelPayment", async () => {
      const result = await paymentService.cancelPayment("" as PaymentProvider, "tx-123");
      expect(result).toBe(false);
    });

    test("should handle missing transaction ID in cancelPayment", async () => {
      const result = await paymentService.cancelPayment("pix", "");
      expect(result).toBe(false);
    });

    test("should handle invalid currency conversion", async () => {
      // Test with zero amount
      await expect(
        paymentService.convertCurrency(0, "BRL", "BTC")
      ).rejects.toThrow("O valor para conversão deve ser maior que zero");
      
      // Test with negative amount
      await expect(
        paymentService.convertCurrency(-100, "BRL", "BTC")
      ).rejects.toThrow("O valor para conversão deve ser maior que zero");
      
      // Test with invalid rate (0 rate)
      const service = new PaymentService();
      
      // Mock the updateExchangeRate method to throw an error for invalid rate
      const originalUpdateExchangeRate = service['updateExchangeRate'].bind(service);
      service['updateExchangeRate'] = jest.fn().mockImplementationOnce(async () => {
        throw new Error("Taxa de câmbio inválida");
      });
      
      // Test that the error is properly propagated
      await expect(
        service.convertCurrency(100, "BRL", "BTC")
      ).rejects.toThrow("Taxa de câmbio inválida");
      
      // Restore the original method
      service['updateExchangeRate'] = originalUpdateExchangeRate;
    });
  });
