import React, { useState, useEffect } from "react";
import { PaymentResult, PaymentStatus } from "../../types/payment";
import { GitHubPaymentProvider } from "../../services/providers/githubPaymentProvider";

interface GitHubPaymentComponentProps {
  amount: number;
  planId: string;
  userId: string;
  onPaymentComplete: (result: PaymentResult) => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

interface GitHubPaymentMetadata {
  username: string;
  sponsorshipUrl: string;
  amount: number;
  frequency: string;
  planId: string;
  userId: string;
  externalReference: string;
}

export const GitHubPaymentComponent: React.FC<GitHubPaymentComponentProps> = ({
  amount,
  planId,
  userId,
  onPaymentComplete,
  onPaymentError,
  onCancel,
}) => {
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [instructions, setInstructions] = useState<{
    title: string;
    steps: string[];
    notes: string[];
  } | null>(null);
  const [githubProvider] = useState(() => new GitHubPaymentProvider());

  useEffect(() => {
    initializePayment();
  }, [amount, planId, userId]);

  const initializePayment = async () => {
    try {
      setIsLoading(true);

      // Validar configuração
      const validation = githubProvider.validateConfiguration();
      if (!validation.isValid) {
        throw new Error(
          `Configuração inválida: ${validation.errors.join(", ")}`,
        );
      }

      // Processar pagamento
      const result = await githubProvider.process(amount, planId, userId);
      setPaymentResult(result);

      // Gerar instruções
      const paymentInstructions =
        githubProvider.generatePaymentInstructions(result);
      setInstructions(paymentInstructions);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro ao inicializar pagamento GitHub";
      onPaymentError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayWithGitHub = () => {
    if (paymentResult?.paymentUrl) {
      // Abrir GitHub Sponsors em nova aba
      window.open(paymentResult.paymentUrl, "_blank", "noopener,noreferrer");

      // Marcar como processando
      setPaymentStatus("processing");

      // Simular verificação (em produção seria um polling ou webhook)
      setTimeout(() => {
        // Por enquanto, marcar como pendente para verificação manual
        setPaymentStatus("pending");
      }, 2000);
    }
  };

  const handleManualConfirmation = () => {
    if (paymentResult) {
      // Simular confirmação manual (em produção seria via admin panel)
      setPaymentStatus("completed");
      onPaymentComplete(paymentResult);
    }
  };

  if (isLoading) {
    return (
      <div className="github-payment-loading">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Preparando pagamento GitHub...</p>
        </div>
      </div>
    );
  }

  if (!paymentResult || !instructions) {
    return (
      <div className="github-payment-error">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">
                Erro na inicialização
              </h3>
              <p className="text-red-600 text-sm mt-1">
                Não foi possível inicializar o pagamento GitHub.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const metadata = paymentResult.metadata as GitHubPaymentMetadata;

  return (
    <div className="github-payment-component">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🐙</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">GitHub Pay</h2>
              <p className="text-sm text-gray-600">
                Patrocine via GitHub Sponsors
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Valor */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Valor do patrocínio:</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                ${paymentResult.amount} USD
              </div>
              <div className="text-sm text-gray-500">
                ≈ R${" "}
                {githubProvider
                  .convertUsdToBrl(paymentResult.amount)
                  .toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div
            className={`
            flex items-center space-x-2 p-3 rounded-lg
            ${paymentStatus === "pending" ? "bg-yellow-50 text-yellow-800" : ""}
            ${paymentStatus === "processing" ? "bg-blue-50 text-blue-800" : ""}
            ${paymentStatus === "completed" ? "bg-green-50 text-green-800" : ""}
          `}
          >
            <span className="text-lg">
              {paymentStatus === "pending" && "⏳"}
              {paymentStatus === "processing" && "🔄"}
              {paymentStatus === "completed" && "✅"}
            </span>
            <span className="font-medium">
              {paymentStatus === "pending" && "Aguardando pagamento"}
              {paymentStatus === "processing" && "Processando pagamento..."}
              {paymentStatus === "completed" && "Pagamento confirmado!"}
            </span>
          </div>
        </div>

        {/* Instruções */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {instructions.title}
          </h3>

          <div className="space-y-2 mb-4">
            {instructions.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-blue-500 font-medium text-sm mt-0.5">
                  {step.split(".")[0]}.
                </span>
                <span className="text-gray-700 text-sm">
                  {step.substring(step.indexOf(".") + 1).trim()}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              📋 Informações importantes:
            </h4>
            <div className="space-y-1">
              {instructions.notes.map((note, index) => (
                <p key={index} className="text-xs text-blue-700">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          {paymentStatus === "pending" && (
            <button
              onClick={handlePayWithGitHub}
              className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>🐙</span>
              <span>Pagar com GitHub Sponsors</span>
            </button>
          )}

          {paymentStatus === "processing" && (
            <div className="space-y-2">
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Pagamento em andamento!</strong>
                  <br />
                  Complete o pagamento na aba do GitHub que foi aberta.
                </p>
              </div>

              <button
                onClick={handleManualConfirmation}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
              >
                ✅ Já paguei - Confirmar manualmente
              </button>
            </div>
          )}

          {paymentStatus === "completed" && (
            <div className="bg-green-100 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-600 text-xl">🎉</span>
                <div>
                  <h4 className="text-green-800 font-medium">
                    Pagamento confirmado!
                  </h4>
                  <p className="text-green-700 text-sm">
                    Obrigado pelo seu patrocínio! Seu acesso será liberado em
                    breve.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informações do GitHub */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Patrocinando: @{metadata.username}</span>
            <a
              href={`https://github.com/${metadata.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Ver perfil GitHub →
            </a>
          </div>
        </div>

        {/* Footer de segurança */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span>🔒</span>
            <span>
              Pagamento processado de forma segura pelo GitHub Sponsors. Seus
              dados estão protegidos.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
