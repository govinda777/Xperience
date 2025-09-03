import React, { useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { CartItem } from "../../types/cart";
import { formatCurrency } from "../../types/cart";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: "BRL" | "USD" | "BTC" | "USDT";
  features: string[];
  duration: number; // em meses
  isPopular?: boolean;
  originalPrice?: number;
}

interface PlanCardProps {
  plan: Plan;
  className?: string;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, className = "" }) => {
  const { addItem, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);

    try {
      const cartItem: Omit<CartItem, "id" | "quantity"> = {
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
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercentage = plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : 0;

  return (
    <div
      className={`
      relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-105
      ${plan.isPopular ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
      ${className}
    `}
    >
      {/* Badge Popular */}
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" />
            Mais Popular
          </div>
        </div>
      )}

      {/* Badge Desconto */}
      {discountPercentage > 0 && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            -{discountPercentage}%
          </div>
        </div>
      )}

      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>

          {/* Preço */}
          <div className="mb-4">
            {plan.originalPrice && (
              <div className="text-lg text-gray-400 line-through mb-1">
                {formatCurrency(plan.originalPrice, plan.currency)}
              </div>
            )}
            <div className="text-4xl font-bold text-gray-900">
              {formatCurrency(plan.price, plan.currency)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              por {plan.duration} {plan.duration === 1 ? "mês" : "meses"}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">
            O que está incluído:
          </h4>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botão */}
        <button
          onClick={handleAddToCart}
          disabled={isLoading || isAdding}
          className={`
            w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
            ${
              plan.isPopular
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Adicionando...
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Adicionar ao Carrinho
            </>
          )}
        </button>

        {/* Garantia */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            ✅ Garantia de 30 dias • 🔒 Pagamento seguro
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
