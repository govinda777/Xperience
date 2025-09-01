import { Cart, CartItem, CartSummary } from '../types/cart';

export class CartService {
  private cart: Cart | null = null;
  private readonly STORAGE_KEY = 'xperience_cart';

  constructor() {
    this.loadFromStorage();
  }

  // Cart Management
  createCart(): Cart {
    const newCart: Cart = {
      id: this.generateCartId(),
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: undefined,
      currency: 'BRL',
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };

    this.cart = newCart;
    this.saveToStorage();
    return newCart;
  }

  getCurrentCart(): Cart | null {
    return this.cart;
  }

  clearCart(): void {
    this.cart = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Item Management
  addItem(item: CartItem): boolean {
    if (!this.cart) {
      this.createCart();
    }

    if (!this.validateItem(item)) {
      return false;
    }

    const existingItemIndex = this.cart!.items.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const existingItem = this.cart!.items[existingItemIndex];
      const newQuantity = existingItem.quantity + item.quantity;
      
      if (newQuantity > this.getMaxQuantityPerItem()) {
        return false;
      }

      this.cart!.items[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity
      };
    } else {
      // Add new item
      if (this.cart!.items.length >= this.getMaxItemsInCart()) {
        return false;
      }

      this.cart!.items.push(item);
    }

    this.updateCartTimestamp();
    this.saveToStorage();
    return true;
  }

  removeItem(itemId: string): boolean {
    if (!this.cart) {
      return false;
    }

    const initialLength = this.cart.items.length;
    this.cart.items = this.cart.items.filter(item => item.id !== itemId);

    if (this.cart.items.length !== initialLength) {
      this.updateCartTimestamp();
      this.saveToStorage();
      return true;
    }

    return false;
  }

  updateQuantity(itemId: string, quantity: number): { success: boolean; error?: string } {
    if (!this.cart) {
      return { success: false, error: 'Cart not found' };
    }

    if (quantity <= 0) {
      return { success: false, error: 'Invalid quantity' };
    }

    if (quantity > this.getMaxQuantityPerItem()) {
      return { success: false, error: 'Quantity exceeds maximum allowed' };
    }

    const itemIndex = this.cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      return { success: false, error: 'Item not found' };
    }

    this.cart.items[itemIndex].quantity = quantity;
    this.updateCartTimestamp();
    this.saveToStorage();
    
    return { success: true };
  }

  getItem(itemId: string): CartItem | undefined {
    if (!this.cart) {
      return undefined;
    }

    return this.cart.items.find(item => item.id === itemId);
  }

  // Cart Summary and Calculations
  getCartSummary(): CartSummary {
    if (!this.cart || this.cart.items.length === 0) {
      return {
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
        currency: 'BRL'
      };
    }

    const subtotal = this.cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    let totalDiscount = 0;

    // Calculate item-level discounts
    this.cart.items.forEach(item => {
      if (item.discount) {
        const itemTotal = item.price * item.quantity;
        if (item.discount.type === 'percentage') {
          totalDiscount += itemTotal * (item.discount.value / 100);
        } else if (item.discount.type === 'fixed') {
          totalDiscount += item.discount.value;
        }
      }
    });

    const total = subtotal - totalDiscount;
    const itemCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);

          return {
        subtotal,
        discount: totalDiscount,
        tax: 0, // Tax calculation would go here
        total: Math.max(0, total), // Ensure total is never negative
        itemCount,
        currency: this.cart.currency
      };
  }

  hasItems(): boolean {
    return this.cart !== null && this.cart.items.length > 0;
  }

  getItemCount(): number {
    if (!this.cart) {
      return 0;
    }

    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Discount Management
  applyDiscount(discount: any): boolean {
    if (!this.cart) {
      return false;
    }

    // Apply discount logic here
    // This is a simplified implementation
    this.updateCartTimestamp();
    this.saveToStorage();
    return true;
  }

  // Private Helper Methods
  private generateCartId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateCartTimestamp(): void {
    if (this.cart) {
      this.cart.updatedAt = new Date();
    }
  }

  private validateItem(item: CartItem): boolean {
    if (!item.id || !item.name || item.price < 0 || item.quantity <= 0) {
      return false;
    }

    // Additional validation rules
    if (item.quantity > this.getMaxQuantityPerItem()) {
      return false;
    }

    return true;
  }

  private getMaxQuantityPerItem(): number {
    return 10; // Maximum 10 of each item
  }

  private getMaxItemsInCart(): number {
    return 50; // Maximum 50 different items
  }

  private saveToStorage(): void {
    if (this.cart) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }

  private loadFromStorage(): void {
    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        
        // Validate the loaded cart structure
        if (this.isValidCart(parsedCart)) {
          // Convert date strings back to Date objects
          parsedCart.createdAt = new Date(parsedCart.createdAt);
          parsedCart.updatedAt = new Date(parsedCart.updatedAt);
          if (parsedCart.expiresAt) {
            parsedCart.expiresAt = new Date(parsedCart.expiresAt);
          }
          
          this.cart = parsedCart;
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private isValidCart(cart: any): boolean {
    return (
      cart &&
      typeof cart.id === 'string' &&
      Array.isArray(cart.items) &&
      cart.createdAt &&
      cart.updatedAt
    );
  }
}

