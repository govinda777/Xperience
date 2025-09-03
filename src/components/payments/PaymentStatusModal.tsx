import React, { useState } from "react";
import {
  PaymentResult,
  PaymentStatus,
  PaymentProvider,
} from "../../types/payment";

interface PaymentStatusModalProps {
  payment: PaymentResult;
  status: PaymentStatus;
  method: PaymentProvider;
  onClose: () => void;
  onCancel: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  payment,
  status,
  method,
  onClose,
  onCancel,
}) => {
  const [showQRCode, setShowQRCode] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Copiar endereço para clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  // Configurações por método de pagamento
  const methodConfig = {
    pix: {
      title: "Pagamento PIX",
      icon: "🏦",
      color: "green",
      instructions:
        "Escaneie o QR Code com seu app bancário ou copie o código PIX",
    },
    bitcoin: {
      title: "Pagamento Bitcoin",
      icon: "₿",
      color: "orange",
      instructions: "Envie Bitcoin para o endereço abaixo",
    },
    usdt: {
      title: "Pagamento USDT",
      icon: "💰",
      color: "green",
      instructions: "Envie USDT para o endereço abaixo",
    },
  };

  const config = methodConfig[method as keyof typeof methodConfig];

  // Status do pagamento
  const getStatusInfo = () => {
    switch (status) {
      case "pending":
        return {
          icon: "⏳",
          title: "Aguardando Pagamento",
          description: "Realize o pagamento para continuar",
          color: "yellow",
        };
      case "processing":
        return {
          icon: "🔄",
          title: "Processando Pagamento",
          description: "Seu pagamento está sendo confirmado",
          color: "blue",
        };
      case "completed":
        return {
          icon: "✅",
          title: "Pagamento Confirmado!",
          description: "Seu acesso foi liberado com sucesso",
          color: "green",
        };
      case "failed":
        return {
          icon: "❌",
          title: "Pagamento Falhou",
          description: "Houve um problema com seu pagamento",
          color: "red",
        };
      case "expired":
        return {
          icon: "⏰",
          title: "Pagamento Expirado",
          description: "O tempo limite para pagamento foi excedido",
          color: "gray",
        };
      default:
        return {
          icon: "⏳",
          title: "Aguardando",
          description: "Preparando pagamento...",
          color: "gray",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{config.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {config.title}
                </h2>
                <p className="text-sm text-gray-600">
                  ID: {payment.transactionId.slice(-8)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">{statusInfo.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-800">
                {statusInfo.title}
              </h3>
              <p className="text-sm text-gray-600">{statusInfo.description}</p>
            </div>
          </div>

          {status === "processing" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-blue-800">
                  {method === "pix"
                    ? "Confirmando pagamento PIX..."
                    : "Aguardando confirmações na blockchain..."}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Conteúdo do pagamento */}
        {(status === "pending" || status === "processing") && (
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">{config.instructions}</p>

            {/* Valor */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Valor a pagar:</span>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {method === "pix"
                      ? `R$ ${payment.amount.toFixed(2)}`
                      : method === "bitcoin"
                        ? `₿ ${payment.amount.toFixed(8)}`
                        : `$${payment.amount.toFixed(2)} USDT`}
                  </div>
                  {method !== "pix" && (
                    <div className="text-xs text-gray-500">
                      ≈ R$ {payment.metadata?.originalAmount?.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code */}
            {payment.qrCodeBase64 && showQRCode && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    QR Code:
                  </span>
                  <button
                    onClick={() => setShowQRCode(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Ocultar
                  </button>
                </div>
                <div className="flex justify-center p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <img
                    src={`data:image/png;base64,${payment.qrCodeBase64}`}
                    alt="QR Code"
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}

            {/* Endereço/Código */}
            {(payment.paymentAddress || payment.qrCode) && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {method === "pix" ? "Código PIX:" : "Endereço:"}
                  </span>
                  {!showQRCode && payment.qrCodeBase64 && (
                    <button
                      onClick={() => setShowQRCode(true)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mostrar QR Code
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={payment.paymentAddress || payment.qrCode || ""}
                    readOnly
                    className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(
                        payment.paymentAddress || payment.qrCode || "",
                      )
                    }
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${
                        copiedAddress
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }
                    `}
                  >
                    {copiedAddress ? "✓ Copiado" : "Copiar"}
                  </button>
                </div>
              </div>
            )}

            {/* Tempo restante */}
            {payment.expiresAt && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⏰</span>
                  <span className="text-sm text-yellow-800">
                    Expira em:{" "}
                    {new Date(payment.expiresAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            )}

            {/* Instruções específicas */}
            {method === "bitcoin" && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Importante:</strong> Envie exatamente ₿{" "}
                  {payment.amount.toFixed(8)}. A confirmação pode levar de 10 a
                  30 minutos.
                </p>
              </div>
            )}

            {method === "usdt" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Rede:</strong>{" "}
                  {payment.metadata?.networkId === 1 ? "Ethereum" : "Polygon"}
                  <br />
                  <strong>Valor:</strong> Exatamente $
                  {payment.amount.toFixed(2)} USDT
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagamento concluído */}
        {status === "completed" && (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-green-600 mb-2">
              Pagamento Confirmado!
            </h3>
            <p className="text-gray-600 mb-4">
              Seu acesso foi liberado com sucesso. Você já pode começar a usar
              todos os recursos do seu plano.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Pagamento falhou ou expirou */}
        {(status === "failed" || status === "expired") && (
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">
              {status === "failed" ? "❌" : "⏰"}
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">
              {status === "failed" ? "Pagamento Falhou" : "Pagamento Expirado"}
            </h3>
            <p className="text-gray-600 mb-4">
              {status === "failed"
                ? "Houve um problema com seu pagamento. Tente novamente ou escolha outro método."
                : "O tempo limite para pagamento foi excedido. Você pode tentar novamente."}
            </p>
            <div className="space-y-2">
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={onCancel}
                className="w-full py-2 px-6 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Botões de ação (apenas para pagamentos pendentes/processando) */}
        {(status === "pending" || status === "processing") && (
          <div className="p-6 border-t border-gray-200 space-y-2">
            <button
              onClick={onCancel}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar Pagamento
            </button>
            <p className="text-xs text-gray-500 text-center">
              Você pode fechar esta janela e o pagamento continuará sendo
              monitorado
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
