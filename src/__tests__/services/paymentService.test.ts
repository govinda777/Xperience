import { PaymentService } from "../../services/paymentService";
import {
  PaymentError,
  PaymentProviderInterface,
  PaymentResult,
  PaymentStatus,
} from "../../types/payment";

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
global.fetch = jest.fn();

// Mock provider para testes
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
        expect.any(Number),
        "plan-1",
        "user-1",
      );
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
      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(
        paymentService.convertCurrency(100, "BRL", "BTC"),
      ).rejects.toThrow("Taxa de câmbio não disponível");
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

  describe("Get Payment", () => {
    test("should get specific payment", async () => {
      const mockPayment = {
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
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({ "tx-1": mockPayment }),
      );

      const payment = await paymentService.getPayment("tx-1");

      expect(payment).toEqual(mockPayment);
    });

    test("should return null for non-existent payment", async () => {
      localStorageMock.getItem.mockReturnValue("{}");

      const payment = await paymentService.getPayment("tx-999");

      expect(payment).toBeNull();
    });
  });
});
