import { 
  PaymentProviderInterface, 
  PaymentResult, 
  PaymentStatus, 
  PaymentCurrency 
} from '../../types/payment';
import { PAYMENT_CONFIG, PAYMENT_CONSTANTS } from '../../config/payment';

// Tipos específicos para Bitcoin
interface BitcoinAddress {
  address: string;
  privateKey?: string;
  publicKey?: string;
}

interface BitcoinTransaction {
  txid: string;
  confirmations: number;
  amount: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface BitcoinRPCResponse {
  result: any;
  error?: {
    code: number;
    message: string;
  };
}

export class BitcoinPaymentProvider implements PaymentProviderInterface {
  id = 'bitcoin' as const;
  name = 'Bitcoin';
  type = 'crypto' as const;
  supportedCurrencies: PaymentCurrency[] = ['BTC'];

  private rpcUrl: string;
  private apiKey: string;

  constructor() {
    this.rpcUrl = process.env.BITCOIN_RPC_URL || 'https://blockstream.info/api';
    this.apiKey = PAYMENT_CONFIG.privy.appId;

    if (!this.apiKey) {
      throw new Error('Privy App ID não configurado para Bitcoin');
    }
  }

  /**
   * Processa um pagamento Bitcoin
   */
  async process(amount: number, planId: string, userId: string): Promise<PaymentResult> {
    try {
      // Converter BRL para BTC
      const btcAmount = await this.convertToBTC(amount);
      
      // Gerar endereço de pagamento único
      const paymentAddress = await this.generatePaymentAddress(userId, planId);
      
      // Criar transação ID único
      const transactionId = `btc-${userId}-${planId}-${Date.now()}`;
      
      // Definir expiração (1 hora para Bitcoin)
      const expirationDate = new Date(Date.now() + PAYMENT_CONSTANTS.CRYPTO_TIMEOUT);

      // Gerar QR Code para pagamento Bitcoin
      const qrCode = `bitcoin:${paymentAddress.address}?amount=${btcAmount}&label=Xperience-${planId}`;

      return {
        transactionId,
        paymentAddress: paymentAddress.address,
        qrCode,
        amount: btcAmount,
        currency: 'BTC',
        expiresAt: expirationDate,
        metadata: {
          originalAmount: amount,
          originalCurrency: 'BRL',
          btcAmount,
          paymentAddress: paymentAddress.address,
          userId,
          planId
        }
      };
    } catch (error) {
      console.error('Erro ao processar pagamento Bitcoin:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Falha ao processar pagamento Bitcoin: ${errorMessage}`);
    }
  }

  /**
   * Verifica o status de um pagamento Bitcoin
   */
  async verify(transactionId: string): Promise<PaymentStatus> {
    try {
      // Extrair informações do transactionId
      const metadata = await this.getTransactionMetadata(transactionId);
      if (!metadata || !metadata.paymentAddress) {
        return 'failed';
      }

      // Verificar transações no endereço
      const transactions = await this.getAddressTransactions(metadata.paymentAddress);
      
      // Procurar por transação com o valor esperado
      const expectedAmount = metadata.btcAmount;
      const matchingTx = transactions.find(tx => 
        Math.abs(tx.amount - expectedAmount) < 0.00001 && // Tolerância para diferenças mínimas
        tx.timestamp > metadata.createdAt
      );

      if (!matchingTx) {
        return 'pending';
      }

      // Verificar confirmações
      if (matchingTx.confirmations >= 1) {
        return 'completed';
      } else if (matchingTx.confirmations === 0) {
        return 'processing';
      }

      return 'pending';
    } catch (error) {
      console.error('Erro ao verificar pagamento Bitcoin:', error);
      return 'failed';
    }
  }

  /**
   * Cancela um pagamento Bitcoin (não é possível cancelar, apenas marcar como expirado)
   */
  async cancel(transactionId: string): Promise<boolean> {
    // Bitcoin não permite cancelamento de transações
    // Apenas podemos marcar como expirado localmente
    return false;
  }

  /**
   * Converte BRL para BTC usando API de cotação
   */
  private async convertToBTC(brlAmount: number): Promise<number> {
    try {
      const response = await fetch(
        `${PAYMENT_CONSTANTS.COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=brl`
      );
      
      if (!response.ok) {
        throw new Error('Erro ao buscar cotação Bitcoin');
      }

      const data = await response.json();
      const btcPriceBRL = data.bitcoin.brl;
      
      if (!btcPriceBRL) {
        throw new Error('Cotação Bitcoin não disponível');
      }

      return brlAmount / btcPriceBRL;
    } catch (error) {
      console.error('Erro ao converter BRL para BTC:', error);
      throw new Error('Falha na conversão de moeda');
    }
  }

  /**
   * Gera um endereço de pagamento Bitcoin único
   */
  private async generatePaymentAddress(userId: string, planId: string): Promise<BitcoinAddress> {
    try {
      // Para demonstração, vamos gerar um endereço determinístico
      // Em produção, isso deveria usar uma carteira HD ou API do Privy
      const seed = `${userId}-${planId}-${Date.now()}`;
      const hash = await this.generateHash(seed);
      
      // Simular geração de endereço Bitcoin (em produção, usar biblioteca apropriada)
      const address = this.generateBitcoinAddress(hash);
      
      return {
        address,
        // Não armazenar chaves privadas em produção
      };
    } catch (error) {
      console.error('Erro ao gerar endereço Bitcoin:', error);
      throw new Error('Falha ao gerar endereço de pagamento');
    }
  }

  /**
   * Gera hash SHA-256
   */
  private async generateHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Gera endereço Bitcoin a partir de hash (simulação)
   */
  private generateBitcoinAddress(hash: string): string {
    // Esta é uma simulação - em produção, usar biblioteca Bitcoin apropriada
    // como bitcoinjs-lib ou similar
    const prefix = '1'; // Endereço P2PKH
    const addressPart = hash.substring(0, 25);
    return `${prefix}${addressPart}`;
  }

  /**
   * Busca transações de um endereço Bitcoin
   */
  private async getAddressTransactions(address: string): Promise<BitcoinTransaction[]> {
    try {
      // Usar API do Blockstream (gratuita)
      const response = await fetch(`https://blockstream.info/api/address/${address}/txs`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar transações');
      }

      const transactions = await response.json();
      
      return transactions.map((tx: any) => ({
        txid: tx.txid,
        confirmations: tx.status.confirmed ? tx.status.block_height : 0,
        amount: this.calculateReceivedAmount(tx, address),
        timestamp: tx.status.block_time || Date.now() / 1000,
        status: tx.status.confirmed ? 'confirmed' : 'pending'
      }));
    } catch (error) {
      console.error('Erro ao buscar transações Bitcoin:', error);
      return [];
    }
  }

  /**
   * Calcula valor recebido em uma transação
   */
  private calculateReceivedAmount(transaction: any, address: string): number {
    let receivedAmount = 0;
    
    // Somar outputs que vão para nosso endereço
    transaction.vout?.forEach((output: any) => {
      if (output.scriptpubkey_address === address) {
        receivedAmount += output.value / 100000000; // Converter satoshis para BTC
      }
    });
    
    return receivedAmount;
  }

  /**
   * Obtém metadados de uma transação armazenados localmente
   */
  private async getTransactionMetadata(transactionId: string): Promise<any> {
    try {
      const stored = localStorage.getItem('xperience_payments');
      if (!stored) return null;
      
      const payments = JSON.parse(stored);
      const payment = payments[transactionId];
      
      return payment?.metadata;
    } catch (error) {
      console.error('Erro ao buscar metadados:', error);
      return null;
    }
  }

  /**
   * Monitora pagamentos Bitcoin em tempo real
   */
  async startPaymentMonitoring(
    transactionId: string,
    onStatusChange: (status: PaymentStatus) => void
  ): Promise<void> {
    const checkPayment = async () => {
      try {
        const status = await this.verify(transactionId);
        onStatusChange(status);
        
        // Se completado ou falhou, parar monitoramento
        if (status === 'completed' || status === 'failed') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Erro no monitoramento Bitcoin:', error);
      }
    };

    // Verificar a cada 30 segundos
    const interval = setInterval(checkPayment, PAYMENT_CONSTANTS.CRYPTO_POLLING_INTERVAL);
    
    // Verificação inicial
    checkPayment();
    
    // Limpar após timeout
    setTimeout(() => {
      clearInterval(interval);
      onStatusChange('expired');
    }, PAYMENT_CONSTANTS.CRYPTO_TIMEOUT);
  }

  /**
   * Obtém informações de rede Bitcoin
   */
  async getNetworkInfo(): Promise<{
    blockHeight: number;
    difficulty: number;
    networkHashRate: number;
  }> {
    try {
      const response = await fetch('https://blockstream.info/api/blocks/tip/height');
      const blockHeight = await response.json();
      
      return {
        blockHeight,
        difficulty: 0, // Placeholder
        networkHashRate: 0 // Placeholder
      };
    } catch (error) {
      console.error('Erro ao buscar info da rede:', error);
      return {
        blockHeight: 0,
        difficulty: 0,
        networkHashRate: 0
      };
    }
  }

  /**
   * Calcula taxa de transação recomendada
   */
  async getRecommendedFee(): Promise<{
    slow: number;
    standard: number;
    fast: number;
  }> {
    try {
      const response = await fetch('https://blockstream.info/api/fee-estimates');
      const fees = await response.json();
      
      return {
        slow: fees['144'] || 1, // ~24 horas
        standard: fees['6'] || 5, // ~1 hora
        fast: fees['2'] || 10 // ~20 minutos
      };
    } catch (error) {
      console.error('Erro ao buscar taxas:', error);
      return {
        slow: 1,
        standard: 5,
        fast: 10
      };
    }
  }
}
