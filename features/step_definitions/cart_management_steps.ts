import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@jest/globals';
import { CartService } from '../../src/services/cart';
import { CartItem } from '../../src/types/cart';

// Mock data for plans
const mockPlans = {
  'Start': {
    id: 'plan-start',
    name: 'Plano Start',
    description: 'Plano básico para iniciantes',
    price: 1500,
    currency: 'BRL',
    quantity: 1,
    duration: 3,
    features: ['Mentoria básica', 'Material de apoio'],
    isPopular: false
  } as CartItem,
  'Essencial': {
    id: 'plan-essencial',
    name: 'Plano Essencial',
    description: 'Mentoria individual com acompanhamento',
    price: 3000,
    currency: 'BRL',
    quantity: 1,
    duration: 3,
    features: ['Mentoria individual', 'Suporte dedicado'],
    isPopular: true
  } as CartItem,
  'Principal': {
    id: 'plan-principal',
    name: 'Plano Principal',
    description: 'Mentoria completa',
    price: 6000,
    currency: 'BRL',
    quantity: 1,
    duration: 3,
    features: ['Mentoria completa', 'Suporte premium'],
    isPopular: true
  } as CartItem
};

let cartService: CartService;
let currentCart: any;
let lastOperationResult: any;

Given('I am on the Xperience website', function () {
  // Initialize the application context
  cartService = new CartService();
});

Given('I have a clean cart', function () {
  cartService.clearCart();
  currentCart = null;
});

Given('I am viewing the plans page', function () {
  // Simulate being on the plans page
  // In a real scenario, this would navigate to the plans page
});

