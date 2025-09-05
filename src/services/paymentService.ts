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
    const loadWithTimeout = async (from: PaymentCurrency, to: PaymentCurrency, timeout = 5000): Promise<void> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        await this.updateExchangeRate(from, to);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    try {
      // Tenta carregar cada taxa de câmbio independentemente
      // para que uma falha não impeça as outras de serem carregadas
      await Promise.allSettled([
        loadWithTimeout("BRL", "BTC").catch(error => 
          console.error("Erro ao carregar taxa BRL/BTC:", error)
        ),
        loadWithTimeout("BRL", "USDT").catch(error => 
          console.error("Erro ao carregar taxa BRL/USDT:", error)
        ),
        loadWithTimeout("BTC", "USDT").catch(error => 
          console.error("Erro ao carregar taxa BTC/USDT:", error)
        )
      ]);
      
      // Verifica se pelo menos uma taxa de câmbio foi carregada
      if (this.exchangeRates.size === 0) {
        throw new Error('Falha ao carregar todas as taxas de câmbio');
      }
    } catch (error) {
      console.error("Erro geral ao carregar taxas de câmbio:", error);
      // Não relançar o erro para não quebrar o fluxo principal
    }
  }

  /**
   * Atualiza uma taxa de câmbio específica
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    maxRetries = 3,
    retryDelay = 1000
  ): Promise<any> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers
          }
        });
        
        if (!response.ok) {
          // Se for erro 429 (Too Many Requests), espera um pouco antes de tentar novamente
          if (response.status === 429 && attempt < maxRetries) {
            const retryAfter = parseInt(response.headers.get('Retry-After') || '5');
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000 || retryDelay));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }
    
    throw lastError || new Error('Falha na requisição após várias tentativas');
  }

  private async updateExchangeRate(
    from: PaymentCurrency,
    to: PaymentCurrency,
  ): Promise<void> {
    try {
      let rate: number;
      let data: any;

      if (from === "BRL" && to === "BTC") {
        // BRL para BTC via CoinGecko
        data = await this.fetchWithRetry(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl"
        );
        
        if (!data) {
          throw new Error('Dados não retornados da API');
        }
        
        if (!data?.bitcoin?.brl) {
          throw new Error('Resposta da API em formato inesperado para BTC/BRL');
        }
        
        rate = 1 / data.bitcoin.brl; // Inverter para obter BTC por BRL
      } else if (from === "BRL" && to === "USDT") {
        // BRL para USDT via CoinGecko
        data = await this.fetchWithRetry(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=brl"
        );
        
        if (!data) {
          throw new Error('Dados não retornados da API');
        }
        
        if (!data?.tether?.brl) {
          throw new Error('Resposta da API em formato inesperado para USDT/BRL');
        }
        
        rate = 1 / data.tether.brl; // Inverter para obter USDT por BRL
      } else if (from === "BTC" && to === "USDT") {
        // BTC para USDT
        data = await this.fetchWithRetry(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        
        if (!data) {
          throw new Error('Dados não retornados da API');
        }
        
        if (!data?.bitcoin?.usd) {
          throw new Error('Resposta da API em formato inesperado para BTC/USD');
        }
        
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
