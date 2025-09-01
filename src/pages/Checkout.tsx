import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { usePrivy } from '@privy-io/react-auth';
import { useCart } from '../contexts/CartContext';
import CheckoutForm from '../components/checkout/CheckoutForm';
import PaymentMethodSelection from '../components/checkout/PaymentMethodSelection';
import PaymentProcessor from '../components/checkout/PaymentProcessor';
import { CustomerInfo, Address, CheckoutSession } from '../types/cart';
import { ArrowLeft, Check, CreditCard, User, ShoppingBag } from 'lucide-react';

type CheckoutStep = 'info' | 'payment' | 'processing' | 'success';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  // const { authenticated, login } = usePrivy();
  const { hasItems, clearCart } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('info');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | undefined>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'bitcoin' | 'usdt' | 'github' | undefined>();
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se usuário está autenticado
  // if (!authenticated) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="max-w-md mx-auto text-center p-6">
  //         <div className="bg-white rounded-lg shadow-sm border p-8">
  //           <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <User className="w-8 h-8 text-blue-600" />
  //           </div>
  //           <h2 className="text-2xl font-bold text-gray-900 mb-4">
  //             Login Necessário
  //           </h2>
  //           <p className="text-gray-600 mb-6">
  //             Você precisa estar logado para finalizar sua compra
  //           </p>
  //           <div className="space-y-3">
  //             <button
  //               onClick={login}
  //               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
  //             >
  //               Fazer Login
  //             </button>
  //             <button
  //               onClick={() => navigate('/plans')}
  //               className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
  //             >
  //               Voltar aos Planos
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Verificar se há itens no carrinho
  if (!hasItems()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Carrinho Vazio
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione alguns planos ao seu carrinho antes de finalizar a compra
            </p>
            <button
              onClick={() => navigate('/plans')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Ver Planos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'info', name: 'Informações', icon: User },
    { id: 'payment', name: 'Pagamento', icon: CreditCard },
    { id: 'processing', name: 'Processando', icon: ShoppingBag },
    { id: 'success', name: 'Concluído', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  const handleInfoSubmit = async (info: CustomerInfo, address?: Address) => {
    setIsLoading(true);
    setError(null);

    try {
      setCustomerInfo(info);
      setBillingAddress(address);
      setCurrentStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method: 'pix' | 'bitcoin' | 'usdt' | 'github') => {
    setSelectedPaymentMethod(method);
    setCurrentStep('processing');
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      // Limpar carrinho após pagamento bem-sucedido
      await clearCart();
      setCurrentStep('success');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      // Mesmo com erro ao limpar carrinho, consideramos o pagamento bem-sucedido
      setCurrentStep('success');
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
    setCurrentStep('payment');
  };

  const handlePaymentCancel = () => {
    setCurrentStep('payment');
    setSelectedPaymentMethod(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                if (currentStep === 'info') {
                  navigate('/cart');
                } else if (currentStep === 'payment') {
                  setCurrentStep('info');
                } else if (currentStep === 'processing') {
                  setCurrentStep('payment');
                }
              }}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
              disabled={currentStep === 'success'}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div></div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const isDisabled = index > currentStepIndex;

              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isActive 
                        ? 'bg-blue-600 border-blue-600 text-white' 
                        : isCompleted 
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`
                      text-sm font-medium mt-2 transition-colors
                      ${isActive 
                        ? 'text-blue-600' 
                        : isCompleted 
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }
                    `}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-16 h-0.5 mx-4 transition-colors
                      ${index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'}
                    `} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="py-8">
        {currentStep === 'info' && (
          <CheckoutForm
            onNext={handleInfoSubmit}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentMethodSelection
            onSelect={handlePaymentMethodSelect}
            selectedMethod={selectedPaymentMethod}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'processing' && customerInfo && selectedPaymentMethod && (
          <PaymentProcessor
            paymentMethod={selectedPaymentMethod}
            customerInfo={customerInfo}
            billingAddress={billingAddress}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        )}

        {currentStep === 'success' && (
          <div className="max-w-2xl mx-auto p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pagamento Confirmado!
              </h2>
              <p className="text-gray-600 mb-8">
                Obrigado pela sua compra. Você receberá um email de confirmação em breve.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Ir para Dashboard
                </button>
                <button
                  onClick={() => navigate('/plans')}
                  className="block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Ver Mais Planos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
