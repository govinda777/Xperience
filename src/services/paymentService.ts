import {
  PaymentProvider,
  PaymentProviderInterface,
  PaymentResult,
  PaymentStatus,
  PaymentState,
  PaymentCurrency,
  CurrencyConversion,
  PaymentError,
} from "../types/payment";

export class PaymentService {
  private providers: Map<PaymentProvider, PaymentProviderInterface> = new Map();
  private exchangeRates: Map<string, CurrencyConversion> = new Map();

  constructor() {
    this.loadExchangeRates();
  }

  /**
   * Registra um provedor de pagamento
   */
  registerProvider(provider: PaymentProviderInterface): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Obtém todos os provedores disponíveis
   */
  getAvailableProviders(): PaymentProviderInterface[] {
    return Array.from(this.providers.values());
  }

  /**
   * Obtém um provedor específico
   */
  getProvider(
    providerId: PaymentProvider,
  ): PaymentProviderInterface | undefined {
    return this.providers.get(providerId);
  }

  /**
   * Processa um pagamento usando o provedor especificado
   */
  async processPayment(
    providerId: PaymentProvider,
    amount: number,
    currency: PaymentCurrency,
    planId: string,
    userId: string,
  ): Promise<PaymentResult> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new PaymentError({
        code: "PROVIDER_NOT_FOUND",
        message: `Provedor ${providerId} não encontrado`,
        provider: providerId,
      });
    }

    try {
      // Converter moeda se necessário
      const convertedAmount = await this.convertCurrency(
        amount,
        "BRL",
        currency,
      );

      // Processar pagamento
      const result = await provider.process(convertedAmount, planId, userId);

      // Salvar estado do pagamento
      await this.savePaymentState({
        id: result.transactionId,
        planId,
        userId,
        amount: convertedAmount,
        currency,
        provider: providerId,
        status: "pending",
        metadata: result.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: result.expiresAt,
      });

      return result;
    } catch (error) {
      console.error(`Erro ao processar pagamento ${providerId}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      throw new PaymentError({
        code: "PAYMENT_PROCESSING_ERROR",
        message: `Erro ao processar pagamento: ${errorMessage}`,
        provider: providerId,
        details: { originalError: error },
      });
    }
  }

  /**
   * Verifica o status de um pagamento
   */
  async verifyPayment(
    providerId: PaymentProvider,
    transactionId: string,
  ): Promise<PaymentStatus> {
    const provider = this.getProvider(providerId);
    if (!provider) {
      throw new PaymentError({
        code: "PROVIDER_NOT_FOUND",
        message: `Provedor ${providerId} não encontrado`,
        provider: providerId,
        transactionId,
      });
    }

    try {
      const status = await provider.verify(transactionId);

      // Atualizar estado do pagamento
      await this.updatePaymentStatus(transactionId, status);

      return status;
    } catch (error) {
      console.error(`Erro ao verificar pagamento ${transactionId}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      throw new PaymentError({
        code: "PAYMENT_VERIFICATION_ERROR",
        message: `Erro ao verificar pagamento: ${errorMessage}`,
        provider: providerId,
        transactionId,
        details: { originalError: error },
      });
    }
  }

  /**
   * Cancela um pagamento (se suportado pelo provedor)
   */
  async cancelPayment(
    providerId: PaymentProvider,
    transactionId: string,
  ): Promise<boolean> {
    const provider = this.getProvider(providerId);
    if (!provider || !provider.cancel) {
      return false;
    }

    try {
      const cancelled = await provider.cancel(transactionId);
      if (cancelled) {
        await this.updatePaymentStatus(transactionId, "cancelled");
      }
      return cancelled;
    } catch (error) {
      console.error(`Erro ao cancelar pagamento ${transactionId}:`, error);
      return false;
    }
  }

  /**
   * Converte valores entre moedas
   */
  async convertCurrency(
    amount: number,
    from: PaymentCurrency,
    to: PaymentCurrency,
  ): Promise<number> {
    if (from === to) return amount;

    const conversionKey = `${from}_${to}`;
    const conversion = this.exchangeRates.get(conversionKey);

    if (!conversion || this.isExchangeRateExpired(conversion)) {
      await this.updateExchangeRate(from, to);
      const updatedConversion = this.exchangeRates.get(conversionKey);
      if (!updatedConversion) {
        throw new Error(`Taxa de câmbio não disponível para ${from} -> ${to}`);
      }
      return amount * updatedConversion.rate;
    }

    return amount * conversion.rate;
  }

  /**
   * Carrega taxas de câmbio das APIs
   */
  private async loadExchangeRates(): Promise<void> {
    try {
      // Carregar BTC/BRL
      await this.updateExchangeRate("BRL", "BTC");

      // Carregar USDT/BRL
      await this.updateExchangeRate("BRL", "USDT");

      // Carregar BTC/USDT
      await this.updateExchangeRate("BTC", "USDT");
    } catch (error) {
      console.error("Erro ao carregar taxas de câmbio:", error);
    }
  }

  /**
   * Atualiza uma taxa de câmbio específica
   */
  private async updateExchangeRate(
    from: PaymentCurrency,
    to: PaymentCurrency,
  ): Promise<void> {
    try {
      let rate: number;

      if (from === "BRL" && to === "BTC") {
        // BRL para BTC via CoinGecko
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl",
        );
        const data = await response.json();
        rate = 1 / data.bitcoin.brl; // Inverter para obter BTC por BRL
      } else if (from === "BRL" && to === "USDT") {
        // BRL para USDT via CoinGecko
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=brl",
        );
        const data = await response.json();
        rate = 1 / data.tether.brl; // Inverter para obter USDT por BRL
      } else if (from === "BTC" && to === "USDT") {
        // BTC para USDT
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        );
        const data = await response.json();
        rate = data.bitcoin.usd; // BTC em USD (aproximadamente USDT)
      } else {
        throw new Error(`Conversão não suportada: ${from} -> ${to}`);
      }

      const conversion: CurrencyConversion = {
        from,
        to,
        rate,
        timestamp: new Date(),
      };

      this.exchangeRates.set(`${from}_${to}`, conversion);

      // Também salvar a conversão inversa
      const inverseConversion: CurrencyConversion = {
        from: to,
        to: from,
        rate: 1 / rate,
        timestamp: new Date(),
      };

      this.exchangeRates.set(`${to}_${from}`, inverseConversion);
    } catch (error) {
      console.error(`Erro ao atualizar taxa ${from}->${to}:`, error);
      throw error;
    }
  }

  /**
   * Verifica se uma taxa de câmbio está expirada (mais de 5 minutos)
   */
  private isExchangeRateExpired(conversion: CurrencyConversion): boolean {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    return conversion.timestamp < fiveMinutesAgo;
  }

  /**
   * Salva o estado de um pagamento (usando localStorage por enquanto)
   */
  private async savePaymentState(payment: PaymentState): Promise<void> {
    try {
      const payments = this.getStoredPayments();
      payments[payment.id] = payment;
      localStorage.setItem("xperience_payments", JSON.stringify(payments));
    } catch (error) {
      console.error("Erro ao salvar estado do pagamento:", error);
    }
  }

  /**
   * Atualiza o status de um pagamento
   */
  private async updatePaymentStatus(
    transactionId: string,
    status: PaymentStatus,
  ): Promise<void> {
    try {
      const payments = this.getStoredPayments();
      if (payments[transactionId]) {
        payments[transactionId].status = status;
        payments[transactionId].updatedAt = new Date();
        localStorage.setItem("xperience_payments", JSON.stringify(payments));
      }
    } catch (error) {
      console.error("Erro ao atualizar status do pagamento:", error);
    }
  }

  /**
   * Obtém pagamentos armazenados
   */
  private getStoredPayments(): Record<string, PaymentState> {
    try {
      const stored = localStorage.getItem("xperience_payments");
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Erro ao carregar pagamentos armazenados:", error);
      return {};
    }
  }

  /**
   * Obtém histórico de pagamentos de um usuário
   */
  async getPaymentHistory(userId: string): Promise<PaymentState[]> {
    const payments = this.getStoredPayments();
    return Object.values(payments)
      .filter((payment) => payment.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }

  /**
   * Obtém um pagamento específico
   */
  async getPayment(transactionId: string): Promise<PaymentState | null> {
    const payments = this.getStoredPayments();
    return payments[transactionId] || null;
  }
}

// Instância singleton do serviço de pagamentos
export const paymentService = new PaymentService();
