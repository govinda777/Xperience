import { GitHubPaymentProvider } from "../../../services/providers/githubPaymentProvider";
import { PaymentStatus } from "../../../types/payment";

describe("GitHubPaymentProvider", () => {
  let provider: GitHubPaymentProvider;

  beforeEach(() => {
    provider = new GitHubPaymentProvider("testuser");
  });

  describe("Configuração", () => {
    it("deve ter as propriedades corretas", () => {
      expect(provider.id).toBe("github");
      expect(provider.name).toBe("GitHub Pay");
      expect(provider.type).toBe("fiat");
      expect(provider.supportedCurrencies).toEqual(["USD"]);
    });

    it("deve validar configuração corretamente", () => {
      const validation = provider.validateConfiguration();
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("deve detectar configuração inválida", () => {
      const invalidProvider = new GitHubPaymentProvider("");
      const validation = invalidProvider.validateConfiguration();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain(
        "Nome de usuário do GitHub não configurado",
      );
    });

    it("deve detectar usuário inválido", () => {
      const invalidProvider = new GitHubPaymentProvider("example");
      const validation = invalidProvider.validateConfiguration();
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain("Nome de usuário do GitHub inválido");
    });
  });

  describe("Processamento de pagamento", () => {
    it("deve processar pagamento com sucesso", async () => {
      const result = await provider.process(100, "plan-1", "user-1");

      expect(result).toHaveProperty("transactionId");
      expect(result).toHaveProperty("paymentUrl");
      expect(result).toHaveProperty("amount");
      expect(result).toHaveProperty("currency", "USD");
      expect(result).toHaveProperty("metadata");

      expect(result.transactionId).toMatch(/^github-user-1-plan-1-\d+$/);
      expect(result.paymentUrl).toContain("github.com/sponsors/testuser");
      expect(result.amount).toBeGreaterThan(0);
    });

    it("deve converter BRL para USD corretamente", async () => {
      const result = await provider.process(550, "plan-1", "user-1"); // R$ 550 ≈ $99 USD

      // Valor mínimo de $1 USD
      expect(result.amount).toBeGreaterThanOrEqual(1);

      // Conversão aproximada (550 * 0.18 = 99)
      expect(result.amount).toBeCloseTo(99, 0);
    });

    it("deve garantir valor mínimo de $1 USD", async () => {
      const result = await provider.process(1, "plan-1", "user-1"); // R$ 1

      expect(result.amount).toBe(1); // Valor mínimo
    });

    it("deve incluir metadados corretos", async () => {
      const result = await provider.process(100, "plan-1", "user-1");

      expect(result.metadata).toHaveProperty("username", "testuser");
      expect(result.metadata).toHaveProperty("sponsorshipUrl");
      expect(result.metadata).toHaveProperty("amount");
      expect(result.metadata).toHaveProperty("frequency", "one-time");
      expect(result.metadata).toHaveProperty("planId", "plan-1");
      expect(result.metadata).toHaveProperty("userId", "user-1");
      expect(result.metadata).toHaveProperty("externalReference");
    });
  });

  describe("Verificação de pagamento", () => {
    it("deve retornar status pending por padrão", async () => {
      const status = await provider.verify("github-test-123");
      expect(status).toBe("pending");
    });

    it("deve lidar com erros na verificação", async () => {
      // Simular erro interno
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const status = await provider.verify("invalid-transaction");
      expect(status).toBe("failed");

      consoleSpy.mockRestore();
    });
  });

  describe("Cancelamento de pagamento", () => {
    it("deve retornar false para cancelamento", async () => {
      const result = await provider.cancel("github-test-123");
      expect(result).toBe(false);
    });
  });

  describe("Conversão de moeda", () => {
    it("deve converter USD para BRL corretamente", () => {
      const brlAmount = provider.convertUsdToBrl(10);
      expect(brlAmount).toBe(55); // 10 * 5.5 = 55
    });

    it("deve arredondar valores corretamente", () => {
      const brlAmount = provider.convertUsdToBrl(10.33);
      expect(brlAmount).toBe(56.82); // 10.33 * 5.5 = 56.815, arredondado para 56.82
    });
  });

  describe("Instruções de pagamento", () => {
    it("deve gerar instruções corretas", async () => {
      const paymentResult = await provider.process(100, "plan-1", "user-1");
      const instructions = provider.generatePaymentInstructions(paymentResult);

      expect(instructions).toHaveProperty("title");
      expect(instructions).toHaveProperty("steps");
      expect(instructions).toHaveProperty("notes");

      expect(instructions.title).toBe("Como pagar via GitHub Sponsors");
      expect(instructions.steps).toHaveLength(6);
      expect(instructions.notes).toHaveLength(5);

      // Verificar se contém informações importantes
      expect(instructions.notes.some((note) => note.includes("$"))).toBe(true);
      expect(instructions.notes.some((note) => note.includes("R$"))).toBe(true);
    });
  });

  describe("Perfil GitHub", () => {
    it("deve retornar informações do perfil", async () => {
      const profile = await provider.getGitHubProfile();

      expect(profile).toHaveProperty("username", "testuser");
      expect(profile).toHaveProperty("sponsorsUrl");
      expect(profile).toHaveProperty("isSponsorsEnabled", true);

      expect(profile.sponsorsUrl).toBe("https://github.com/sponsors/testuser");
    });
  });

  describe("Webhook", () => {
    it("deve processar webhook de criação de sponsorship", async () => {
      const payload = {
        action: "created",
        sponsorship: {
          node_id: "test-node-id",
          tier: {
            monthly_price_in_cents: 1000, // $10.00
          },
        },
      };

      const result = await provider.processWebhook(payload);

      expect(result).toHaveProperty("transactionId", "github-test-node-id");
      expect(result).toHaveProperty("status", "completed");
      expect(result).toHaveProperty("amount", 10);
    });

    it("deve processar webhook de cancelamento de sponsorship", async () => {
      const payload = {
        action: "cancelled",
        sponsorship: {
          node_id: "test-node-id",
        },
      };

      const result = await provider.processWebhook(payload);

      expect(result).toHaveProperty("transactionId", "github-test-node-id");
      expect(result).toHaveProperty("status", "cancelled");
    });

    it("deve rejeitar webhook com ação não suportada", async () => {
      const payload = {
        action: "unknown",
        sponsorship: {},
      };

      await expect(provider.processWebhook(payload)).rejects.toThrow(
        "Ação de webhook não suportada",
      );
    });

    it("deve lidar com erros no webhook", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      await expect(provider.processWebhook({})).rejects.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe("Geração de URL", () => {
    it("deve gerar URL do GitHub Sponsors corretamente", async () => {
      const result = await provider.process(100, "plan-1", "user-1");

      expect(result.paymentUrl).toContain(
        "github.com/sponsors/testuser/sponsorships",
      );
      expect(result.paymentUrl).toContain("sponsor=testuser");
      expect(result.paymentUrl).toContain("frequency=one-time");
      expect(result.paymentUrl).toContain("preview=true");
      expect(result.paymentUrl).toContain(`amount=${result.amount}`);
    });
  });

  describe("Tratamento de erros", () => {
    it("deve lidar com erros no processamento", async () => {
      // Simular erro forçando uma situação inválida
      const invalidProvider = new GitHubPaymentProvider("");

      await expect(
        invalidProvider.process(100, "plan-1", "user-1"),
      ).rejects.toThrow();
    });
  });
});
