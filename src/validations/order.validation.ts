import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    userId: z.string(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(0),
      })
    ),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  }),
});
