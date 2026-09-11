const express = require("express");
const { calculateOrderSchema, whatsappOrderSchema } = require("../utils/validation");
const { calculateOrder } = require("../utils/pricing");

const router = express.Router();

const WHATSAPP_NUMBER = "923142961604";

// POST /api/orders/calculate
router.post("/calculate", (req, res, next) => {
  try {
    const { items } = calculateOrderSchema.parse(req.body);
    const summary = calculateOrder(items);
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders/whatsapp
router.post("/whatsapp", (req, res, next) => {
  try {
    const { name, phone, address, items } = whatsappOrderSchema.parse(req.body);
    const summary = calculateOrder(items);

    const lines = [
      "*New Order — Al Rehman Biryani*",
      "",
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`,
      "",
      "*Order Details:*",
      ...summary.items.map((li) => {
        const variantSuffix = li.variantLabel ? ` (${li.variantLabel})` : "";
        return `${li.quantity} x ${li.name}${variantSuffix} — Rs. ${li.lineTotal}`;
      }),
      "",
      `Subtotal: Rs. ${summary.subtotal}`,
      `Delivery Fee: Rs. ${summary.deliveryFee === 0 ? "Free" : summary.deliveryFee}`,
      `*Total: Rs. ${summary.total}*`,
    ];

    const message = lines.join("\n");
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    res.json({ success: true, data: { url, message, summary } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
