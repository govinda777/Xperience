// Provedor de pagamentos integrado com Privy
import { PaymentProviderInterface, PaymentResult, PaymentStatus, PaymentCurrency } from '../../types/payment';
import { paymentConfig } from '../../config/privy';

export class PrivyPaymentProvider implements PaymentProviderInterface {
  id = 'privy' as const;
  name = 'Privy Payment Gateway';
  type = 'hybrid' as const;
  supportedCurrencies: PaymentCurrency[] = ['BRL', 'USD', 'BTC', 'USDT'];

  private apiUrl = process.env.VITE_API_URL || 'http://localhost:3001/api';

  async process(amount: number, planId: string, userId: string, method: 'pix' | 'bitcoin' | 'usdt' | 'github'): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planId,
          userId,
          method,
          provider: 'privy',
        }),
      });

      if (!response.ok) {
        throw new Error(`Payment creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.transactionId,
        paymentUrl: data.paymentUrl,
        paymentAddress: data.paymentAddress,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        amount: data.amount,
        currency: data.currency,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Erro ao processar pagamento via Privy:', error);
      throw error;
    }
  }

  async verify(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/${transactionId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      return 'failed';
    }
  }

  async cancel(transactionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/${transactionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      return false;
    }
  }

  // Método específico para PIX via Privy + Mercado Pago
  async processPixPayment(amount: number, planId: string, userId: string, customerInfo: any): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planId,
          userId,
          customerInfo,
          publicKey: paymentConfig.pix.publicKey,
          sandboxMode: paymentConfig.pix.sandboxMode,
        }),
      });

      if (!response.ok) {
        throw new Error(`PIX payment creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.id,
        paymentUrl: data.point_of_interaction?.transaction_data?.ticket_url,
        qrCode: data.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64,
        amount: data.transaction_amount,
        currency: 'BRL',
        expiresAt: data.date_of_expiration ? new Date(data.date_of_expiration) : undefined,
        metadata: {
          pixKey: data.point_of_interaction?.transaction_data?.qr_code,
          status: data.status,
        },
      };
    } catch (error) {
      console.error('Erro ao processar pagamento PIX:', error);
      throw error;
    }
  }

  // Método específico para Bitcoin via Privy
  async processBitcoinPayment(amount: number, planId: string, userId: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/bitcoin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planId,
          userId,
          network: paymentConfig.bitcoin.network,
        }),
      });

      if (!response.ok) {
        throw new Error(`Bitcoin payment creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.transactionId,
        paymentAddress: data.address,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        amount: data.amount,
        currency: 'BTC',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        metadata: {
          network: data.network,
          confirmationsRequired: data.confirmationsRequired || 1,
        },
      };
    } catch (error) {
      console.error('Erro ao processar pagamento Bitcoin:', error);
      throw error;
    }
  }

  // Método específico para USDT via Privy
  async processUSDTPayment(amount: number, planId: string, userId: string, network: 'ethereum' | 'polygon' = 'ethereum'): Promise<PaymentResult> {
    try {
      const contractAddress = network === 'polygon' 
        ? paymentConfig.usdt.polygonContractAddress 
        : paymentConfig.usdt.contractAddress;

      const response = await fetch(`${this.apiUrl}/payments/usdt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planId,
          userId,
          network,
          contractAddress,
          decimals: paymentConfig.usdt.decimals,
        }),
      });

      if (!response.ok) {
        throw new Error(`USDT payment creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.transactionId,
        paymentAddress: data.address,
        qrCode: data.qrCode,
        qrCodeBase64: data.qrCodeBase64,
        amount: data.amount,
        currency: 'USDT',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        metadata: {
          network: data.network,
          contractAddress: data.contractAddress,
          decimals: data.decimals,
        },
      };
    } catch (error) {
      console.error('Erro ao processar pagamento USDT:', error);
      throw error;
    }
  }

  // Método específico para GitHub Pay
  async processGitHubPayment(amount: number, planId: string, userId: string, githubUsername?: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planId,
          userId,
          githubUsername,
          clientId: paymentConfig.githubPay.clientId,
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub payment creation failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        transactionId: data.transactionId,
        paymentUrl: data.sponsorshipUrl,
        amount: data.amount,
        currency: 'USD',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        metadata: {
          githubUsername: data.githubUsername,
          sponsorshipTier: data.tier,
          instructions: data.instructions,
        },
      };
    } catch (error) {
      console.error('Erro ao processar pagamento GitHub:', error);
      throw error;
    }
  }

  // Método para obter taxas de conversão
  async getExchangeRates(): Promise<Record<string, number>> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/exchange-rates`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter taxas de câmbio:', error);
      // Retornar taxas padrão em caso de erro
      return {
        'BRL/USD': 0.20,
        'USD/BRL': 5.00,
        'BTC/USD': 45000,
        'USD/BTC': 0.000022,
        'USDT/USD': 1.00,
        'USD/USDT': 1.00,
      };
    }
  }

  // Método para converter valores entre moedas
  async convertAmount(amount: number, fromCurrency: PaymentCurrency, toCurrency: PaymentCurrency): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rates = await this.getExchangeRates();
    const rateKey = `${fromCurrency}/${toCurrency}`;
    const rate = rates[rateKey];

    if (!rate) {
      throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }

    return amount * rate;
  }

  // Método para validar endereço de carteira
  async validateWalletAddress(address: string, currency: PaymentCurrency): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/validate-address`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, currency }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.isValid;
    } catch (error) {
      console.error('Erro ao validar endereço:', error);
      return false;
    }
  }

  // Método para obter histórico de transações
  async getTransactionHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/payments/history/${userId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao obter histórico de transações:', error);
      return [];
    }
  }
}
