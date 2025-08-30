import { CartService } from '../cart';
import { CartItem, Cart, CartSummary } from '../../types/cart';

describe('CartService', () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const mockCartItem: CartItem = {
    id: 'plan-1',
    name: 'Plano Essencial',
    description: 'Mentoria individual',
    price: 3000,
    currency: 'BRL',
    quantity: 1,
    duration: 3,
    features: ['Mentoria individual', 'Suporte dedicado'],
    isPopular: true
  };

  const mockCartItem2: CartItem = {
    id: 'plan-2',
    name: 'Plano Start',
    description: 'Plano básico',
    price: 1500,
    currency: 'BRL',
    quantity: 2,
    duration: 3,
    features: ['Mentoria básica'],
    isPopular: false,
    discount: {
      type: 'percentage',
      value: 10
    }
  };

  describe('Cart Creation and Management', () => {
    it('should create a new cart', () => {
      const cart = cartService.createCart();

      expect(cart).toBeDefined();
      expect(cart.id).toBeDefined();
      expect(cart.items).toEqual([]);
      expect(cart.createdAt).toBeInstanceOf(Date);
      expect(cart.updatedAt).toBeInstanceOf(Date);
    });

    it('should get current cart', () => {
      const cart = cartService.createCart();
      const retrievedCart = cartService.getCurrentCart();

      expect(retrievedCart).toEqual(cart);
    });

    it('should return null when no cart exists', () => {
      const cart = cartService.getCurrentCart();
      expect(cart).toBeNull();
    });

    it('should clear cart', () => {
      cartService.createCart();
      cartService.addItem(mockCartItem);
      
      cartService.clearCart();
      
      const cart = cartService.getCurrentCart();
      expect(cart).toBeNull();
    });
  });

  describe('Item Management', () => {
    beforeEach(() => {
      cartService.createCart();
    });

    it('should add item to cart', () => {
      const result = cartService.addItem(mockCartItem);

      expect(result.success).toBe(true);
      expect(result.cart?.items).toHaveLength(1);
      expect(result.cart?.items[0]).toEqual(mockCartItem);
    });

    it('should increase quantity when adding existing item', () => {
      cartService.addItem(mockCartItem);
      const result = cartService.addItem(mockCartItem);

      expect(result.success).toBe(true);
      expect(result.cart?.items).toHaveLength(1);
      expect(result.cart?.items[0].quantity).toBe(2);
    });

    it('should add multiple different items', () => {
      cartService.addItem(mockCartItem);
      const result = cartService.addItem(mockCartItem2);

      expect(result.success).toBe(true);
      expect(result.cart?.items).toHaveLength(2);
    });

    it('should remove item from cart', () => {
      cartService.addItem(mockCartItem);
      cartService.addItem(mockCartItem2);

      const result = cartService.removeItem('plan-1');

      expect(result.success).toBe(true);
      expect(result.cart?.items).toHaveLength(1);
      expect(result.cart?.items[0].id).toBe('plan-2');
    });

    it('should return error when removing non-existent item', () => {
      const result = cartService.removeItem('non-existent');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Item não encontrado no carrinho');
    });

    it('should update item quantity', () => {
      cartService.addItem(mockCartItem);
      const result = cartService.updateQuantity('plan-1', 5);

      expect(result.success).toBe(true);
      expect(result.cart?.items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is set to 0', () => {
      cartService.addItem(mockCartItem);
      const result = cartService.updateQuantity('plan-1', 0);

      expect(result.success).toBe(true);
      expect(result.cart?.items).toHaveLength(0);
    });

    it('should return error when updating quantity of non-existent item', () => {
      const result = cartService.updateQuantity('non-existent', 2);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Item não encontrado no carrinho');
    });

    it('should return error for invalid quantity', () => {
      cartService.addItem(mockCartItem);
      const result = cartService.updateQuantity('plan-1', -1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Quantidade deve ser maior ou igual a 0');
    });

    it('should get specific item from cart', () => {
      cartService.addItem(mockCartItem);
      const item = cartService.getItem('plan-1');

      expect(item).toEqual(mockCartItem);
    });

    it('should return undefined for non-existent item', () => {
      const item = cartService.getItem('non-existent');
      expect(item).toBeUndefined();
    });
  });

  describe('Cart Summary and Calculations', () => {
    beforeEach(() => {
      cartService.createCart();
    });

    it('should calculate cart summary correctly', () => {
      cartService.addItem(mockCartItem); // 3000 * 1 = 3000
      cartService.addItem(mockCartItem2); // 1500 * 2 = 3000, with 10% discount = 2700

      const summary = cartService.getCartSummary();

      expect(summary.itemCount).toBe(3); // 1 + 2
      expect(summary.subtotal).toBe(6000); // 3000 + 3000
      expect(summary.discount).toBe(300); // 10% of 3000
      expect(summary.total).toBe(5700); // 6000 - 300
      expect(summary.currency).toBe('BRL');
      expect(summary.savings).toBe(300);
    });

    it('should return empty summary for empty cart', () => {
      const summary = cartService.getCartSummary();

      expect(summary.itemCount).toBe(0);
      expect(summary.subtotal).toBe(0);
      expect(summary.discount).toBe(0);
      expect(summary.total).toBe(0);
      expect(summary.currency).toBe('BRL');
      expect(summary.savings).toBe(0);
    });

    it('should calculate percentage discount correctly', () => {
      const itemWithPercentageDiscount: CartItem = {
        ...mockCartItem,
        discount: { type: 'percentage', value: 20 }
      };

      cartService.addItem(itemWithPercentageDiscount);
      const summary = cartService.getCartSummary();

      expect(summary.discount).toBe(600); // 20% of 3000
      expect(summary.total).toBe(2400); // 3000 - 600
    });

    it('should calculate fixed discount correctly', () => {
      const itemWithFixedDiscount: CartItem = {
        ...mockCartItem,
        discount: { type: 'fixed', value: 500 }
      };

      cartService.addItem(itemWithFixedDiscount);
      const summary = cartService.getCartSummary();

      expect(summary.discount).toBe(500);
      expect(summary.total).toBe(2500); // 3000 - 500
    });

    it('should handle mixed currencies correctly', () => {
      const usdItem: CartItem = {
        ...mockCartItem,
        id: 'usd-plan',
        currency: 'USD'
      };

      cartService.addItem(mockCartItem); // BRL
      cartService.addItem(usdItem); // USD

      const summary = cartService.getCartSummary();
      // Should default to first item's currency
      expect(summary.currency).toBe('BRL');
    });

    it('should check if cart has items', () => {
      expect(cartService.hasItems()).toBe(false);

      cartService.addItem(mockCartItem);
      expect(cartService.hasItems()).toBe(true);

      cartService.removeItem('plan-1');
      expect(cartService.hasItems()).toBe(false);
    });

    it('should get item count correctly', () => {
      expect(cartService.getItemCount()).toBe(0);

      cartService.addItem(mockCartItem);
      expect(cartService.getItemCount()).toBe(1);

      cartService.addItem(mockCartItem2);
      expect(cartService.getItemCount()).toBe(3); // 1 + 2
    });
  });

  describe('Persistence', () => {
    it('should persist cart to localStorage', () => {
      cartService.createCart();
      cartService.addItem(mockCartItem);

      const storedCart = localStorage.getItem('xperience_cart');
      expect(storedCart).toBeDefined();

      const parsedCart = JSON.parse(storedCart!);
      expect(parsedCart.items).toHaveLength(1);
      expect(parsedCart.items[0].id).toBe('plan-1');
    });

    it('should load cart from localStorage', () => {
      // Simulate existing cart in localStorage
      const existingCart: Cart = {
        id: 'existing-cart',
        items: [mockCartItem],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      localStorage.setItem('xperience_cart', JSON.stringify(existingCart));

      // Create new service instance to test loading
      const newCartService = new CartService();
      const loadedCart = newCartService.getCurrentCart();

      expect(loadedCart).toBeDefined();
      expect(loadedCart?.id).toBe('existing-cart');
      expect(loadedCart?.items).toHaveLength(1);
      expect(loadedCart?.items[0].id).toBe('plan-1');
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('xperience_cart', 'invalid-json');

      const newCartService = new CartService();
      const cart = newCartService.getCurrentCart();

      expect(cart).toBeNull();
    });

    it('should update cart timestamp on modifications', () => {
      cartService.createCart();
      const initialCart = cartService.getCurrentCart();
      const initialTimestamp = initialCart?.updatedAt;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        cartService.addItem(mockCartItem);
        const updatedCart = cartService.getCurrentCart();
        const updatedTimestamp = updatedCart?.updatedAt;

        expect(updatedTimestamp).not.toEqual(initialTimestamp);
      }, 10);
    });
  });

  describe('Error Handling', () => {
    it('should handle operations on non-existent cart', () => {
      const result = cartService.addItem(mockCartItem);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Carrinho não encontrado. Crie um carrinho primeiro.');
    });

    it('should validate item data', () => {
      cartService.createCart();

      const invalidItem = {
        ...mockCartItem,
        price: -100 // Invalid price
      };

      const result = cartService.addItem(invalidItem);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Preço deve ser maior que 0');
    });

    it('should validate required fields', () => {
      cartService.createCart();

      const incompleteItem = {
        id: 'incomplete',
        name: '',
        price: 100,
        currency: 'BRL',
        quantity: 1
      } as CartItem;

      const result = cartService.addItem(incompleteItem);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Nome é obrigatório');
    });
  });

  describe('Cart Limits', () => {
    beforeEach(() => {
      cartService.createCart();
    });

    it('should enforce maximum quantity per item', () => {
      cartService.addItem(mockCartItem);
      const result = cartService.updateQuantity('plan-1', 1000);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Quantidade máxima');
    });

    it('should enforce maximum number of items', () => {
      // Add maximum allowed items
      for (let i = 0; i < 50; i++) {
        const item: CartItem = {
          ...mockCartItem,
          id: `plan-${i}`,
          name: `Plan ${i}`
        };
        cartService.addItem(item);
      }

      // Try to add one more
      const extraItem: CartItem = {
        ...mockCartItem,
        id: 'extra-plan',
        name: 'Extra Plan'
      };

      const result = cartService.addItem(extraItem);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Número máximo de itens');
    });
  });
});
