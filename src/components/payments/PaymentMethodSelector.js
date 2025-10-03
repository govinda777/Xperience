import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const PaymentMethodSelector = ({ selected, onChange, prices, disabled = false, }) => {
    const paymentMethods = [
        {
            id: "pix",
            name: "PIX",
            description: "Pagamento instantâneo via PIX",
            icon: "🏦",
            features: [
                "Confirmação instantânea",
                "Disponível 24/7",
                "Sem taxas adicionais",
            ],
        },
        {
            id: "github",
            name: "GitHub Pay",
            description: "Patrocine via GitHub Sponsors",
            icon: "🐙",
            badge: "NOVO",
            badgeColor: "bg-purple-100 text-purple-800",
            features: [
                "Pagamento via GitHub",
                "Suporte ao projeto",
                "Fácil e seguro",
            ],
        },
        {
            id: "bitcoin",
            name: "Bitcoin",
            description: "Pagamento com Bitcoin (BTC)",
            icon: "₿",
            badge: "5% OFF",
            badgeColor: "bg-orange-100 text-orange-800",
            features: ["Descentralizado", "Privacidade", "5% de desconto"],
        },
        {
            id: "usdt",
            name: "USDT",
            description: "Pagamento com Tether (USDT)",
            icon: "💰",
            badge: "3% OFF",
            badgeColor: "bg-green-100 text-green-800",
            features: ["Stablecoin", "Valor estável", "3% de desconto"],
        },
    ];
    return (_jsxs("div", { className: "payment-method-selector", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-4", children: "Escolha o m\u00E9todo de pagamento" }), _jsx("div", { className: "space-y-3", children: paymentMethods.map((method) => (_jsxs("div", { className: `
              relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
              ${selected === method.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `, onClick: () => !disabled && onChange(method.id), children: [method.badge && (_jsx("div", { className: `
                absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold
                ${method.badgeColor}
              `, children: method.badge })), _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "text-3xl", children: method.icon }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-lg font-semibold text-gray-800", children: method.name }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-lg font-bold text-gray-800", children: method.id === "github"
                                                                ? `$${(prices[method.id] * 0.18).toFixed(0)} USD`
                                                                : `R$ ${prices[method.id].toFixed(2)}` }), method.id === "github" && (_jsxs("div", { className: "text-sm text-gray-500", children: ["\u2248 R$ ", prices[method.id].toFixed(2)] })), method.id === "bitcoin" && (_jsx("div", { className: "text-sm text-gray-500", children: "\u2248 BTC" })), method.id === "usdt" && (_jsx("div", { className: "text-sm text-gray-500", children: "\u2248 USDT" }))] })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: method.description }), _jsx("div", { className: "flex flex-wrap gap-2", children: method.features.map((feature, index) => (_jsx("span", { className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700", children: feature }, index))) })] }), _jsx("div", { className: "flex-shrink-0 mt-1", children: _jsx("div", { className: `
                  w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selected === method.id
                                            ? "border-blue-500 bg-blue-500"
                                            : "border-gray-300"}
                `, children: selected === method.id && (_jsx("div", { className: "w-2 h-2 rounded-full bg-white" })) }) })] }), selected === method.id && (_jsx("div", { className: "mt-4 pt-4 border-t border-blue-200", children: _jsxs("div", { className: "bg-blue-100 rounded-lg p-3", children: [method.id === "pix" && (_jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("p", { className: "font-medium mb-1", children: "\u26A1 Pagamento instant\u00E2neo" }), _jsx("p", { children: "Ap\u00F3s o pagamento, seu acesso ser\u00E1 liberado imediatamente." })] })), method.id === "github" && (_jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("p", { className: "font-medium mb-1", children: "\uD83D\uDC19 Patroc\u00EDnio via GitHub" }), _jsx("p", { children: "Pague de forma segura atrav\u00E9s do GitHub Sponsors. Confirma\u00E7\u00E3o manual necess\u00E1ria." })] })), method.id === "bitcoin" && (_jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("p", { className: "font-medium mb-1", children: "\uD83D\uDD12 Pagamento descentralizado" }), _jsx("p", { children: "Confirma\u00E7\u00E3o em at\u00E9 30 minutos. Voc\u00EA economiza 5% no valor total!" })] })), method.id === "usdt" && (_jsxs("div", { className: "text-sm text-blue-800", children: [_jsx("p", { className: "font-medium mb-1", children: "\uD83D\uDC8E Stablecoin est\u00E1vel" }), _jsx("p", { children: "Valor fixo em d\u00F3lar. Confirma\u00E7\u00E3o em at\u00E9 10 minutos. Economize 3%!" })] }))] }) }))] }, method.id))) }), _jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("span", { className: "text-green-500", children: "\uD83D\uDD12" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Pagamento 100% seguro" })] }), _jsx("p", { className: "text-xs text-gray-600", children: "Todos os pagamentos s\u00E3o processados de forma segura e criptografada. Seus dados financeiros est\u00E3o protegidos." })] })] }));
};
