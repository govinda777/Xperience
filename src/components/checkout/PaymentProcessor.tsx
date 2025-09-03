import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useCart } from "../../contexts/CartContext";
import { PrivyPaymentProvider } from "../../services/providers/privyPaymentProvider";
import { PaymentResult, PaymentStatus } from "../../types/payment";
import { CustomerInfo, Address } from "../../types/cart";
import { formatCurrency } from "../../types/cart";
import { QRCodeSVG } from "qrcode.react";
import {
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface PaymentProcessorProps {
  paymentMethod: "pix" | "bitcoin" | "usdt" | "github";
  customerInfo: CustomerInfo;
  billingAddress?: Address;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  paymentMethod,
  customerInfo,
  billingAddress,
  onSuccess,
  onError,
  onCancel,
}) => {
  const { user } = usePrivy();
  const { cart, getCartSummary } = useCart();
  const summary = getCartSummary();

  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null,
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const paymentProvider = new PrivyPaymentProvider();

  // Iniciar processamento do pagamento
  useEffect(() => {
    if (!user || !cart) return;

    const processPayment = async () => {
      setIsProcessing(true);
      setError(null);

      try {
        let result: PaymentResult;

        switch (paymentMethod) {
          case "pix":
            result = await paymentProvider.processPixPayment(
              summary.total,
              cart.items[0]?.planId || "default",
              user.id,
              customerInfo,
            );
            break;
          case "bitcoin":
            result = await paymentProvider.processBitcoinPayment(
              summary.total,
              cart.items[0]?.planId || "default",
              user.id,
            );
            break;
          case "usdt":
            result = await paymentProvider.processUSDTPayment(
              summary.total,
              cart.items[0]?.planId || "default",
              user.id,
            );
            break;
          case "github":
            result = await paymentProvider.processGitHubPayment(
              summary.total,
              cart.items[0]?.planId || "default",
              user.id,
              user.github?.username || undefined,
            );
            break;
          default:
            throw new Error("Método de pagamento não suportado");
        }

        setPaymentResult(result);

        // Configurar timer se houver expiração
        if (result.expiresAt) {
          const expirationTime = result.expiresAt.getTime();
          const now = Date.now();
          setTimeRemaining(
            Math.max(0, Math.floor((expirationTime - now) / 1000)),
          );
        }

        // Iniciar verificação de status
        startStatusPolling(result.transactionId);
      } catch (err) {
        console.error("Erro ao processar pagamento:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        onError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [user, cart, paymentMethod, customerInfo]);

  // Timer para expiração
  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setPaymentStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  // Polling para verificar status do pagamento
  const startStatusPolling = (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const status = await paymentProvider.verify(transactionId);
        setPaymentStatus(status);

        if (status === "completed") {
          clearInterval(pollInterval);
          onSuccess(transactionId);
        } else if (
          status === "failed" ||
          status === "expired" ||
          status === "cancelled"
        ) {
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    }, 5000); // Verificar a cada 5 segundos

    // Limpar polling após 30 minutos
    setTimeout(
      () => {
        clearInterval(pollInterval);
      },
      30 * 60 * 1000,
    );
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "completed":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "failed":
      case "expired":
      case "cancelled":
        return <XCircle className="w-8 h-8 text-red-500" />;
      case "processing":
        return <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "completed":
        return "Pagamento confirmado com sucesso!";
      case "processing":
        return "Processando pagamento...";
      case "failed":
        return "Pagamento falhou. Tente novamente.";
      case "expired":
        return "Pagamento expirou. Inicie um novo pagamento.";
      case "cancelled":
        return "Pagamento cancelado.";
      default:
        return "Aguardando pagamento...";
    }
  };

  if (isProcessing) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">
            Processando pagamento...
          </h2>
          <p className="text-gray-600">
            Aguarde enquanto configuramos seu pagamento
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-red-600">
            Erro no Pagamento
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Status do Pagamento */}
      <div className="text-center mb-8">
        {getStatusIcon()}
        <h2 className="text-2xl font-bold mt-4 mb-2">{getStatusMessage()}</h2>
        {timeRemaining > 0 && paymentStatus === "pending" && (
          <p className="text-gray-600">
            Tempo restante:{" "}
            <span className="font-mono font-bold">
              {formatTime(timeRemaining)}
            </span>
          </p>
        )}
      </div>

      {/* Informações do Pagamento */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Detalhes do Pagamento</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Método:</span>
            <span className="font-medium capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Valor:</span>
            <span className="font-bold">
              {formatCurrency(paymentResult.amount, paymentResult.currency)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">ID da Transação:</span>
            <span className="font-mono text-sm">
              {paymentResult.transactionId}
            </span>
          </div>
        </div>
      </div>

      {/* Instruções específicas por método */}
      {paymentMethod === "pix" && paymentResult.qrCode && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Pagamento via PIX</h3>

          <div className="text-center mb-4">
            <QRCodeSVG
              value={paymentResult.qrCode}
              size={200}
              className="mx-auto"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código PIX (Copia e Cola):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentResult.qrCode}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() => copyToClipboard(paymentResult.qrCode!, "pix")}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied === "pix" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Como pagar:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra o app do seu banco</li>
                <li>2. Escaneie o QR Code ou cole o código PIX</li>
                <li>3. Confirme o pagamento</li>
                <li>4. Aguarde a confirmação automática</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "bitcoin" && paymentResult.paymentAddress && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Pagamento via Bitcoin</h3>

          <div className="text-center mb-4">
            <QRCodeSVG
              value={`bitcoin:${paymentResult.paymentAddress}?amount=${paymentResult.amount}`}
              size={200}
              className="mx-auto"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço Bitcoin:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentResult.paymentAddress}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() =>
                    copyToClipboard(paymentResult.paymentAddress!, "address")
                  }
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {copied === "address" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor em BTC:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={`${paymentResult.amount} BTC`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() =>
                    copyToClipboard(paymentResult.amount.toString(), "amount")
                  }
                  className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  {copied === "amount" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">Instruções:</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>
                  • Envie exatamente {paymentResult.amount} BTC para o endereço
                  acima
                </li>
                <li>• A confirmação pode levar de 10 minutos a 1 hora</li>
                <li>• Não envie de exchanges, use uma carteira pessoal</li>
                <li>• Verifique sempre o endereço antes de enviar</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "usdt" && paymentResult.paymentAddress && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Pagamento via USDT</h3>

          <div className="text-center mb-4">
            <QRCodeSVG
              value={paymentResult.paymentAddress}
              size={200}
              className="mx-auto"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço USDT ({paymentResult.metadata?.network || "Ethereum"}):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={paymentResult.paymentAddress}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <button
                  onClick={() =>
                    copyToClipboard(
                      paymentResult.paymentAddress!,
                      "usdt-address",
                    )
                  }
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {copied === "usdt-address" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Importante:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Envie apenas USDT para este endereço</li>
                <li>• Rede: {paymentResult.metadata?.network || "Ethereum"}</li>
                <li>• Valor: {paymentResult.amount} USDT</li>
                <li>• Confirmação em 1-5 minutos</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === "github" && paymentResult.paymentUrl && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            Pagamento via GitHub Sponsors
          </h3>

          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">
                Como proceder:
              </h4>
              <ol className="text-sm text-purple-800 space-y-1">
                <li>1. Clique no botão abaixo para ir ao GitHub Sponsors</li>
                <li>2. Escolha o tier de ${paymentResult.amount}/mês</li>
                <li>3. Complete o processo de sponsorship</li>
                <li>4. Retorne aqui para confirmação</li>
              </ol>
            </div>

            <div className="text-center">
              <a
                href={paymentResult.paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Ir para GitHub Sponsors
              </a>
            </div>

            {paymentResult.metadata?.instructions && (
              <div className="text-sm text-gray-600 text-center">
                {paymentResult.metadata.instructions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-4 justify-center">
        {paymentStatus === "pending" && (
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        )}

        {(paymentStatus === "failed" || paymentStatus === "expired") && (
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessor;
