import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useCart, CartProvider } from '../../contexts/CartContext';
import { CartItem } from '../../types/cart';

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
  quantity: 1,
  duration: 3,
  features: ['Mentoria básica'],
  isPopular: false
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  React.createElement(CartProvider, null, children)
);

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toBeNull();
    expect(result.current.hasItems()).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should add item to cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      const addResult = await result.current.addItem(mockCartItem);
      expect(addResult.success).toBe(true);
    });

    expect(result.current.cart).toBeDefined();
    expect(result.current.cart?.items).toHaveLength(1);
    expect(result.current.cart?.items[0]).toEqual(mockCartItem);
    expect(result.current.hasItems()).toBe(true);
  });

  it('should handle loading state during add item', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    let loadingState: boolean;

    act(() => {
      result.current.addItem(mockCartItem);
      loadingState = result.current.isLoading;
    });

    expect(loadingState!).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should remove item from cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item first
    await act(async () => {
      await result.current.addItem(mockCartItem);
    });

    expect(result.current.cart?.items).toHaveLength(1);

    // Remove item
    await act(async () => {
      const removeResult = await result.current.removeItem('plan-1');
      expect(removeResult.success).toBe(true);
    });

    expect(result.current.cart?.items).toHaveLength(0);
    expect(result.current.hasItems()).toBe(false);
  });

  it('should update item quantity', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item first
    await act(async () => {
      await result.current.addItem(mockCartItem);
    });

    // Update quantity
    await act(async () => {
      const updateResult = await result.current.updateQuantity('plan-1', 3);
      expect(updateResult.success).toBe(true);
    });

    expect(result.current.cart?.items[0].quantity).toBe(3);
  });

  it('should get cart summary correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add items
    await act(async () => {
      await result.current.addItem(mockCartItem);
      await result.current.addItem(mockCartItem2);
    });

    const summary = result.current.getCartSummary();

    expect(summary.itemCount).toBe(2);
    expect(summary.subtotal).toBe(4500); // 3000 + 1500
    expect(summary.total).toBe(4500);
    expect(summary.currency).toBe('BRL');
  });

  it('should get specific item from cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockCartItem);
    });

    const item = result.current.getItem('plan-1');
    expect(item).toEqual(mockCartItem);

    const nonExistentItem = result.current.getItem('non-existent');
    expect(nonExistentItem).toBeUndefined();
  });

  it('should clear cart', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add items first
    await act(async () => {
      await result.current.addItem(mockCartItem);
      await result.current.addItem(mockCartItem2);
    });

    expect(result.current.hasItems()).toBe(true);

    // Clear cart
    await act(async () => {
      await result.current.clearCart();
    });

    expect(result.current.cart).toBeNull();
    expect(result.current.hasItems()).toBe(false);
  });

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Try to remove item from empty cart
    await act(async () => {
      const removeResult = await result.current.removeItem('non-existent');
      expect(removeResult.success).toBe(false);
      expect(removeResult.error).toBeDefined();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should persist cart state', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockCartItem);
    });

    // Check if cart is persisted in localStorage
    const storedCart = localStorage.getItem('xperience_cart');
    expect(storedCart).toBeDefined();

    const parsedCart = JSON.parse(storedCart!);
    expect(parsedCart.items).toHaveLength(1);
    expect(parsedCart.items[0].id).toBe('plan-1');
  });

  it('should load existing cart from localStorage', () => {
    // Pre-populate localStorage
    const existingCart = {
      id: 'existing-cart',
      items: [mockCartItem],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('xperience_cart', JSON.stringify(existingCart));

    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cart).toBeDefined();
    expect(result.current.cart?.items).toHaveLength(1);
    expect(result.current.cart?.items[0].id).toBe('plan-1');
    expect(result.current.hasItems()).toBe(true);
  });

  it('should handle multiple items correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    await act(async () => {
      await result.current.addItem(mockCartItem);
      await result.current.addItem(mockCartItem2);
    });

    expect(result.current.cart?.items).toHaveLength(2);

    const summary = result.current.getCartSummary();
    expect(summary.itemCount).toBe(2);
    expect(summary.subtotal).toBe(4500);
  });

  it('should increase quantity when adding existing item', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Add item twice
    await act(async () => {
      await result.current.addItem(mockCartItem);
      await result.current.addItem(mockCartItem);
    });

    expect(result.current.cart?.items).toHaveLength(1);
    expect(result.current.cart?.items[0].quantity).toBe(2);

    const summary = result.current.getCartSummary();
    expect(summary.itemCount).toBe(2);
    expect(summary.subtotal).toBe(6000); // 3000 * 2
  });

  it('should handle cart operations with loading states', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Test loading state during add
    act(() => {
      result.current.addItem(mockCartItem);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);

    // Test loading state during update
    act(() => {
      result.current.updateQuantity('plan-1', 2);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should return empty summary for empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const summary = result.current.getCartSummary();

    expect(summary.itemCount).toBe(0);
    expect(summary.subtotal).toBe(0);
    expect(summary.discount).toBe(0);
    expect(summary.total).toBe(0);
    expect(summary.currency).toBe('BRL');
    expect(summary.savings).toBe(0);
  });

  it('should handle concurrent operations correctly', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    // Simulate concurrent operations
    await act(async () => {
      const promises = [
        result.current.addItem(mockCartItem),
        result.current.addItem(mockCartItem2)
      ];

      const results = await Promise.all(promises);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    expect(result.current.cart?.items).toHaveLength(2);
  });
});
