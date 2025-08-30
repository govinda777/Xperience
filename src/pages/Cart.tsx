import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../types/cart';
import { ShoppingBag, Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeItem, 
    updateQuantity, 
    getCartSummary, 
    hasItems,
    isLoading,
    clearCart 
  } = useCart();
  
  const summary = getCartSummary();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/plans');
  };

  if (!hasItems()) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h1>
            <p className="text-gray-600 mb-8">
              Adicione alguns planos para começar sua jornada de mentoria
            </p>
            <button
              onClick={handleContinueShopping}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Ver Planos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            Carrinho de Compras
          </h1>
          <p className="text-gray-600 mt-2">
            {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'itens'} no seu carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items do Carrinho */}
          <div className="lg:col-span-2 space-y-4">
            {cart?.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.name}
                      {item.isPopular && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Popular
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 mb-3">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Duração: {item.duration} meses</span>
                      <span>•</span>
                      <span>{item.features.length} recursos inclusos</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recursos inclusos:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {item.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                    {item.features.length > 6 && (
                      <div className="text-sm text-gray-500 col-span-2">
                        +{item.features.length - 6} recursos adicionais
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantidade e Preço */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Quantidade:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity, item.currency)}
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-sm text-gray-500">
                        {formatCurrency(item.price, item.currency)} cada
                      </div>
                    )}
                    {item.discount && (
                      <div className="text-sm text-green-600">
                        Desconto: -{item.discount.type === 'percentage' 
                          ? `${item.discount.value}%` 
                          : formatCurrency(item.discount.value, item.currency)
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Resumo do Pedido
              </h3>
              
              {/* Itens */}
              <div className="space-y-3 mb-6">
                {cart?.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.price * item.quantity, item.currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totais */}
              <div className="space-y-3 mb-6 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(summary.subtotal, summary.currency)}
                  </span>
                </div>
                
                {summary.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>-{formatCurrency(summary.discount, summary.currency)}</span>
                  </div>
                )}
                
                {summary.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Impostos</span>
                    <span className="font-medium">
                      {formatCurrency(summary.tax, summary.currency)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(summary.total, summary.currency)}</span>
                </div>
                
                {summary.savings && summary.savings > 0 && (
                  <div className="text-center text-sm text-green-600 bg-green-50 p-2 rounded">
                    Você economiza {formatCurrency(summary.savings, summary.currency)}!
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? 'Processando...' : 'Finalizar Compra'}
                </button>
                
                <button
                  onClick={handleContinueShopping}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Continuar Comprando
                </button>
                
                <button
                  onClick={clearCart}
                  disabled={isLoading}
                  className="w-full text-red-600 hover:text-red-700 text-sm font-medium py-2 transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>

              {/* Garantia */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Garantia de 30 dias</span>
                </div>
                <p className="text-xs text-gray-500">
                  Não ficou satisfeito? Devolvemos seu dinheiro em até 30 dias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
