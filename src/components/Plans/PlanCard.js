import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { formatCurrency } from "../../types/cart";
const PlanCard = ({ plan, className = "" }) => {
    const { addItem, isLoading } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            const cartItem = {
                planId: plan.id,
                name: plan.name,
                description: plan.description,
                price: plan.price,
                currency: plan.currency,
                duration: plan.duration,
                features: plan.features,
                isPopular: plan.isPopular,
                discount: plan.originalPrice
                    ? {
                        type: "fixed",
                        value: plan.originalPrice - plan.price,
                    }
                    : undefined,
            };
            await addItem(cartItem);
        }
        catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
        }
        finally {
            setIsAdding(false);
        }
    };
    const discountPercentage = plan.originalPrice
        ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
        : 0;
    return (_jsxs("div", { className: `
      relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105
      ${plan.isPopular ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
      ${className}
    `, children: [plan.isPopular && (_jsx("div", { className: "absolute -top-4 left-1/2 transform -translate-x-1/2", children: _jsxs("div", { className: "bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1", children: [_jsx(Star, { className: "w-4 h-4 fill-current" }), "Mais Popular"] }) })), discountPercentage > 0 && (_jsx("div", { className: "absolute -top-2 -right-2", children: _jsxs("div", { className: "bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold", children: ["-", discountPercentage, "%"] }) })), _jsxs("div", { className: "p-8", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-900 mb-2", children: plan.name }), _jsx("p", { className: "text-gray-600 mb-4", children: plan.description }), _jsxs("div", { className: "mb-4", children: [plan.originalPrice && (_jsx("div", { className: "text-lg text-gray-400 line-through mb-1", children: formatCurrency(plan.originalPrice, plan.currency) })), _jsx("div", { className: "text-4xl font-bold text-gray-900", children: formatCurrency(plan.price, plan.currency) }), _jsxs("div", { className: "text-sm text-gray-500 mt-1", children: ["por ", plan.duration, " ", plan.duration === 1 ? "mês" : "meses"] })] })] }), _jsxs("div", { className: "mb-8", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-4", children: "O que est\u00E1 inclu\u00EDdo:" }), _jsx("ul", { className: "space-y-3", children: plan.features.map((feature, index) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(Check, { className: "w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" }), _jsx("span", { className: "text-gray-700", children: feature })] }, index))) })] }), _jsx("button", { onClick: handleAddToCart, disabled: isLoading || isAdding, className: `
            w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${plan.isPopular
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-gray-900 hover:bg-gray-800 text-white"}
            disabled:opacity-50 disabled:cursor-not-allowed
          `, children: isAdding ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white" }), "Adicionando..."] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { className: "w-4 h-4" }), "Adicionar ao Carrinho"] })) }), _jsx("div", { className: "mt-4 text-center", children: _jsx("p", { className: "text-xs text-gray-500", children: "\u2705 Garantia de 30 dias \u2022 \uD83D\uDD12 Pagamento seguro" }) })] })] }));
};
export default PlanCard;
