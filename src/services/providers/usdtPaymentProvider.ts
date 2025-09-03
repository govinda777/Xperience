import {
  PaymentProviderInterface,
  PaymentResult,
  PaymentStatus,
  PaymentCurrency,
} from "../../types/payment";
import { PAYMENT_CONFIG, PAYMENT_CONSTANTS } from "../../config/payment";

// Tipos específicos para USDT/Ethereum
interface EthereumAddress {
  address: string;
  privateKey?: string;
}

interface USDTTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  confirmations: number;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
}

interface EthereumRPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

// ABI mínimo do contrato USDT (ERC-20)
const USDT_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
];

export class USDTPaymentProvider implements PaymentProviderInterface {
  id = "usdt" as const;
  name = "USDT (Tether)";
  type = "crypto" as const;
  supportedCurrencies: PaymentCurrency[] = ["USDT"];

  private rpcUrl: string;
  private contractAddress: string;
  private apiKey: string;
  private networkId: number;

  constructor() {
    this.rpcUrl =
      process.env.ETHEREUM_RPC_URL ||
      "https://mainnet.infura.io/v3/YOUR_PROJECT_ID";
    this.contractAddress = PAYMENT_CONSTANTS.CONTRACTS.USDT_ETHEREUM;
    this.apiKey = PAYMENT_CONFIG.privy.appId;
    this.networkId = PAYMENT_CONSTANTS.NETWORKS.ETHEREUM_MAINNET;

    if (!this.apiKey) {
      throw new Error("Privy App ID não configurado para USDT");
    }
  }

