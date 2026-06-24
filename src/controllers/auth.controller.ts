import { Request, Response } from 'express';
import { authService } from '../services';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const { email, password } = result.data;
    const loginResult = await authService.login(email, password);

    if (!loginResult) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    res.json(loginResult);
  },
};
