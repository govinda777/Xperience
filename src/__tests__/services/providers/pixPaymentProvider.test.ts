import { PixPaymentProvider } from "../../../services/providers/pixPaymentProvider";

// Mock axios
jest.mock("axios", () => ({
  create: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
    defaults: { timeout: 30000 },
  })),
  post: jest.fn(),
  get: jest.fn(),
}));

describe("PixPaymentProvider", () => {
  let provider: PixPaymentProvider;

  beforeEach(() => {
    provider = new PixPaymentProvider();
    jest.clearAllMocks();
  });

  describe("Provider Properties", () => {
    it("should have correct provider properties", () => {
      expect(provider.id).toBe("pix");
      expect(provider.name).toBe("PIX");
      expect(provider.type).toBe("fiat");
      expect(provider.supportedCurrencies).toEqual(["BRL"]);
    });
  });

  describe("validatePaymentData", () => {
    it("should validate payment data correctly", () => {
      const validData = {
        amount: 100.0,
        currency: "BRL" as const,
        description: "Test payment",
        externalId: "test-123",
      };

      const result = provider.validatePaymentData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return validation errors for invalid data", () => {
      const invalidData = {
        amount: 0,
        currency: "USD" as const,
        description: "",
        externalId: "",
      };

      const result = provider.validatePaymentData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should validate minimum amount", () => {
      const invalidData = {
        amount: 0.5, // Below minimum
        currency: "BRL" as const,
        description: "Test",
        externalId: "test-123",
      };

      const result = provider.validatePaymentData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.includes("Minimum amount")),
      ).toBe(true);
    });

    it("should validate maximum amount", () => {
      const invalidData = {
        amount: 50000, // Above maximum
        currency: "BRL" as const,
        description: "Test",
        externalId: "test-123",
      };

      const result = provider.validatePaymentData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) => error.includes("Maximum amount")),
      ).toBe(true);
    });

    it("should validate currency", () => {
      const invalidData = {
        amount: 100,
        currency: "USD" as const,
        description: "Test",
        externalId: "test-123",
      };

      const result = provider.validatePaymentData(invalidData);
      expect(result.isValid).toBe(false);
      expect(
        result.errors.some((error) =>
          error.includes("Currency USD not supported"),
        ),
      ).toBe(true);
    });
  });

  describe("formatAmount", () => {
    it("should format amount correctly", () => {
      expect(provider.formatAmount(100.0, "BRL")).toBe("R$ 100,00");
      expect(provider.formatAmount(1234.56, "BRL")).toBe("R$ 1.234,56");
      expect(provider.formatAmount(0.99, "BRL")).toBe("R$ 0,99");
    });
  });

  describe("isPaymentExpired", () => {
    it("should detect expired payment", () => {
      const expiredDate = new Date(Date.now() - 60000).toISOString(); // 1 minute ago
      expect(provider.isPaymentExpired(expiredDate)).toBe(true);
    });

    it("should detect non-expired payment", () => {
      const futureDate = new Date(Date.now() + 60000).toISOString(); // 1 minute from now
      expect(provider.isPaymentExpired(futureDate)).toBe(false);
    });
  });

  describe("calculateDiscountedAmount", () => {
    it("should calculate amount without discount for PIX", () => {
      const amount = provider.calculateDiscountedAmount(100, "BRL");
      expect(amount).toBe(100); // PIX has no discount
    });
  });

  describe("getSupportedNetworks", () => {
    it("should return empty array for PIX (no networks)", () => {
      const networks = provider.getSupportedNetworks();
      expect(networks).toEqual([]);
    });
  });

  describe("getEstimatedConfirmationTime", () => {
    it("should return instant confirmation for PIX", () => {
      const time = provider.getEstimatedConfirmationTime();
      expect(time).toBe("Instantâneo");
    });
  });

  describe("getPaymentInstructions", () => {
    it("should return PIX payment instructions", () => {
      const instructions = provider.getPaymentInstructions("pt-BR");
      expect(instructions).toContain("PIX");
      expect(instructions.length).toBeGreaterThan(0);
    });
  });
});
