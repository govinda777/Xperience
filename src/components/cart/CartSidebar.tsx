import React from "react";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { formatCurrency } from "../../types/cart";
import { useNavigate } from "react-router-dom";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    removeItem,
    updateQuantity,
    getCartSummary,
    hasItems,
    isLoading,
  } = useCart();

  const navigate = useNavigate();
  const summary = getCartSummary();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Carrinho ({summary.itemCount})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full">
          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {!hasItems() ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Carrinho vazio</p>
                <p className="text-sm text-center">
                  Adicione alguns planos para começar
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart?.items.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{item.duration} meses</span>
                          {item.isPopular && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors text-red-500"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          disabled={isLoading}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          disabled={isLoading}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-gray-900">
                          {formatCurrency(
                            item.price * item.quantity,
                            item.currency,
                          )}
                        </div>
                        {item.discount && (
                          <div className="text-xs text-green-600">
                            -
                            {item.discount.type === "percentage"
                              ? `${item.discount.value}%`
                              : formatCurrency(
                                  item.discount.value,
                                  item.currency,
                                )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    {item.features && item.features.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Inclui:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {item.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              {feature}
                            </li>
                          ))}
                          {item.features.length > 3 && (
                            <li className="text-gray-400">
                              +{item.features.length - 3} mais
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {hasItems() && (
            <div className="border-t bg-white p-6">
              {/* Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    {formatCurrency(summary.subtotal, summary.currency)}
                  </span>
                </div>

                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>
                      -{formatCurrency(summary.discount, summary.currency)}
                    </span>
                  </div>
                )}

                {summary.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Impostos</span>
                    <span>{formatCurrency(summary.tax, summary.currency)}</span>
                  </div>
                )}

                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(summary.total, summary.currency)}</span>
                </div>

                {summary.savings && summary.savings > 0 && (
                  <div className="text-center text-sm text-green-600">
                    Você economiza{" "}
                    {formatCurrency(summary.savings, summary.currency)}!
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? "Processando..." : "Finalizar Compra"}
                </button>

                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
