import { USDTPaymentProvider } from "../../../services/providers/usdtPaymentProvider";
import { PaymentStatus } from "../../../types/payment";

// Mock do fetch
global.fetch = jest.fn();

// Mock das configurações
jest.mock("../../../config/payment", () => ({
  PAYMENT_CONFIG: {
    privy: {
      appId: "test-privy-app-id",
    },
  },
  PAYMENT_CONSTANTS: {
    CRYPTO_TIMEOUT: 3600000, // 1 hora
    CRYPTO_POLLING_INTERVAL: 30000, // 30 segundos
    COINGECKO_API: "https://api.coingecko.com/api/v3",
    CONTRACTS: {
      USDT_ETHEREUM: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    NETWORKS: {
      ETHEREUM_MAINNET: 1,
    },
  },
}));

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock do crypto.subtle
Object.defineProperty(global, "crypto", {
  value: {
    subtle: {
      digest: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
});

describe("USDTPaymentProvider", () => {
  let provider: USDTPaymentProvider;

  beforeEach(() => {
    provider = new USDTPaymentProvider();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Constructor", () => {
    test("should initialize with correct properties", () => {
      expect(provider.id).toBe("usdt");
      expect(provider.name).toBe("USDT (Tether)");
      expect(provider.type).toBe("crypto");
      expect(provider.supportedCurrencies).toEqual(["USDT"]);
    });

    test("should throw error if Privy App ID is not configured", () => {
      jest.doMock("../../../config/payment", () => ({
        PAYMENT_CONFIG: {
          privy: {
            appId: "",
          },
        },
      }));

      expect(() => {
        const {
          USDTPaymentProvider: TestProvider,
        } = require("../../../services/providers/usdtPaymentProvider");
        new TestProvider();
      }).toThrow("Privy App ID não configurado para USDT");
    });
  });

  describe("process", () => {
    test("should process USDT payment successfully", async () => {
      // Mock da conversão BRL para USDT
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      // Mock do crypto.subtle.digest
      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(550, "plan-1", "user-1");

      expect(result).toEqual({
        transactionId: expect.stringContaining("usdt-user-1-plan-1"),
        paymentAddress: expect.stringMatching(/^0x[a-f0-9]{40}$/),
        qrCode: expect.stringContaining("ethereum:"),
        amount: expect.closeTo(100, 1),
        currency: "USDT",
        expiresAt: expect.any(Date),
        metadata: expect.objectContaining({
          originalAmount: 550,
          originalCurrency: "BRL",
          usdtAmount: expect.any(Number),
          contractAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          networkId: 1,
          userId: "user-1",
          planId: "plan-1",
        }),
      });
    });

    test("should fallback to USD conversion when direct USDT fails", async () => {
      // Mock falha na conversão direta USDT
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ usd: { brl: 5.0 } }),
        });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(500, "plan-1", "user-1");

      expect(result.amount).toBeCloseTo(100, 1);
    });

    test("should handle conversion API error", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(provider.process(100, "plan-1", "user-1")).rejects.toThrow(
        "Falha ao processar pagamento USDT",
      );
    });

    test("should generate correct QR code format", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(550, "plan-1", "user-1");

      expect(result.qrCode).toContain("ethereum:");
      expect(result.qrCode).toContain("@1/transfer");
      expect(result.qrCode).toContain(
        "address=0xdAC17F958D2ee523a2206206994597C13D831ec7",
      );
      expect(result.qrCode).toContain("uint256=");
    });
  });

  describe("verify", () => {
    test("should verify completed payment", async () => {
      const mockMetadata = {
        paymentAddress: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
        usdtAmount: 100,
        createdAt: Date.now() - 60000,
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          "usdt-tx-123": { metadata: mockMetadata },
        }),
      );

      // Mock Etherscan API response
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "1",
              result: [
                {
                  hash: "0xabc123",
                  from: "0x123",
                  to: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
                  value: "100000000", // 100 USDT com 6 decimais
                  blockNumber: "18000000",
                  timeStamp: (Date.now() / 1000).toString(),
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "0x112a880", // 18000000 + 20 confirmações
            }),
        });

      const status = await provider.verify("usdt-tx-123");

      expect(status).toBe("completed");
    });

    test("should verify processing payment (less than 12 confirmations)", async () => {
      const mockMetadata = {
        paymentAddress: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
        usdtAmount: 100,
        createdAt: Date.now() - 60000,
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          "usdt-tx-123": { metadata: mockMetadata },
        }),
      );

      // Mock com poucas confirmações
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "1",
              result: [
                {
                  hash: "0xabc123",
                  from: "0x123",
                  to: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
                  value: "100000000",
                  blockNumber: "18000000",
                  timeStamp: (Date.now() / 1000).toString(),
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "0x1124f80", // 18000000 + 5 confirmações
            }),
        });

      const status = await provider.verify("usdt-tx-123");

      expect(status).toBe("processing");
    });

    test("should return pending when no matching transaction found", async () => {
      const mockMetadata = {
        paymentAddress: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
        usdtAmount: 100,
        createdAt: Date.now() - 60000,
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          "usdt-tx-123": { metadata: mockMetadata },
        }),
      );

      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            status: "1",
            result: [],
          }),
      });

      const status = await provider.verify("usdt-tx-123");

      expect(status).toBe("pending");
    });

    test("should return failed when metadata not found", async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const status = await provider.verify("usdt-tx-123");

      expect(status).toBe("failed");
    });

    test("should handle Etherscan API error", async () => {
      const mockMetadata = {
        paymentAddress: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
        usdtAmount: 100,
        createdAt: Date.now() - 60000,
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          "usdt-tx-123": { metadata: mockMetadata },
        }),
      );

      (fetch as jest.Mock).mockRejectedValue(new Error("API Error"));

      const status = await provider.verify("usdt-tx-123");

      expect(status).toBe("failed");
    });

    test("should ignore amount differences within tolerance", async () => {
      const mockMetadata = {
        paymentAddress: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
        usdtAmount: 100,
        createdAt: Date.now() - 60000,
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          "usdt-tx-123": { metadata: mockMetadata },
        }),
      );

      // Transação com valor ligeiramente diferente (dentro da tolerância)
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "1",
              result: [
                {
                  hash: "0xabc123",
                  from: "0x123",
                  to: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
                  value: "100500000", // 100.5 USDT (diferença de 0.5)
                  blockNumber: "18000000",
                  timeStamp: (Date.now() / 1000).toString(),
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "0x112a880",
            }),
        });

      const status = await provider.verify("usdt-tx-123");

      expect(status).toBe("completed");
    });
  });

  describe("cancel", () => {
    test("should return false as USDT does not support cancellation", async () => {
      const result = await provider.cancel("usdt-tx-123");
      expect(result).toBe(false);
    });
  });

  describe("Currency Conversion", () => {
    test("should convert BRL to USDT using direct rate", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(275, "plan-1", "user-1");

      expect(result.amount).toBeCloseTo(50, 1);
      expect(result.metadata.originalAmount).toBe(275);
      expect(result.metadata.originalCurrency).toBe("BRL");
    });

    test("should fallback to USD rate when USDT rate unavailable", async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: false,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ usd: { brl: 5.0 } }),
        });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(250, "plan-1", "user-1");

      expect(result.amount).toBeCloseTo(50, 1);
    });
  });

  describe("Payment Monitoring", () => {
    test("should monitor payment status changes", async () => {
      const mockMetadata = {
        paymentAddress: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
        usdtAmount: 100,
        createdAt: Date.now() - 60000,
      };

      localStorageMock.getItem.mockReturnValue(
        JSON.stringify({
          "usdt-tx-123": { metadata: mockMetadata },
        }),
      );

      // Primeiro retorna pending, depois completed
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ status: "1", result: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              status: "1",
              result: [
                {
                  hash: "0xabc123",
                  from: "0x123",
                  to: "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
                  value: "100000000",
                  blockNumber: "18000000",
                  timeStamp: (Date.now() / 1000).toString(),
                },
              ],
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "0x112a880",
            }),
        });

      const onStatusChange = jest.fn();

      provider.startPaymentMonitoring("usdt-tx-123", onStatusChange);

      // Avançar tempo para primeira verificação
      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      expect(onStatusChange).toHaveBeenCalledWith("pending");

      // Avançar tempo para segunda verificação
      jest.advanceTimersByTime(30000);
      await Promise.resolve();

      expect(onStatusChange).toHaveBeenCalledWith("completed");
    });
  });

  describe("USDT Balance", () => {
    test("should get USDT balance correctly", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            jsonrpc: "2.0",
            id: 1,
            result: "0x5f5e100", // 100000000 em hex (100 USDT)
          }),
      });

      const balance = await provider.getUSDTBalance(
        "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
      );

      expect(balance).toBe(100);
    });

    test("should return 0 on balance query error", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("RPC Error"));

      const balance = await provider.getUSDTBalance(
        "0x742d35Cc6634C0532925a3b8D4C0C1b8b8C8C8C8",
      );

      expect(balance).toBe(0);
    });
  });

  describe("Network Info", () => {
    test("should get network information", async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "0x112a880", // Block number
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "0x4a817c800", // Gas price
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              jsonrpc: "2.0",
              id: 1,
              result: "1", // Network ID
            }),
        });

      const networkInfo = await provider.getNetworkInfo();

      expect(networkInfo).toEqual({
        blockNumber: 18000000,
        gasPrice: "0x4a817c800",
        networkId: 1,
      });
    });

    test("should handle network info error", async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      const networkInfo = await provider.getNetworkInfo();

      expect(networkInfo).toEqual({
        blockNumber: 0,
        gasPrice: "0x0",
        networkId: 1,
      });
    });
  });

  describe("Wei Conversion", () => {
    test("should convert to wei correctly", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(550, "plan-1", "user-1");

      // QR code deve conter o valor em wei (100 USDT = 100000000 com 6 decimais)
      expect(result.qrCode).toContain("uint256=100000000");
    });

    test("should handle fractional amounts correctly", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(275, "plan-1", "user-1"); // 50 USDT

      expect(result.qrCode).toContain("uint256=50000000");
    });
  });

  describe("Address Generation", () => {
    test("should generate valid Ethereum address format", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(100, "plan-1", "user-1");

      expect(result.paymentAddress).toMatch(/^0x[a-f0-9]{40}$/);
    });

    test("should include contract address in QR code", async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ tether: { brl: 5.5 } }),
      });

      const mockHashBuffer = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        .buffer;
      (global.crypto.subtle.digest as jest.Mock).mockResolvedValue(
        mockHashBuffer,
      );

      const result = await provider.process(100, "plan-1", "user-1");

      expect(result.qrCode).toContain(
        "address=0xdAC17F958D2ee523a2206206994597C13D831ec7",
      );
    });
  });
});
