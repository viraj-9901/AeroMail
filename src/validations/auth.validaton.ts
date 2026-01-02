import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CreateUserInput, LoginInput } from '../types/express';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const adminRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  secretKey: z.string()
})

export const validateRegister = (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction): void => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  next();
};

export const validateLogin = (req: Request<{}, {}, LoginInput>, res: Response, next: NextFunction): void => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  next();
};

export const validateAdminRegister = (req: Request<{}, {}, CreateUserInput & { secretKey: string }>, res: Response, next: NextFunction): void => {
  const result = adminRegisterSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }
  next();
};