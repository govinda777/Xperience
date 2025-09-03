import { PaymentError } from "../../types/payment";

describe("PaymentError", () => {
  test("should create PaymentError with required properties", () => {
    const error = new PaymentError({
      code: "PAYMENT_FAILED",
      message: "Payment processing failed",
      provider: "pix",
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(PaymentError);
    expect(error.name).toBe("PaymentError");
    expect(error.code).toBe("PAYMENT_FAILED");
    expect(error.message).toBe("Payment processing failed");
    expect(error.provider).toBe("pix");
    expect(error.transactionId).toBeUndefined();
    expect(error.details).toBeUndefined();
  });

  test("should create PaymentError with all properties", () => {
    const details = { originalError: "Network timeout", retryCount: 3 };

    const error = new PaymentError({
      code: "NETWORK_ERROR",
      message: "Network connection failed",
      provider: "bitcoin",
      transactionId: "btc-tx-123",
      details,
    });

    expect(error.code).toBe("NETWORK_ERROR");
    expect(error.message).toBe("Network connection failed");
    expect(error.provider).toBe("bitcoin");
    expect(error.transactionId).toBe("btc-tx-123");
    expect(error.details).toEqual(details);
  });

  test("should be throwable and catchable", () => {
    const throwError = () => {
      throw new PaymentError({
        code: "TEST_ERROR",
        message: "Test error message",
        provider: "usdt",
      });
    };

    expect(throwError).toThrow(PaymentError);
    expect(throwError).toThrow("Test error message");

    try {
      throwError();
    } catch (error) {
      expect(error).toBeInstanceOf(PaymentError);
      if (error instanceof PaymentError) {
        expect(error.code).toBe("TEST_ERROR");
        expect(error.provider).toBe("usdt");
      }
    }
  });

  test("should maintain error stack trace", () => {
    const error = new PaymentError({
      code: "STACK_TEST",
      message: "Stack trace test",
      provider: "pix",
    });

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain("PaymentError");
  });

  test("should work with different provider types", () => {
    const pixError = new PaymentError({
      code: "PIX_ERROR",
      message: "PIX error",
      provider: "pix",
    });

    const bitcoinError = new PaymentError({
      code: "BITCOIN_ERROR",
      message: "Bitcoin error",
      provider: "bitcoin",
    });

    const usdtError = new PaymentError({
      code: "USDT_ERROR",
      message: "USDT error",
      provider: "usdt",
    });

    expect(pixError.provider).toBe("pix");
    expect(bitcoinError.provider).toBe("bitcoin");
    expect(usdtError.provider).toBe("usdt");
  });

  test("should handle complex details object", () => {
    const complexDetails = {
      httpStatus: 500,
      apiResponse: {
        error: "Internal server error",
        timestamp: "2023-01-01T10:00:00Z",
      },
      retryAttempts: 3,
      lastAttemptAt: new Date("2023-01-01T10:05:00Z"),
      userAgent: "Mozilla/5.0...",
    };

    const error = new PaymentError({
      code: "API_ERROR",
      message: "API request failed",
      provider: "pix",
      transactionId: "pix-tx-456",
      details: complexDetails,
    });

    expect(error.details).toEqual(complexDetails);
    expect(error.details?.httpStatus).toBe(500);
    expect(error.details?.apiResponse.error).toBe("Internal server error");
  });

  test("should be serializable to JSON", () => {
    const error = new PaymentError({
      code: "SERIALIZATION_TEST",
      message: "Serialization test error",
      provider: "bitcoin",
      transactionId: "btc-tx-789",
      details: { reason: "insufficient_funds", balance: 0.001 },
    });

    const serialized = JSON.stringify({
      name: error.name,
      code: error.code,
      message: error.message,
      provider: error.provider,
      transactionId: error.transactionId,
      details: error.details,
    });

    const parsed = JSON.parse(serialized);

    expect(parsed.name).toBe("PaymentError");
    expect(parsed.code).toBe("SERIALIZATION_TEST");
    expect(parsed.message).toBe("Serialization test error");
    expect(parsed.provider).toBe("bitcoin");
    expect(parsed.transactionId).toBe("btc-tx-789");
    expect(parsed.details).toEqual({
      reason: "insufficient_funds",
      balance: 0.001,
    });
  });

  test("should work with instanceof checks", () => {
    const error = new PaymentError({
      code: "INSTANCEOF_TEST",
      message: "Instance test",
      provider: "pix",
    });

    expect(error instanceof Error).toBe(true);
    expect(error instanceof PaymentError).toBe(true);
    expect(error instanceof TypeError).toBe(false);
  });

  test("should handle empty details object", () => {
    const error = new PaymentError({
      code: "EMPTY_DETAILS",
      message: "Empty details test",
      provider: "usdt",
      details: {},
    });

    expect(error.details).toEqual({});
  });

  test("should handle null and undefined values in details", () => {
    const error = new PaymentError({
      code: "NULL_VALUES",
      message: "Null values test",
      provider: "bitcoin",
      details: {
        nullValue: null,
        undefinedValue: undefined,
        validValue: "test",
      },
    });

    expect(error.details?.nullValue).toBeNull();
    expect(error.details?.undefinedValue).toBeUndefined();
    expect(error.details?.validValue).toBe("test");
  });

  test("should maintain correct prototype chain", () => {
    const error = new PaymentError({
      code: "PROTOTYPE_TEST",
      message: "Prototype test",
      provider: "pix",
    });

    expect(Object.getPrototypeOf(error)).toBe(PaymentError.prototype);
    expect(Object.getPrototypeOf(PaymentError.prototype)).toBe(Error.prototype);
  });

  test("should handle very long error messages", () => {
    const longMessage = "A".repeat(1000);

    const error = new PaymentError({
      code: "LONG_MESSAGE",
      message: longMessage,
      provider: "usdt",
    });

    expect(error.message).toBe(longMessage);
    expect(error.message.length).toBe(1000);
  });

  test("should handle special characters in error properties", () => {
    const error = new PaymentError({
      code: "SPECIAL_CHARS_测试",
      message: "Error with émojis 🚫 and spëcial chars",
      provider: "bitcoin",
      transactionId: "tx-123-测试-🔥",
      details: {
        unicode: "测试",
        emoji: "🚫💰",
        accents: "café",
      },
    });

    expect(error.code).toBe("SPECIAL_CHARS_测试");
    expect(error.message).toBe("Error with émojis 🚫 and spëcial chars");
    expect(error.transactionId).toBe("tx-123-测试-🔥");
    expect(error.details?.unicode).toBe("测试");
    expect(error.details?.emoji).toBe("🚫💰");
    expect(error.details?.accents).toBe("café");
  });
});
