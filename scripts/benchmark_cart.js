
/**
 * Benchmark script for CartService.getCartSummary optimization.
 * This script runs the original logic and the optimized logic to compare performance.
 */

function originalGetCartSummary(items) {
  if (!items || items.length === 0) {
    return { subtotal: 0, discount: 0, tax: 0, total: 0, itemCount: 0 };
  }

  const subtotal = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  let totalDiscount = 0;

  // Calculate item-level discounts
  items.forEach((item) => {
    if (item.discount) {
      const itemTotal = item.price * item.quantity;
      if (item.discount.type === "percentage") {
        totalDiscount += itemTotal * (item.discount.value / 100);
      } else if (item.discount.type === "fixed") {
        totalDiscount += item.discount.value;
      }
    }
  });

  const total = subtotal - totalDiscount;
  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return {
    subtotal,
    discount: totalDiscount,
    tax: 0,
    total: Math.max(0, total),
    itemCount,
  };
}

function optimizedGetCartSummary(items) {
  if (!items || items.length === 0) {
    return { subtotal: 0, discount: 0, tax: 0, total: 0, itemCount: 0 };
  }

  let subtotal = 0;
  let totalDiscount = 0;
  let itemCount = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const itemTotal = item.price * item.quantity;

    subtotal += itemTotal;
    itemCount += item.quantity;

    if (item.discount) {
      if (item.discount.type === "percentage") {
        totalDiscount += itemTotal * (item.discount.value / 100);
      } else if (item.discount.type === "fixed") {
        totalDiscount += item.discount.value;
      }
    }
  }

  const total = subtotal - totalDiscount;

  return {
    subtotal,
    discount: totalDiscount,
    tax: 0,
    total: Math.max(0, total),
    itemCount,
  };
}

// Generate test data
const ITEM_COUNT = 1000;
const ITERATIONS = 100000;
const items = [];
for (let i = 0; i < ITEM_COUNT; i++) {
  items.push({
    price: 10 + i,
    quantity: 1 + (i % 5),
    discount: i % 2 === 0 ? {
      type: i % 4 === 0 ? 'percentage' : 'fixed',
      value: i % 4 === 0 ? 10 : 5
    } : undefined
  });
}

// Verification
const resOrig = originalGetCartSummary(items);
const resOpt = optimizedGetCartSummary(items);

if (JSON.stringify(resOrig) !== JSON.stringify(resOpt)) {
  console.error("Verification FAILED!");
  console.error("Original:", resOrig);
  console.error("Optimized:", resOpt);
  process.exit(1);
}
console.log("Verification PASSED!");

// Benchmark Original
console.log(`Running benchmark with ${ITEM_COUNT} items and ${ITERATIONS} iterations...`);

const startOrig = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  originalGetCartSummary(items);
}
const endOrig = Date.now();
const timeOrig = endOrig - startOrig;

// Benchmark Optimized
const startOpt = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  optimizedGetCartSummary(items);
}
const endOpt = Date.now();
const timeOpt = endOpt - startOpt;

console.log(`Original version: ${timeOrig}ms`);
console.log(`Optimized version: ${timeOpt}ms`);
const improvement = ((timeOrig - timeOpt) / timeOrig * 100).toFixed(2);
console.log(`Improvement: ${improvement}%`);