  /**
   * Processa um pagamento USDT
   */
  async process(
    amount: number,
    planId: string,
    userId: string,
  ): Promise<PaymentResult> {
    try {
      // Converter BRL para USDT
      const usdtAmount = await this.convertToUSDT(amount);

      // Gerar endereço de pagamento único
      const paymentAddress = await this.generatePaymentAddress(userId, planId);

      // Criar transação ID único
      const transactionId = `usdt-${userId}-${planId}-${Date.now()}`;

      // Definir expiração (1 hora para USDT)
      const expirationDate = new Date(
        Date.now() + PAYMENT_CONSTANTS.CRYPTO_TIMEOUT,
      );

      // Gerar QR Code para pagamento USDT
      const qrCode = `ethereum:${paymentAddress.address}@${this.networkId}/transfer?address=${this.contractAddress}&uint256=${this.toWei(usdtAmount, 6)}`;

      return {
        transactionId,
        paymentAddress: paymentAddress.address,
        qrCode,
        amount: usdtAmount,
        currency: "USDT",
        expiresAt: expirationDate,
        metadata: {
          originalAmount: amount,
          originalCurrency: "BRL",
          usdtAmount,
          paymentAddress: paymentAddress.address,
          contractAddress: this.contractAddress,
          networkId: this.networkId,
          userId,
          planId,
        },
      };
    } catch (error) {
      console.error("Erro ao processar pagamento USDT:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      throw new Error(`Falha ao processar pagamento USDT: ${errorMessage}`);
    }
  }

  /**
   * Verifica o status de um pagamento USDT
   */
  async verify(transactionId: string): Promise<PaymentStatus> {
    try {
      // Extrair informações do transactionId
      const metadata = await this.getTransactionMetadata(transactionId);
      if (!metadata || !metadata.paymentAddress) {
        return "failed";
      }

      // Verificar transações USDT no endereço
      const transactions = await this.getUSDTTransactions(
        metadata.paymentAddress,
      );

      // Procurar por transação com o valor esperado
      const expectedAmount = metadata.usdtAmount;
      const matchingTx = transactions.find((tx) => {
        const txAmount = this.fromWei(tx.value, 6);
        return (
          Math.abs(txAmount - expectedAmount) < 0.01 && // Tolerância de 1 centavo
          tx.timestamp > metadata.createdAt
        );
      });

      if (!matchingTx) {
        return "pending";
      }

      // Verificar confirmações (Ethereum requer pelo menos 12 confirmações)
      if (matchingTx.confirmations >= 12) {
        return "completed";
      } else if (matchingTx.confirmations > 0) {
        return "processing";
      }

      return "pending";
    } catch (error) {
      console.error("Erro ao verificar pagamento USDT:", error);
      return "failed";
    }
  }

  /**
   * Cancela um pagamento USDT (não é possível cancelar transações blockchain)
   */
  async cancel(transactionId: string): Promise<boolean> {
    // Ethereum/USDT não permite cancelamento de transações
    return false;
  }

  /**
   * Converte BRL para USDT usando API de cotação
   */
  private async convertToUSDT(brlAmount: number): Promise<number> {
    try {
      // Primeiro converter BRL para USD
      const usdResponse = await fetch(
        `${PAYMENT_CONSTANTS.COINGECKO_API}/simple/price?ids=usd&vs_currencies=brl`,
      );

      if (!usdResponse.ok) {
        // Fallback: usar cotação direta USDT/BRL
        const usdtResponse = await fetch(
          `${PAYMENT_CONSTANTS.COINGECKO_API}/simple/price?ids=tether&vs_currencies=brl`,
        );

        if (!usdtResponse.ok) {
          throw new Error("Erro ao buscar cotação USDT");
        }

        const usdtData = await usdtResponse.json();
        const usdtPriceBRL = usdtData.tether.brl;

        if (!usdtPriceBRL) {
          throw new Error("Cotação USDT não disponível");
        }

        return brlAmount / usdtPriceBRL;
      }

      // Usar cotação USD como proxy para USDT (são praticamente equivalentes)
      const usdData = await usdResponse.json();
      const usdPriceBRL = usdData.usd?.brl || 5.0; // Fallback aproximado

      return brlAmount / usdPriceBRL;
    } catch (error) {
      console.error("Erro ao converter BRL para USDT:", error);
      throw new Error("Falha na conversão de moeda");
    }
  }

  /**
   * Gera um endereço de pagamento Ethereum único
   */
  private async generatePaymentAddress(
    userId: string,
    planId: string,
  ): Promise<EthereumAddress> {
    try {
      // Para demonstração, vamos gerar um endereço determinístico
      // Em produção, isso deveria usar uma carteira HD ou API do Privy
      const seed = `${userId}-${planId}-${Date.now()}`;
      const hash = await this.generateHash(seed);

      // Simular geração de endereço Ethereum
      const address = this.generateEthereumAddress(hash);

      return {
        address,
        // Não armazenar chaves privadas em produção
      };
    } catch (error) {
      console.error("Erro ao gerar endereço Ethereum:", error);
      throw new Error("Falha ao gerar endereço de pagamento");
    }
  }

  /**
   * Gera hash SHA-256
   */
  private async generateHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Gera endereço Ethereum a partir de hash (simulação)
   */
  private generateEthereumAddress(hash: string): string {
    // Esta é uma simulação - em produção, usar biblioteca Ethereum apropriada
    return `0x${hash.substring(0, 40)}`;
  }

  /**
   * Busca transações USDT de um endereço
   */
  private async getUSDTTransactions(
    address: string,
  ): Promise<USDTTransaction[]> {
    try {
      // Usar Etherscan API para buscar transações ERC-20
      const apiKey = process.env.ETHERSCAN_API_KEY || "YourApiKeyToken";
      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${this.contractAddress}&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`,
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar transações USDT");
      }

      const data = await response.json();

      if (data.status !== "1") {
        return [];
      }

      const currentBlock = await this.getCurrentBlockNumber();

      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        blockNumber: parseInt(tx.blockNumber),
        confirmations: currentBlock - parseInt(tx.blockNumber),
        timestamp: parseInt(tx.timeStamp),
        status: parseInt(tx.blockNumber) > 0 ? "confirmed" : "pending",
      }));
    } catch (error) {
      console.error("Erro ao buscar transações USDT:", error);
      return [];
    }
  }

  /**
   * Obtém o número do bloco atual
   */
  private async getCurrentBlockNumber(): Promise<number> {
    try {
      const response = await this.makeRPCCall("eth_blockNumber", []);
      return parseInt(response.result, 16);
    } catch (error) {
      console.error("Erro ao buscar número do bloco:", error);
      return 0;
    }
  }

  /**
   * Faz chamada RPC para Ethereum
   */
  private async makeRPCCall(
    method: string,
    params: any[],
  ): Promise<EthereumRPCResponse> {
    const response = await fetch(this.rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro na chamada RPC");
    }

    return await response.json();
  }

  /**
   * Converte valor para Wei (considerando decimais do USDT = 6)
   */
  private toWei(amount: number, decimals: number = 6): string {
    const multiplier = Math.pow(10, decimals);
    return Math.floor(amount * multiplier).toString();
  }

  /**
   * Converte valor de Wei para número
   */
  private fromWei(weiAmount: string, decimals: number = 6): number {
    const divisor = Math.pow(10, decimals);
    return parseInt(weiAmount) / divisor;
  }

  /**
   * Obtém metadados de uma transação armazenados localmente
   */
  private async getTransactionMetadata(transactionId: string): Promise<any> {
    try {
      const stored = localStorage.getItem("xperience_payments");
      if (!stored) return null;

      const payments = JSON.parse(stored);
      const payment = payments[transactionId];

      return payment?.metadata;
    } catch (error) {
      console.error("Erro ao buscar metadados:", error);
      return null;
    }
  }

  /**
   * Monitora pagamentos USDT em tempo real
   */
  async startPaymentMonitoring(
    transactionId: string,
    onStatusChange: (status: PaymentStatus) => void,
  ): Promise<void> {
    const checkPayment = async () => {
      try {
        const status = await this.verify(transactionId);
        onStatusChange(status);

        // Se completado ou falhou, parar monitoramento
        if (status === "completed" || status === "failed") {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Erro no monitoramento USDT:", error);
      }
    };

    // Verificar a cada 30 segundos
    const interval = setInterval(
      checkPayment,
      PAYMENT_CONSTANTS.CRYPTO_POLLING_INTERVAL,
    );

    // Verificação inicial
    checkPayment();

    // Limpar após timeout
    setTimeout(() => {
      clearInterval(interval);
      onStatusChange("expired");
    }, PAYMENT_CONSTANTS.CRYPTO_TIMEOUT);
  }

  /**
   * Obtém saldo USDT de um endereço
   */
  async getUSDTBalance(address: string): Promise<number> {
    try {
      // Chamar função balanceOf do contrato USDT
      const data = this.encodeBalanceOfCall(address);
      const response = await this.makeRPCCall("eth_call", [
        {
          to: this.contractAddress,
          data,
        },
        "latest",
      ]);

      if (response.result) {
        const balance = parseInt(response.result, 16);
        return this.fromWei(balance.toString(), 6);
      }

      return 0;
    } catch (error) {
      console.error("Erro ao buscar saldo USDT:", error);
      return 0;
    }
  }

  /**
   * Codifica chamada para função balanceOf
   */
  private encodeBalanceOfCall(address: string): string {
    // Function selector para balanceOf(address): 0x70a08231
    const functionSelector = "0x70a08231";
    // Remover 0x do endereço e pad para 32 bytes
    const paddedAddress = address.replace("0x", "").padStart(64, "0");
    return functionSelector + paddedAddress;
  }

  /**
   * Obtém informações da rede Ethereum
   */
  async getNetworkInfo(): Promise<{
    blockNumber: number;
    gasPrice: string;
    networkId: number;
  }> {
    try {
      const [blockNumber, gasPrice, networkId] = await Promise.all([
        this.makeRPCCall("eth_blockNumber", []),
        this.makeRPCCall("eth_gasPrice", []),
        this.makeRPCCall("net_version", []),
      ]);

      return {
        blockNumber: parseInt(blockNumber.result, 16),
        gasPrice: gasPrice.result,
        networkId: parseInt(networkId.result),
      };
    } catch (error) {
      console.error("Erro ao buscar info da rede:", error);
      return {
        blockNumber: 0,
        gasPrice: "0x0",
        networkId: this.networkId,
      };
    }
  }
}
