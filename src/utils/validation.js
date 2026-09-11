const { z } = require("zod");

const orderItemSchema = z.object({
  id: z.number({ invalid_type_error: "id must be a number" }).int().positive(),
  quantity: z
    .number({ invalid_type_error: "quantity must be a number" })
    .int()
    .positive()
    .max(50, "quantity per item cannot exceed 50"),
  variant: z.string().min(1).optional(),
});

const calculateOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "items array cannot be empty"),
});

const whatsappOrderSchema = calculateOrderSchema.extend({
  name: z.string().min(2, "name must be at least 2 characters"),
  phone: z
    .string()
    .min(7, "phone must be a valid phone number")
    .max(20, "phone must be a valid phone number"),
  address: z.string().min(5, "address must be at least 5 characters"),
});

module.exports = { orderItemSchema, calculateOrderSchema, whatsappOrderSchema };
