import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ReturnInput } from '../types/express';

const createReturnSchema = z.object({
    orderId: z.string(),
    reason: z.string().max(500),
});

export const validateCreateReturn = (req: Request<{}, {}, ReturnInput>, res: Response, next: NextFunction): void => {
    const result = createReturnSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: result.error.issues[0].message });
        return;
    }
    next();
}
