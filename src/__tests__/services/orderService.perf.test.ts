
import { orderService } from '../../services/orderService';
import { Order } from '../../types/cart';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('OrderService Performance', () => {
  const ORDER_COUNT = 1000;
  const READ_OPERATIONS = 1000;

  // Helper to generate a large dataset
  const generateOrders = (count: number): Order[] => {
    const orders: Order[] = [];
    for (let i = 0; i < count; i++) {
      orders.push({
        id: `order_${i}`,
        checkoutSessionId: `session_${i}`,
        userId: 'test-user',
        items: [],
        status: 'completed',
        paymentStatus: 'completed',
        paymentMethod: 'pix',
        subtotal: 100,
        discount: 0,
        tax: 0,
        total: 100,
        currency: 'BRL',
        customerInfo: {
          name: 'Test User',
          email: 'test@example.com'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: new Date()
      });
    }
    return orders;
  };

  beforeAll(() => {
    // We populate localStorage once with a large dataset
    orderService.clearLocalData();
    const orders = generateOrders(ORDER_COUNT);
    localStorage.setItem('xperience_orders', JSON.stringify(orders));
  });

  test('Benchmark getAllOrdersLocally (via getUserOrdersLocally)', () => {
    // Clear any potential cache in the service (if implemented in future, though we are "before" optimization)
    // To ensure we measure "cold" vs "warm" behavior if we were testing cache specifically,
    // but for the baseline, we assume the code always parses.

    // Note: In the baseline code, there IS NO cache, so every call reads localStorage.

    const start = performance.now();

    for (let i = 0; i < READ_OPERATIONS; i++) {
      // Accessing private method via casting for benchmark purposes
      (orderService as any).getUserOrdersLocally('test-user');
    }

    const end = performance.now();
    const duration = end - start;
    console.log(`BENCHMARK_RESULT: ${READ_OPERATIONS} reads of ${ORDER_COUNT} orders took ${duration.toFixed(2)}ms`);
  });

  test('Correctness: getUserOrdersLocally returns orders', () => {
     const orders = (orderService as any).getUserOrdersLocally('test-user');
     expect(orders.length).toBe(ORDER_COUNT);
     expect(orders[0].id).toBe('order_0');
  });

  test('Correctness: saveOrderLocally updates data (and eventually cache)', () => {
      const newOrder: Order = {
        id: `order_new`,
        checkoutSessionId: `session_new`,
        userId: 'test-user',
        items: [],
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: 'bitcoin',
        subtotal: 200,
        discount: 0,
        tax: 0,
        total: 200,
        currency: 'USD',
        customerInfo: { name: 'New User', email: 'new@example.com' },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save order
      (orderService as any).saveOrderLocally(newOrder);

      // Verify it can be retrieved
      const orders = (orderService as any).getUserOrdersLocally('test-user');
      const found = orders.find((o: Order) => o.id === 'order_new');
      expect(found).toBeDefined();
      expect(found?.total).toBe(200);

      // Clean up for other tests if needed, though this is the end
  });
});
