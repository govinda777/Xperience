import React, { useState } from 'react';
import { Plan } from '../../types/payment';

interface PixPaymentComponentProps {
  plan: Plan;
  finalPrice: number;
  onProcess: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const PixPaymentComponent: React.FC<PixPaymentComponentProps> = ({
  plan,
  finalPrice,
  onProcess,
  isProcessing,
  disabled = false
}) => {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="pix-payment-component">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-4xl">🏦</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Pagamento via PIX</h3>
            <p className="text-sm text-gray-600">
              Confirmação instantânea • Disponível 24/7
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-500">⚡</span>
            <span className="text-sm font-medium text-green-800">
              Pagamento instantâneo
            </span>
          </div>
          <p className="text-sm text-green-700">
            Após confirmar o pagamento PIX, seu acesso será liberado imediatamente.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Plano:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Valor:</span>
            <span className="text-xl font-bold text-gray-800">
              R$ {finalPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Método:</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium">PIX</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Sem taxas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções PIX */}
      <div className="mb-6">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            Como funciona o pagamento PIX?
          </span>
          <span className={`transform transition-transform ${showInstructions ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showInstructions && (
          <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <ol className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Clique em "Gerar QR Code PIX" abaixo</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Abra o app do seu banco e escaneie o QR Code</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Confirme o pagamento no seu app bancário</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Seu acesso será liberado automaticamente</span>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Botão de pagamento */}
      <button
        onClick={onProcess}
        disabled={disabled || isProcessing}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
          ${disabled || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Gerando QR Code PIX...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>🏦</span>
            <span>Gerar QR Code PIX</span>
          </div>
        )}
      </button>

      {/* Informações adicionais */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Seguro</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>⚡</span>
            <span>Instantâneo</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🆓</span>
            <span>Sem taxas</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          O QR Code PIX expira em 15 minutos após a geração
        </p>
      </div>

      {/* Bancos compatíveis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Bancos e carteiras compatíveis:
        </h4>
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
          <div className="text-center">Nubank</div>
          <div className="text-center">Inter</div>
          <div className="text-center">Itaú</div>
          <div className="text-center">Bradesco</div>
          <div className="text-center">Santander</div>
          <div className="text-center">Caixa</div>
          <div className="text-center">Banco do Brasil</div>
          <div className="text-center">+ outros</div>
        </div>
      </div>
    </div>
  );
};
