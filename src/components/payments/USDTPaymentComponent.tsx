import React, { useState, useEffect } from "react";
import { Plan } from "../../types/payment";

interface USDTPaymentComponentProps {
  plan: Plan;
  finalPrice: number;
  onProcess: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export const USDTPaymentComponent: React.FC<USDTPaymentComponentProps> = ({
  plan,
  finalPrice,
  onProcess,
  isProcessing,
  disabled = false,
}) => {
  const [usdtPrice, setUsdtPrice] = useState<number>(0);
  const [usdtAmount, setUsdtAmount] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<
    "ethereum" | "polygon"
  >("ethereum");

  // Carregar cotação do USDT
  useEffect(() => {
    const fetchUSDTPrice = async () => {
      try {
        setLoadingPrice(true);
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=brl",
        );
        const data = await response.json();
        const price = data.tether.brl;
        setUsdtPrice(price);
        setUsdtAmount(finalPrice / price);
      } catch (error) {
        console.error("Erro ao buscar cotação USDT:", error);
        // Fallback com cotação aproximada (1 USDT ≈ R$ 5,50)
        setUsdtPrice(5.5);
        setUsdtAmount(finalPrice / 5.5);
      } finally {
        setLoadingPrice(false);
      }
    };

    fetchUSDTPrice();

    // Atualizar cotação a cada 30 segundos
    const interval = setInterval(fetchUSDTPrice, 30000);
    return () => clearInterval(interval);
  }, [finalPrice]);

  const networkInfo = {
    ethereum: {
      name: "Ethereum",
      symbol: "ETH",
      fee: "$5-15",
      time: "2-10 min",
      color: "blue",
    },
    polygon: {
      name: "Polygon",
      symbol: "MATIC",
      fee: "$0.01-0.1",
      time: "1-3 min",
      color: "purple",
    },
  };

  return (
    <div className="usdt-payment-component">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="text-4xl">💰</div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Pagamento via USDT
            </h3>
            <p className="text-sm text-gray-600">
              Stablecoin • Valor estável • 3% de desconto
            </p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-green-500">💎</span>
            <span className="text-sm font-medium text-green-800">
              Desconto de 3% + Valor estável
            </span>
          </div>
          <p className="text-sm text-green-700">
            USDT é uma stablecoin pareada ao dólar americano, oferecendo
            estabilidade de preço.
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
            <span className="text-gray-600">Equivalente em USDT:</span>
            <div className="text-right">
              {loadingPrice ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Calculando...</span>
                </div>
              ) : (
                <>
                  <div className="font-bold text-green-600">
                    ${usdtAmount.toFixed(2)} USDT
                  </div>
                  <div className="text-xs text-gray-500">
                    1 USDT = R$ {usdtPrice.toFixed(2)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Seleção de rede */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Escolha a rede blockchain:
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(networkInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedNetwork(key as "ethereum" | "polygon")}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  selectedNetwork === key
                    ? `border-${info.color}-500 bg-${info.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="font-medium text-gray-800">{info.name}</div>
              <div className="text-xs text-gray-600 mt-1">
                <div>Taxa: {info.fee}</div>
                <div>Tempo: {info.time}</div>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Recomendamos Polygon para taxas menores e confirmação mais rápida.
        </p>
      </div>

      {/* Informações sobre USDT */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Por que escolher USDT?
        </h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">💎</span>
            <span>Valor estável pareado ao dólar americano</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">🚀</span>
            <span>Confirmação rápida na blockchain</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">💰</span>
            <span>3% de desconto exclusivo</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-500">🌍</span>
            <span>Aceito globalmente</span>
          </div>
        </div>
      </div>

      {/* Instruções USDT */}
      <div className="mb-6">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            Como funciona o pagamento USDT?
          </span>
          <span
            className={`transform transition-transform ${showInstructions ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </button>

        {showInstructions && (
          <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <ol className="text-sm text-green-800 space-y-2">
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span>Clique em "Gerar Endereço USDT" abaixo</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span>Copie o endereço ou escaneie o QR Code</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span>Envie exatamente o valor em USDT da sua carteira</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <span>Aguarde confirmações na blockchain (1-10 min)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  5
                </span>
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
          ${
            disabled || isProcessing || loadingPrice
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-lg hover:shadow-xl"
          }
        `}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Gerando Endereço USDT...</span>
          </div>
        ) : loadingPrice ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Carregando Cotação...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>💰</span>
            <span>
              Gerar Endereço USDT ({networkInfo[selectedNetwork].name})
            </span>
          </div>
        )}
      </button>

      {/* Informações adicionais */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <span>💎</span>
            <span>Stablecoin</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🚀</span>
            <span>Rápido</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💰</span>
            <span>3% OFF</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Rede {networkInfo[selectedNetwork].name} • Taxa:{" "}
          {networkInfo[selectedNetwork].fee} • Tempo:{" "}
          {networkInfo[selectedNetwork].time}
        </p>
      </div>

      {/* Carteiras compatíveis */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Carteiras USDT compatíveis:
        </h4>
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
          <div className="text-center">MetaMask</div>
          <div className="text-center">Trust Wallet</div>
          <div className="text-center">Coinbase</div>
          <div className="text-center">Binance</div>
          <div className="text-center">Exodus</div>
          <div className="text-center">Ledger</div>
          <div className="text-center">Trezor</div>
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
              Certifique-se de enviar USDT na rede{" "}
              {networkInfo[selectedNetwork].name} correta. Envios em redes
              diferentes podem resultar em perda dos fundos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
