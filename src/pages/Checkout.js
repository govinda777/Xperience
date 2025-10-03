import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { usePrivy } from '@privy-io/react-auth';
import { useCart } from "../contexts/CartContext";
import CheckoutForm from "../components/checkout/CheckoutForm";
import PaymentMethodSelection from "../components/checkout/PaymentMethodSelection";
import PaymentProcessor from "../components/checkout/PaymentProcessor";
import { ArrowLeft, Check, CreditCard, User, ShoppingBag } from "lucide-react";
const Checkout = () => {
    const navigate = useNavigate();
    // const { authenticated, login } = usePrivy();
    const { hasItems, clearCart } = useCart();
    const [currentStep, setCurrentStep] = useState("info");
    const [customerInfo, setCustomerInfo] = useState(null);
    const [billingAddress, setBillingAddress] = useState();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
    const [checkoutSession, setCheckoutSession] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsx("div", { className: "max-w-md mx-auto text-center p-6", children: _jsxs("div", { className: "bg-white rounded-lg shadow-sm border p-8", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(ShoppingBag, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Carrinho Vazio" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Adicione alguns planos ao seu carrinho antes de finalizar a compra" }), _jsx("button", { onClick: () => navigate("/plans"), className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors", children: "Ver Planos" })] }) }) }));
    }
    const steps = [
        { id: "info", name: "Informações", icon: User },
        { id: "payment", name: "Pagamento", icon: CreditCard },
        { id: "processing", name: "Processando", icon: ShoppingBag },
        { id: "success", name: "Concluído", icon: Check },
    ];
    const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
    const handleInfoSubmit = async (info, address) => {
        setIsLoading(true);
        setError(null);
        try {
            setCustomerInfo(info);
            setBillingAddress(address);
            setCurrentStep("payment");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handlePaymentMethodSelect = (method) => {
        setSelectedPaymentMethod(method);
        setCurrentStep("processing");
    };
    const handlePaymentSuccess = async (transactionId) => {
        try {
            // Limpar carrinho após pagamento bem-sucedido
            await clearCart();
            setCurrentStep("success");
        }
        catch (error) {
            console.error("Erro ao limpar carrinho:", error);
            // Mesmo com erro ao limpar carrinho, consideramos o pagamento bem-sucedido
            setCurrentStep("success");
        }
    };
    const handlePaymentError = (error) => {
        setError(error);
        setCurrentStep("payment");
    };
    const handlePaymentCancel = () => {
        setCurrentStep("payment");
        setSelectedPaymentMethod(undefined);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4 py-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("button", { onClick: () => {
                                        if (currentStep === "info") {
                                            navigate("/cart");
                                        }
                                        else if (currentStep === "payment") {
                                            setCurrentStep("info");
                                        }
                                        else if (currentStep === "processing") {
                                            setCurrentStep("payment");
                                        }
                                    }, className: "inline-flex items-center gap-2 text-gray-600 hover:text-gray-900", disabled: currentStep === "success", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Voltar"] }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Checkout" }), _jsx("div", {})] }), _jsx("div", { className: "flex items-center justify-center", children: steps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isActive = index === currentStepIndex;
                                const isCompleted = index < currentStepIndex;
                                const isDisabled = index > currentStepIndex;
                                return (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: `
                      w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                      ${isActive
                                                        ? "bg-blue-600 border-blue-600 text-white"
                                                        : isCompleted
                                                            ? "bg-green-600 border-green-600 text-white"
                                                            : "bg-white border-gray-300 text-gray-400"}
                    `, children: isCompleted ? (_jsx(Check, { className: "w-5 h-5" })) : (_jsx(StepIcon, { className: "w-5 h-5" })) }), _jsx("span", { className: `
                      text-sm font-medium mt-2 transition-colors
                      ${isActive
                                                        ? "text-blue-600"
                                                        : isCompleted
                                                            ? "text-green-600"
                                                            : "text-gray-400"}
                    `, children: step.name })] }), index < steps.length - 1 && (_jsx("div", { className: `
                      w-16 h-0.5 mx-4 transition-colors
                      ${index < currentStepIndex ? "bg-green-600" : "bg-gray-300"}
                    ` }))] }, step.id));
                            }) })] }) }), error && (_jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: _jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: _jsxs("div", { className: "flex", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }) }) }), _jsxs("div", { className: "ml-3", children: [_jsx("h3", { className: "text-sm font-medium text-red-800", children: "Erro" }), _jsx("div", { className: "mt-2 text-sm text-red-700", children: error })] })] }) }) })), _jsxs("div", { className: "py-8", children: [currentStep === "info" && (_jsx(CheckoutForm, { onNext: handleInfoSubmit, isLoading: isLoading })), currentStep === "payment" && (_jsx(PaymentMethodSelection, { onSelect: handlePaymentMethodSelect, selectedMethod: selectedPaymentMethod, isLoading: isLoading })), currentStep === "processing" &&
                        customerInfo &&
                        selectedPaymentMethod && (_jsx(PaymentProcessor, { paymentMethod: selectedPaymentMethod, customerInfo: customerInfo, billingAddress: billingAddress, onSuccess: handlePaymentSuccess, onError: handlePaymentError, onCancel: handlePaymentCancel })), currentStep === "success" && (_jsx("div", { className: "max-w-2xl mx-auto p-6", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6", children: _jsx(Check, { className: "w-8 h-8 text-green-600" }) }), _jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-4", children: "Pagamento Confirmado!" }), _jsx("p", { className: "text-gray-600 mb-8", children: "Obrigado pela sua compra. Voc\u00EA receber\u00E1 um email de confirma\u00E7\u00E3o em breve." }), _jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => navigate("/dashboard"), className: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors", children: "Ir para Dashboard" }), _jsx("button", { onClick: () => navigate("/plans"), className: "block w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors", children: "Ver Mais Planos" })] })] }) }))] })] }));
};
export default Checkout;
