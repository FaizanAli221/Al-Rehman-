const { products } = require("../data/menu");

const DELIVERY_FEE = 100; // flat standard Karachi delivery fee, in PKR
const FREE_DELIVERY_THRESHOLD = 1000; // subtotal at/above which delivery is free

/**
 * Validates order items against the server-side catalog and computes
 * an authoritative price breakdown. Never trusts client-supplied prices.
 *
 * @param {{id: number, quantity: number, variant?: string}[]} items
 * @returns {{items: object[], subtotal: number, deliveryFee: number, total: number, currency: string}}
 * @throws {Error} with `.status = 400` on any invalid id/variant
 */
function calculateOrder(items) {
  let subtotal = 0;

  const lineItems = items.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      const err = new Error(`Invalid product id: ${item.id}`);
      err.status = 400;
      throw err;
    }

    let unitPrice = product.basePrice;
    let variantName = null;
    let variantLabel = null;

    if (product.variants && product.variants.length > 0) {
      const requested = item.variant || product.variants[0].name;
      const variant = product.variants.find((v) => v.name === requested);
      if (!variant) {
        const err = new Error(
          `Invalid variant "${item.variant}" for "${product.name}". ` +
            `Valid options: ${product.variants.map((v) => v.name).join(", ")}`
        );
        err.status = 400;
        throw err;
      }
      unitPrice = variant.price;
      variantName = variant.name;
      variantLabel = variant.label;
    }

    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    return {
      id: product.id,
      name: product.name,
      variant: variantName,
      variantLabel,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
    };
  });

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return {
    items: lineItems,
    subtotal,
    deliveryFee,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    total,
    currency: "PKR",
  };
}

module.exports = { calculateOrder, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD };
