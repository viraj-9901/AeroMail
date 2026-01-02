import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { OrderInput, OrderStatus } from '../types/express'

const createOrderSchema = z.object({
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

const updateOrderSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
  }),
});

const cancelOrderSchema = z.object({
  body: z.object({
    orderId: z.string(),
  }),
})

export const validateCreateOrder = (req: Request<{}, {}, OrderInput>, res: Response, next: NextFunction): void => {
  const result = createOrderSchema.safeParse({ body: req.body });
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  next();
}


export const validateUpdateOrder = (req: Request<{}, {}, OrderStatus>, res: Response, next: NextFunction): void => {
  const result = updateOrderSchema.safeParse({ body: req.body });
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  next();
}

export const validateCancelOrder = (req: Request<{}, {}, string>, res: Response, next: NextFunction): void => {
  const result = cancelOrderSchema.safeParse({body: req.body});

  if(!result.success){
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  next()
}