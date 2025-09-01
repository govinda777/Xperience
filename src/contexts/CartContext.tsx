import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Cart, 
  CartItem, 
  CartContextType, 
  CartSummary, 
  CheckoutSession, 
  CustomerInfo, 
  Address,
  Coupon,
  calculateCartTotals 
} from '../types/cart';

// Estado inicial do carrinho
const initialCart: Cart = {
  id: '',
  items: [],
  subtotal: 0,
  discount: 0,
  tax: 0,
  total: 0,
  currency: 'BRL',
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Reducer para gerenciar o estado do carrinho
interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  appliedCoupon: Coupon | null;
}

type CartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'APPLY_COUPON'; payload: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CURRENCY'; payload: 'BRL' | 'USD' | 'BTC' | 'USDT' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_CART':
      return { ...state, cart: action.payload };
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.cart.items.findIndex(
        item => item.planId === action.payload.planId
      );
      
      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Se o item já existe, aumenta a quantidade
        newItems = state.cart.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Se é um novo item, adiciona ao carrinho
        newItems = [...state.cart.items, action.payload];
      }
      
      const summary = calculateCartTotals(newItems, state.appliedCoupon || undefined);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          subtotal: summary.subtotal,
          discount: summary.discount,
          tax: summary.tax,
          total: summary.total,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.cart.items.filter(item => item.id !== action.payload);
      const summary = calculateCartTotals(newItems, state.appliedCoupon || undefined);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          subtotal: summary.subtotal,
          discount: summary.discount,
          tax: summary.tax,
          total: summary.total,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Se quantidade é 0 ou negativa, remove o item
        const newItems = state.cart.items.filter(item => item.id !== itemId);
        const summary = calculateCartTotals(newItems, state.appliedCoupon || undefined);
        
        return {
          ...state,
          cart: {
            ...state.cart,
            items: newItems,
            subtotal: summary.subtotal,
            discount: summary.discount,
            tax: summary.tax,
            total: summary.total,
            updatedAt: new Date(),
          },
        };
      }
      
      const newItems = state.cart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      const summary = calculateCartTotals(newItems, state.appliedCoupon || undefined);
      
      return {
        ...state,
        cart: {
          ...state.cart,
          items: newItems,
          subtotal: summary.subtotal,
          discount: summary.discount,
          tax: summary.tax,
          total: summary.total,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'APPLY_COUPON': {
      const summary = calculateCartTotals(state.cart.items, action.payload);
      
      return {
        ...state,
        appliedCoupon: action.payload,
        cart: {
          ...state.cart,
          couponCode: action.payload.code,
          subtotal: summary.subtotal,
          discount: summary.discount,
          tax: summary.tax,
          total: summary.total,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'REMOVE_COUPON': {
      const summary = calculateCartTotals(state.cart.items);
      
      return {
        ...state,
        appliedCoupon: null,
        cart: {
          ...state.cart,
          couponCode: undefined,
          subtotal: summary.subtotal,
          discount: summary.discount,
          tax: summary.tax,
          total: summary.total,
          updatedAt: new Date(),
        },
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          ...initialCart,
          id: state.cart.id,
          userId: state.cart.userId,
        },
        appliedCoupon: null,
      };
    
    case 'SET_CURRENCY': {
      // Aqui você pode implementar conversão de moeda se necessário
      return {
        ...state,
        cart: {
          ...state.cart,
          currency: action.payload,
          updatedAt: new Date(),
        },
      };
    }
    
    default:
      return state;
  }
};

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, authenticated } = usePrivy();
  
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialCart,
    isLoading: false,
    error: null,
    appliedCoupon: null,
  });

  // Gerar ID único para o carrinho
  const generateCartId = (): string => {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Carregar carrinho do localStorage ou criar novo
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('xperience_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        } else {
          // Criar novo carrinho
          const newCart: Cart = {
            ...initialCart,
            id: generateCartId(),
            userId: undefined, // user?.id,
          };
          dispatch({ type: 'SET_CART', payload: newCart });
        }
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar carrinho' });
      }
    };

    loadCart();
  }, []); // [user]);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (state.cart.id) {
      localStorage.setItem('xperience_cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);

  // Atualizar userId quando usuário fizer login
  // useEffect(() => {
  //   if (authenticated && user && state.cart.userId !== user.id) {
  //     dispatch({
  //       type: 'SET_CART',
  //       payload: {
  //         ...state.cart,
  //         userId: user.id,
  //         updatedAt: new Date(),
  //       },
  //     });
  //   }
  // }, [authenticated, user, state.cart.userId]);

  // Implementação das funções do contexto
  const addItem = async (itemData: Omit<CartItem, 'id' | 'quantity'>): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const newItem: CartItem = {
        ...itemData,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        quantity: 1,
      };

      dispatch({ type: 'ADD_ITEM', payload: newItem });
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao adicionar item ao carrinho' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeItem = async (itemId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'REMOVE_ITEM', payload: itemId });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao remover item do carrinho' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao atualizar quantidade' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const applyCoupon = async (couponCode: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Aqui você faria uma chamada para a API para validar o cupom
      // Por enquanto, vamos simular alguns cupons
      const mockCoupons: Record<string, Coupon> = {
        'WELCOME10': {
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          validFrom: new Date('2024-01-01'),
          validTo: new Date('2024-12-31'),
          usageLimit: 1000,
          usedCount: 0,
          isActive: true,
          description: '10% de desconto para novos usuários',
        },
        'SAVE50': {
          code: 'SAVE50',
          type: 'fixed',
          value: 50,
          validFrom: new Date('2024-01-01'),
          validTo: new Date('2024-12-31'),
          usageLimit: 500,
          usedCount: 0,
          isActive: true,
          description: 'R$ 50 de desconto',
        },
      };

      const coupon = mockCoupons[couponCode.toUpperCase()];
      
      if (!coupon) {
        dispatch({ type: 'SET_ERROR', payload: 'Cupom inválido' });
        return false;
      }

      if (!coupon.isActive) {
        dispatch({ type: 'SET_ERROR', payload: 'Cupom inativo' });
        return false;
      }

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        dispatch({ type: 'SET_ERROR', payload: 'Cupom expirado' });
        return false;
      }

      if (coupon.minAmount && state.cart.subtotal < coupon.minAmount) {
        dispatch({ type: 'SET_ERROR', payload: `Valor mínimo de R$ ${coupon.minAmount} não atingido` });
        return false;
      }

      dispatch({ type: 'APPLY_COUPON', payload: coupon });
      return true;
    } catch (error) {
      console.error('Erro ao aplicar cupom:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao aplicar cupom' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const removeCoupon = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'REMOVE_COUPON' });
    } catch (error) {
      console.error('Erro ao remover cupom:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao remover cupom' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('xperience_cart');
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao limpar carrinho' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setCurrency = async (currency: 'BRL' | 'USD' | 'BTC' | 'USDT'): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_CURRENCY', payload: currency });
    } catch (error) {
      console.error('Erro ao alterar moeda:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao alterar moeda' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getCartSummary = (): CartSummary => {
    return calculateCartTotals(state.cart.items, state.appliedCoupon || undefined);
  };

  const getItemCount = (): number => {
    return state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const hasItems = (): boolean => {
    return state.cart.items.length > 0;
  };

  const createCheckoutSession = async (
    customerInfo: CustomerInfo,
    billingAddress?: Address
  ): Promise<CheckoutSession> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // if (!authenticated || !user) {
      //   throw new Error('Usuário não autenticado');
      // }

      if (state.cart.items.length === 0) {
        throw new Error('Carrinho vazio');
      }

      // Criar sessão de checkout
      const checkoutSession: CheckoutSession = {
        id: `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        cartId: state.cart.id,
        userId: user?.id || 'anonymous',
        status: 'pending',
        customerInfo,
        billingAddress,
        total: state.cart.total,
        currency: state.cart.currency,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      };

      // Aqui você salvaria a sessão no backend
      // Por enquanto, vamos salvar no localStorage
      localStorage.setItem(`checkout_${checkoutSession.id}`, JSON.stringify(checkoutSession));

      return checkoutSession;
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar sessão de checkout' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: CartContextType = {
    cart: state.cart,
    isLoading: state.isLoading,
    error: state.error,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
    setCurrency,
    getCartSummary,
    getItemCount,
    hasItems,
    createCheckoutSession,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
