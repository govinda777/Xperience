import React, { useState, useEffect } from 'react';
import { Plan } from '../../types/payment';

interface BitcoinPaymentComponentProps {
  plan: Plan;
  finalPrice: number;
  onProcess: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const BitcoinPaymentComponent: React.FC<BitcoinPaymentComponentProps> = ({
  plan,
  finalPrice,
  onProcess,
  isProcessing,
  disabled = false
}) => {
  const [btcPrice, setBtcPrice] = useState<number>(0);
  const [btcAmount, setBtcAmount] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(true);

  // Carregar cotação do Bitcoin
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        setLoadingPrice(true);
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl'
        );
        const data = await response.json();
        const price = data.bitcoin.brl;
        setBtcPrice(price);
        setBtcAmount(finalPrice / price);
      } catch (error) {
        console.error('Erro ao buscar cotação Bitcoin:', error);
        // Fallback com cotação aproximada
        setBtcPrice(300000); // ~R$ 300k por BTC
        setBtcAmount(finalPrice / 300000);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchBitcoinPrice();
    
    // Atualizar cotação a cada 30 segundos
    const interval = setInterval(fetchBitcoinPrice, 30000);
    return () => clearInterval(interval);
  }, [finalPrice]);

  return (
    <div className="bitcoin-payment-component">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-4xl">₿</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Pagamento via Bitcoin</h3>
            <p className="text-sm text-gray-600">
              Descentralizado • Privado • 5% de desconto
            </p>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-orange-500">🎉</span>
            <span className="text-sm font-medium text-orange-800">
              Desconto especial de 5%
            </span>
          </div>
          <p className="text-sm text-orange-700">
            Pagando com Bitcoin você economiza 5% e contribui para a descentralização!
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Plano:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Valor original:</span>
            <span className="text-gray-500 line-through">
              R$ {plan.price.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Valor com desconto:</span>
            <span className="text-xl font-bold text-green-600">
              R$ {finalPrice.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Equivalente em Bitcoin:</span>
            <div className="text-right">
              {loadingPrice ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Calculando...</span>
                </div>
              ) : (
                <>
                  <div className="font-bold text-orange-600">
                    ₿ {btcAmount.toFixed(8)}
                  </div>
                  <div className="text-xs text-gray-500">
                    1 BTC = R$ {btcPrice.toLocaleString('pt-BR')}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Informações sobre Bitcoin */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Por que escolher Bitcoin?
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">🔒</span>
            <span>Transação descentralizada e segura</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">🌍</span>
            <span>Aceito globalmente, sem fronteiras</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">💰</span>
            <span>5% de desconto exclusivo</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">📈</span>
            <span>Reserva de valor digital</span>
          </div>
        </div>
      </div>

      {/* Instruções Bitcoin */}
      <div className="mb-6">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            Como funciona o pagamento Bitcoin?
          </span>
          <span className={`transform transition-transform ${showInstructions ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {showInstructions && (
          <div className="mt-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <ol className="text-sm text-orange-800 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Clique em "Gerar Endereço Bitcoin" abaixo</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Copie o endereço ou escaneie o QR Code</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Envie exatamente o valor em BTC da sua carteira</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Aguarde 1 confirmação na blockchain (~10-30 min)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <span>Seu acesso será liberado automaticamente</span>
              </li>
            </ol>
          </div>
        )}
      </div>

      {/* Botão de pagamento */}
      <button
        onClick={onProcess}
        disabled={disabled || isProcessing || loadingPrice}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200
          ${disabled || isProcessing || loadingPrice
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Gerando Endereço Bitcoin...</span>
          </div>
        ) : loadingPrice ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando Cotação...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>₿</span>
            <span>Gerar Endereço Bitcoin</span>
          </div>
        )}
      </button>

      {/* Informações adicionais */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Descentralizado</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🌍</span>
            <span>Global</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💰</span>
            <span>5% OFF</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center">
          Confirmação típica: 10-30 minutos • Taxa de rede: ~$1-5 USD
        </p>
      </div>

      {/* Carteiras compatíveis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Carteiras Bitcoin compatíveis:
        </h4>
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
          <div className="text-center">Electrum</div>
          <div className="text-center">Exodus</div>
          <div className="text-center">Trust Wallet</div>
          <div className="text-center">MetaMask</div>
          <div className="text-center">Binance</div>
          <div className="text-center">Coinbase</div>
          <div className="text-center">Ledger</div>
          <div className="text-center">+ outras</div>
        </div>
      </div>

      {/* Aviso importante */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-500 mt-0.5">⚠️</span>
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">Importante:</p>
            <p>
              Envie exatamente o valor em BTC mostrado. Valores diferentes podem não ser 
              processados automaticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
