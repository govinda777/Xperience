import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Bitcoin,
  DollarSign,
  Github,
} from "lucide-react";
import { availablePaymentMethods } from "../../config/paymentMethods";
import { formatCurrency } from "../../types/cart";
import { useCart } from "../../contexts/CartContext";

interface PaymentMethodSelectionProps {
  onSelect: (method: "pix" | "bitcoin" | "usdt" | "github") => void;
  selectedMethod?: "pix" | "bitcoin" | "usdt" | "github";
  isLoading?: boolean;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  onSelect,
  selectedMethod,
  isLoading = false,
}) => {
  const { getCartSummary } = useCart();
  const summary = getCartSummary();

  const getMethodIcon = (methodId: string) => {
    switch (methodId) {
      case "pix":
        return <Smartphone className="w-6 h-6" />;
      case "bitcoin":
        return <Bitcoin className="w-6 h-6" />;
      case "usdt":
        return <DollarSign className="w-6 h-6" />;
      case "github":
        return <Github className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const calculateFinalAmount = (
    method: (typeof availablePaymentMethods)[0],
  ) => {
    const feeAmount =
      (summary.total * method.fees.percentage) / 100 + method.fees.fixed;
    return summary.total + feeAmount;
  };

  const enabledMethods = availablePaymentMethods.filter(
    (method) => method.enabled,
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Escolha a forma de pagamento
        </h2>
        <p className="text-gray-600">
          Selecione o método de pagamento de sua preferência
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {enabledMethods.map((method) => {
          const finalAmount = calculateFinalAmount(method);
          const isSelected = selectedMethod === method.id;
          const hasFees = method.fees.percentage > 0 || method.fees.fixed > 0;

          return (
            <div
              key={method.id}
              className={`
                relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onClick={() => !isLoading && onSelect(method.id)}
            >
              {/* Indicador de seleção */}
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Ícone e nome */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`
                  p-3 rounded-full 
                  ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
                `}
                >
                  {getMethodIcon(method.id)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {method.name}
                    <span className="text-2xl">{method.icon}</span>
                  </h3>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
              </div>

              {/* Informações de processamento */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Tempo de processamento:</span>
                  <span className="font-medium">{method.processingTime}</span>
                </div>

                {hasFees && (
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Taxa:</span>
                    <span className="font-medium text-orange-600">
                      {method.fees.percentage > 0 &&
                        `${method.fees.percentage}%`}
                      {method.fees.percentage > 0 &&
                        method.fees.fixed > 0 &&
                        " + "}
                      {method.fees.fixed > 0 &&
                        formatCurrency(method.fees.fixed, summary.currency)}
                    </span>
                  </div>
                )}
              </div>

              {/* Valor final */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Valor a pagar:</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(finalAmount, summary.currency)}
                    </div>
                    {hasFees && finalAmount !== summary.total && (
                      <div className="text-xs text-gray-500">
                        Original:{" "}
                        {formatCurrency(summary.total, summary.currency)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Características especiais */}
              <div className="mt-4 flex flex-wrap gap-2">
                {method.id === "pix" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Instantâneo
                  </span>
                )}
                {method.id === "bitcoin" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Descentralizado
                  </span>
                )}
                {method.id === "usdt" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Stablecoin
                  </span>
                )}
                {method.id === "github" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Open Source
                  </span>
                )}
                {!hasFees && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Sem taxas
                  </span>
                )}
              </div>

              {/* Informações adicionais por método */}
              {method.id === "pix" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    💡 Pagamento via PIX é processado instantaneamente e está
                    disponível 24/7
                  </p>
                </div>
              )}

              {method.id === "bitcoin" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    ⚡ Pagamento em Bitcoin pode levar de 10 minutos a 1 hora
                    para confirmação
                  </p>
                </div>
              )}

              {method.id === "usdt" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    🔒 USDT é uma stablecoin pareada ao dólar americano,
                    oferecendo estabilidade de preço
                  </p>
                </div>
              )}

              {method.id === "github" && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    🐙 Pagamento via GitHub Sponsors apoia o desenvolvimento
                    open source
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Informações de segurança */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Pagamento Seguro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium mb-1">🔐 Criptografia SSL</p>
            <p>Todas as transações são protegidas com criptografia de ponta</p>
          </div>
          <div>
            <p className="font-medium mb-1">🛡️ Dados Protegidos</p>
            <p>Suas informações pessoais e financeiras estão seguras</p>
          </div>
          <div>
            <p className="font-medium mb-1">✅ Verificação Automática</p>
            <p>Pagamentos são verificados automaticamente em tempo real</p>
          </div>
        </div>
      </div>

      {/* Botão de continuar */}
      {selectedMethod && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => onSelect(selectedMethod)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processando...
              </>
            ) : (
              <>
                Continuar com{" "}
                {
                  availablePaymentMethods.find((m) => m.id === selectedMethod)
                    ?.name
                }
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelection;
