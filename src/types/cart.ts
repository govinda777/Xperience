// Tipos para o sistema de carrinho de compras

export interface CartItem {
  id: string;
  planId: string;
  name: string;
  description: string;
  price: number;
  currency: 'BRL' | 'USD' | 'BTC' | 'USDT';
  quantity: number;
  duration: number; // em meses
  features: string[];
  isPopular?: boolean;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    code?: string;
  };
  metadata?: Record<string, any>;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: 'BRL' | 'USD' | 'BTC' | 'USDT';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  couponCode?: string;
  metadata?: Record<string, any>;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  savings?: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  applicablePlans?: string[];
  description?: string;
}

export interface CartAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'APPLY_COUPON' | 'REMOVE_COUPON' | 'CLEAR_CART' | 'SET_CURRENCY';
  payload?: any;
}

export interface CheckoutSession {
  id: string;
  cartId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
  paymentMethod?: 'pix' | 'bitcoin' | 'usdt' | 'github';
  paymentIntentId?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  customerInfo: CustomerInfo;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  metadata?: Record<string, any>;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  document?: string; // CPF/CNPJ
  documentType?: 'cpf' | 'cnpj';
  birthDate?: Date;
}

export interface Order {
  id: string;
  checkoutSessionId: string;
  userId: string;
  items: CartItem[];
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'pix' | 'bitcoin' | 'usdt' | 'github';
  paymentId?: string;
  transactionHash?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  customerInfo: CustomerInfo;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  setCurrency: (currency: 'BRL' | 'USD' | 'BTC' | 'USDT') => Promise<void>;
  
  // Getters
  getCartSummary: () => CartSummary;
  getItemCount: () => number;
  hasItems: () => boolean;
  
  // Checkout
  createCheckoutSession: (customerInfo: CustomerInfo, billingAddress?: Address) => Promise<CheckoutSession>;
}

// Utilitários
export const calculateCartTotals = (items: CartItem[], coupon?: Coupon): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }
  }
  
  // Adicionar desconto por item se aplicável
  const itemDiscounts = items.reduce((sum, item) => {
    if (item.discount) {
      if (item.discount.type === 'percentage') {
        return sum + ((item.price * item.quantity * item.discount.value) / 100);
      } else {
        return sum + (item.discount.value * item.quantity);
      }
    }
    return sum;
  }, 0);
  
  discount += itemDiscounts;
  
  // Calcular impostos (se aplicável)
  const tax = 0; // Por enquanto sem impostos
  
  const total = Math.max(0, subtotal - discount + tax);
  
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discount,
    tax,
    total,
    currency: items[0]?.currency || 'BRL',
    savings: discount,
  };
};

export const formatCurrency = (amount: number, currency: string): string => {
  switch (currency) {
    case 'BRL':
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(amount);
    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    case 'BTC':
      return `₿ ${amount.toFixed(8)}`;
    case 'USDT':
      return `${amount.toFixed(2)} USDT`;
    default:
      return amount.toString();
  }
};
