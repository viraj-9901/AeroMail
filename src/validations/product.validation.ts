import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProductInput } from '../types/express';

const createProductSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500),
  price: z.number().min(0),
});

export const validateCreateProduct = (req: Request<{}, {}, ProductInput>, res: Response, next: NextFunction): void => {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: result.error.issues[0].message });
        return;
    }
    next();
}
