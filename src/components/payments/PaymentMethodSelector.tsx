import React from 'react';
import { PaymentProvider } from '../../types/payment';

interface PaymentMethodSelectorProps {
  selected: PaymentProvider;
  onChange: (method: PaymentProvider) => void;
  prices: {
    pix: number;
    bitcoin: number;
    usdt: number;
    github: number;
  };
  disabled?: boolean;
}

interface PaymentMethodOption {
  id: PaymentProvider;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  badgeColor?: string;
  features: string[];
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selected,
  onChange,
  prices,
  disabled = false
}) => {
  const paymentMethods: PaymentMethodOption[] = [
    {
      id: 'pix',
      name: 'PIX',
      description: 'Pagamento instantâneo via PIX',
      icon: '🏦',
      features: [
        'Confirmação instantânea',
        'Disponível 24/7',
        'Sem taxas adicionais'
      ]
    },
    {
      id: 'github',
      name: 'GitHub Pay',
      description: 'Patrocine via GitHub Sponsors',
      icon: '🐙',
      badge: 'NOVO',
      badgeColor: 'bg-purple-100 text-purple-800',
      features: [
        'Pagamento via GitHub',
        'Suporte ao projeto',
        'Fácil e seguro'
      ]
    },
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      description: 'Pagamento com Bitcoin (BTC)',
      icon: '₿',
      badge: '5% OFF',
      badgeColor: 'bg-orange-100 text-orange-800',
      features: [
        'Descentralizado',
        'Privacidade',
        '5% de desconto'
      ]
    },
    {
      id: 'usdt',
      name: 'USDT',
      description: 'Pagamento com Tether (USDT)',
      icon: '💰',
      badge: '3% OFF',
      badgeColor: 'bg-green-100 text-green-800',
      features: [
        'Stablecoin',
        'Valor estável',
        '3% de desconto'
      ]
    }
  ];

  return (
    <div className="payment-method-selector">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Escolha o método de pagamento
      </h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`
              relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selected === method.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && onChange(method.id)}
          >
            {/* Badge de desconto */}
            {method.badge && (
              <div className={`
                absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold
                ${method.badgeColor}
              `}>
                {method.badge}
              </div>
            )}

            <div className="flex items-start space-x-4">
              {/* Ícone */}
              <div className="text-3xl">{method.icon}</div>
              
              {/* Conteúdo */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {method.name}
                  </h4>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-800">
                      {method.id === 'github' 
                        ? `$${(prices[method.id] * 0.18).toFixed(0)} USD`
                        : `R$ ${prices[method.id].toFixed(2)}`
                      }
                    </div>
                    {method.id === 'github' && (
                      <div className="text-sm text-gray-500">
                        ≈ R$ {prices[method.id].toFixed(2)}
                      </div>
                    )}
                    {method.id === 'bitcoin' && (
                      <div className="text-sm text-gray-500">
                        ≈ BTC
                      </div>
                    )}
                    {method.id === 'usdt' && (
                      <div className="text-sm text-gray-500">
                        ≈ USDT
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {method.description}
                </p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {method.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Radio button */}
              <div className="flex-shrink-0 mt-1">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selected === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}>
                  {selected === method.id && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Informações adicionais para o método selecionado */}
            {selected === method.id && (
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="bg-blue-100 rounded-lg p-3">
                  {method.id === 'pix' && (
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">⚡ Pagamento instantâneo</p>
                      <p>Após o pagamento, seu acesso será liberado imediatamente.</p>
                    </div>
                  )}
                  
                  {method.id === 'github' && (
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">🐙 Patrocínio via GitHub</p>
                      <p>Pague de forma segura através do GitHub Sponsors. Confirmação manual necessária.</p>
                    </div>
                  )}
                  
                  {method.id === 'bitcoin' && (
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">🔒 Pagamento descentralizado</p>
                      <p>Confirmação em até 30 minutos. Você economiza 5% no valor total!</p>
                    </div>
                  )}
                  
                  {method.id === 'usdt' && (
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">💎 Stablecoin estável</p>
                      <p>Valor fixo em dólar. Confirmação em até 10 minutos. Economize 3%!</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Informações de segurança */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-green-500">🔒</span>
          <span className="text-sm font-medium text-gray-700">
            Pagamento 100% seguro
          </span>
        </div>
        <p className="text-xs text-gray-600">
          Todos os pagamentos são processados de forma segura e criptografada. 
          Seus dados financeiros estão protegidos.
        </p>
      </div>
    </div>
  );
};