Given('I have the {string} plan in my cart', function (planName: string) {
  const plan = mockPlans[planName as keyof typeof mockPlans];
  if (!plan) {
    throw new Error(`Plan ${planName} not found`);
  }

  if (!currentCart) {
    currentCart = cartService.createCart();
  }
  
  const result = cartService.addItem(plan);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

Given('I have the {string} plan in my cart with quantity {int}', function (planName: string, quantity: number) {
  const plan = mockPlans[planName as keyof typeof mockPlans];
  if (!plan) {
    throw new Error(`Plan ${planName} not found`);
  }

  if (!currentCart) {
    currentCart = cartService.createCart();
  }

  const planWithQuantity = { ...plan, quantity };
  const result = cartService.addItem(planWithQuantity);
  expect(result.success).toBe(true);
  
  if (quantity > 1) {
    const updateResult = cartService.updateQuantity(plan.id, quantity);
    expect(updateResult.success).toBe(true);
    currentCart = updateResult.cart;
  } else {
    currentCart = result.cart;
  }
});

Given('I have {int} different plans in my cart', function (count: number) {
  if (!currentCart) {
    currentCart = cartService.createCart();
  }

  const planNames = Object.keys(mockPlans).slice(0, count);
  planNames.forEach(planName => {
    const plan = mockPlans[planName as keyof typeof mockPlans];
    const result = cartService.addItem(plan);
    expect(result.success).toBe(true);
    currentCart = result.cart;
  });
});

Given('I have multiple plans in my cart', function () {
  if (!currentCart) {
    currentCart = cartService.createCart();
  }

  Object.values(mockPlans).forEach(plan => {
    const result = cartService.addItem(plan);
    expect(result.success).toBe(true);
    currentCart = result.cart;
  });
});

Given('I have plans in my cart', function () {
  if (!currentCart) {
    currentCart = cartService.createCart();
  }

  const result = cartService.addItem(mockPlans.Essencial);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

Given('my cart is empty', function () {
  cartService.clearCart();
  currentCart = null;
});

Given('I have a plan with {int}% discount in my cart', function (discountPercentage: number) {
  if (!currentCart) {
    currentCart = cartService.createCart();
  }

  const planWithDiscount = {
    ...mockPlans.Essencial,
    discount: {
      type: 'percentage' as const,
      value: discountPercentage
    }
  };

  const result = cartService.addItem(planWithDiscount);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

When('I select the {string} plan', function (planName: string) {
  // Simulate selecting a plan
  this.selectedPlan = mockPlans[planName as keyof typeof mockPlans];
  expect(this.selectedPlan).toBeDefined();
});

When('I click {string}', function (buttonText: string) {
  if (buttonText === 'Add to Cart') {
    if (!currentCart) {
      currentCart = cartService.createCart();
    }
    
    const result = cartService.addItem(this.selectedPlan);
    lastOperationResult = result;
    if (result.success) {
      currentCart = result.cart;
    }
  } else if (buttonText === 'Clear Cart') {
    cartService.clearCart();
    currentCart = null;
    lastOperationResult = { success: true };
  }
});

When('I add the {string} plan to cart', function (planName: string) {
  const plan = mockPlans[planName as keyof typeof mockPlans];
  if (!plan) {
    throw new Error(`Plan ${planName} not found`);
  }

  if (!currentCart) {
    currentCart = cartService.createCart();
  }

  const result = cartService.addItem(plan);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

When('I add the {string} plan again', function (planName: string) {
  const plan = mockPlans[planName as keyof typeof mockPlans];
  if (!plan) {
    throw new Error(`Plan ${planName} not found`);
  }

  const result = cartService.addItem(plan);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

When('I increase the quantity to {int}', function (quantity: number) {
  const firstItem = currentCart?.items[0];
  if (!firstItem) {
    throw new Error('No items in cart to update');
  }

  const result = cartService.updateQuantity(firstItem.id, quantity);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

When('I remove the {string} plan', function (planName: string) {
  const plan = mockPlans[planName as keyof typeof mockPlans];
  if (!plan) {
    throw new Error(`Plan ${planName} not found`);
  }

  const result = cartService.removeItem(plan.id);
  expect(result.success).toBe(true);
  currentCart = result.cart;
});

When('I close and reopen the browser', function () {
  // Simulate browser restart by creating a new cart service instance
  cartService = new CartService();
  currentCart = cartService.getCurrentCart();
});

When('I view the cart summary', function () {
  this.cartSummary = cartService.getCartSummary();
});

When('I try to add more than {int} of the same plan', function (maxQuantity: number) {
  const plan = mockPlans.Essencial;
  
  if (!currentCart) {
    currentCart = cartService.createCart();
    cartService.addItem(plan);
  }

  const result = cartService.updateQuantity(plan.id, maxQuantity + 1);
  lastOperationResult = result;
});

When('I try to proceed to checkout', function () {
  // Simulate checkout attempt
  const hasItems = cartService.hasItems();
  this.checkoutAttempt = {
    canProceed: hasItems,
    isEmpty: !hasItems
  };
});

Then('the plan should be added to my cart', function () {
  expect(lastOperationResult.success).toBe(true);
  expect(currentCart).toBeDefined();
  expect(currentCart.items.length).toBeGreaterThan(0);
});

Then('the cart should show {int} item(s)', function (expectedCount: number) {
  const summary = cartService.getCartSummary();
  expect(summary.itemCount).toBe(expectedCount);
});

Then('the cart total should be {string}', function (expectedTotal: string) {
  const summary = cartService.getCartSummary();
  const formattedTotal = `R$ ${(summary.total / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  expect(formattedTotal).toBe(expectedTotal);
});

Then('my cart should contain {int} different item(s)', function (expectedCount: number) {
  expect(currentCart.items.length).toBe(expectedCount);
});

Then('the cart should show {int} unique item', function (expectedCount: number) {
  expect(currentCart.items.length).toBe(expectedCount);
});

Then('the quantity should be {int}', function (expectedQuantity: number) {
  const firstItem = currentCart.items[0];
  expect(firstItem.quantity).toBe(expectedQuantity);
});

Then('the item quantity should be {int}', function (expectedQuantity: number) {
  const firstItem = currentCart.items[0];
  expect(firstItem.quantity).toBe(expectedQuantity);
});

Then('my cart should contain {int} item(s)', function (expectedCount: number) {
  expect(currentCart.items.length).toBe(expectedCount);
});

Then('the {string} plan should not be in the cart', function (planName: string) {
  const plan = mockPlans[planName as keyof typeof mockPlans];
  const itemExists = currentCart.items.some((item: CartItem) => item.id === plan.id);
  expect(itemExists).toBe(false);
});

Then('my cart should be empty', function () {
  expect(currentCart).toBeNull();
  expect(cartService.hasItems()).toBe(false);
});

Then('my cart should still contain the same items', function () {
  expect(currentCart).toBeDefined();
  expect(currentCart.items.length).toBeGreaterThan(0);
});

Then('the cart total should be preserved', function () {
  const summary = cartService.getCartSummary();
  expect(summary.total).toBeGreaterThan(0);
});

Then('I should see:', function (dataTable: any) {
  const rows = dataTable.hashes();
  const summary = cartService.getCartSummary();
  
  expect(currentCart.items.length).toBe(rows.length);
  
  rows.forEach((row: any, index: number) => {
    const item = currentCart.items[index];
    expect(item.quantity).toBe(parseInt(row.Quantity));
  });
});

Then('the subtotal should be {string}', function (expectedSubtotal: string) {
  const summary = cartService.getCartSummary();
  const formattedSubtotal = `R$ ${(summary.subtotal / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  expect(formattedSubtotal).toBe(expectedSubtotal);
});

Then('the final total should be {string}', function (expectedTotal: string) {
  const summary = cartService.getCartSummary();
  const formattedTotal = `R$ ${(summary.total / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  expect(formattedTotal).toBe(expectedTotal);
});

Then('I should see the original price', function () {
  const summary = cartService.getCartSummary();
  expect(summary.subtotal).toBeGreaterThan(0);
});

Then('I should see the discount amount', function () {
  const summary = cartService.getCartSummary();
  expect(summary.discount).toBeGreaterThan(0);
});

Then('I should see the final discounted price', function () {
  const summary = cartService.getCartSummary();
  expect(summary.total).toBeLessThan(summary.subtotal);
});

Then('I should see an error message {string}', function (expectedMessage: string) {
  expect(lastOperationResult.success).toBe(false);
  expect(lastOperationResult.error).toContain('Quantidade máxima');
});

Then('the quantity should remain at {int}', function (expectedQuantity: number) {
  const plan = mockPlans.Essencial;
  const item = cartService.getItem(plan.id);
  expect(item?.quantity).toBe(expectedQuantity);
});

Then('I should see {string} message', function (expectedMessage: string) {
  expect(this.checkoutAttempt.isEmpty).toBe(true);
});

Then('I should see a {string} button', function (buttonText: string) {
  // In a real implementation, this would check for the button in the UI
  expect(this.checkoutAttempt.isEmpty).toBe(true);
});

Then('the checkout button should be disabled', function () {
  expect(this.checkoutAttempt.canProceed).toBe(false);
});
