import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CreditCard, Smartphone, Bitcoin, DollarSign, Github, } from "lucide-react";
import { availablePaymentMethods } from "../../config/privy";
import { formatCurrency } from "../../types/cart";
import { useCart } from "../../contexts/CartContext";
const PaymentMethodSelection = ({ onSelect, selectedMethod, isLoading = false, }) => {
    const { getCartSummary } = useCart();
    const summary = getCartSummary();
    const getMethodIcon = (methodId) => {
        switch (methodId) {
            case "pix":
                return _jsx(Smartphone, { className: "w-6 h-6" });
            case "bitcoin":
                return _jsx(Bitcoin, { className: "w-6 h-6" });
            case "usdt":
                return _jsx(DollarSign, { className: "w-6 h-6" });
            case "github":
                return _jsx(Github, { className: "w-6 h-6" });
            default:
                return _jsx(CreditCard, { className: "w-6 h-6" });
        }
    };
    const calculateFinalAmount = (method) => {
        const feeAmount = (summary.total * method.fees.percentage) / 100 + method.fees.fixed;
        return summary.total + feeAmount;
    };
    const enabledMethods = availablePaymentMethods.filter((method) => method.enabled);
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Escolha a forma de pagamento" }), _jsx("p", { className: "text-gray-600", children: "Selecione o m\u00E9todo de pagamento de sua prefer\u00EAncia" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: enabledMethods.map((method) => {
                    const finalAmount = calculateFinalAmount(method);
                    const isSelected = selectedMethod === method.id;
                    const hasFees = method.fees.percentage > 0 || method.fees.fixed > 0;
                    return (_jsxs("div", { className: `
                relative border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg
                ${isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"}
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
              `, onClick: () => !isLoading && onSelect(method.id), children: [isSelected && (_jsx("div", { className: "absolute top-4 right-4", children: _jsx("div", { className: "w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-white", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }) })), _jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("div", { className: `
                  p-3 rounded-full 
                  ${isSelected ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
                `, children: getMethodIcon(method.id) }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 flex items-center gap-2", children: [method.name, _jsx("span", { className: "text-2xl", children: method.icon })] }), _jsx("p", { className: "text-sm text-gray-600", children: method.description })] })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm mb-2", children: [_jsx("span", { className: "text-gray-600", children: "Tempo de processamento:" }), _jsx("span", { className: "font-medium", children: method.processingTime })] }), hasFees && (_jsxs("div", { className: "flex items-center justify-between text-sm mb-2", children: [_jsx("span", { className: "text-gray-600", children: "Taxa:" }), _jsxs("span", { className: "font-medium text-orange-600", children: [method.fees.percentage > 0 &&
                                                        `${method.fees.percentage}%`, method.fees.percentage > 0 &&
                                                        method.fees.fixed > 0 &&
                                                        " + ", method.fees.fixed > 0 &&
                                                        formatCurrency(method.fees.fixed, summary.currency)] })] }))] }), _jsx("div", { className: "border-t pt-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Valor a pagar:" }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-lg font-bold text-gray-900", children: formatCurrency(finalAmount, summary.currency) }), hasFees && finalAmount !== summary.total && (_jsxs("div", { className: "text-xs text-gray-500", children: ["Original:", " ", formatCurrency(summary.total, summary.currency)] }))] })] }) }), _jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [method.id === "pix" && (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Instant\u00E2neo" })), method.id === "bitcoin" && (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800", children: "Descentralizado" })), method.id === "usdt" && (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: "Stablecoin" })), method.id === "github" && (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800", children: "Open Source" })), !hasFees && (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800", children: "Sem taxas" }))] }), method.id === "pix" && (_jsx("div", { className: "mt-3 p-3 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-xs text-gray-600", children: "\uD83D\uDCA1 Pagamento via PIX \u00E9 processado instantaneamente e est\u00E1 dispon\u00EDvel 24/7" }) })), method.id === "bitcoin" && (_jsx("div", { className: "mt-3 p-3 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-xs text-gray-600", children: "\u26A1 Pagamento em Bitcoin pode levar de 10 minutos a 1 hora para confirma\u00E7\u00E3o" }) })), method.id === "usdt" && (_jsx("div", { className: "mt-3 p-3 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-xs text-gray-600", children: "\uD83D\uDD12 USDT \u00E9 uma stablecoin pareada ao d\u00F3lar americano, oferecendo estabilidade de pre\u00E7o" }) })), method.id === "github" && (_jsx("div", { className: "mt-3 p-3 bg-gray-50 rounded-lg", children: _jsx("p", { className: "text-xs text-gray-600", children: "\uD83D\uDC19 Pagamento via GitHub Sponsors apoia o desenvolvimento open source" }) }))] }, method.id));
                }) }), _jsxs("div", { className: "mt-8 p-6 bg-gray-50 rounded-lg", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2", children: [_jsx("svg", { className: "w-5 h-5 text-green-600", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }) }), "Pagamento Seguro"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium mb-1", children: "\uD83D\uDD10 Criptografia SSL" }), _jsx("p", { children: "Todas as transa\u00E7\u00F5es s\u00E3o protegidas com criptografia de ponta" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium mb-1", children: "\uD83D\uDEE1\uFE0F Dados Protegidos" }), _jsx("p", { children: "Suas informa\u00E7\u00F5es pessoais e financeiras est\u00E3o seguras" })] }), _jsxs("div", { children: [_jsx("p", { className: "font-medium mb-1", children: "\u2705 Verifica\u00E7\u00E3o Autom\u00E1tica" }), _jsx("p", { children: "Pagamentos s\u00E3o verificados automaticamente em tempo real" })] })] })] }), selectedMethod && (_jsx("div", { className: "mt-8 flex justify-end", children: _jsx("button", { onClick: () => onSelect(selectedMethod), disabled: isLoading, className: "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2", children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "Processando..."] })) : (_jsxs(_Fragment, { children: ["Continuar com", " ", availablePaymentMethods.find((m) => m.id === selectedMethod)
                                ?.name, _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" }) })] })) }) }))] }));
};
export default PaymentMethodSelection;
