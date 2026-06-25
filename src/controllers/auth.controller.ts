import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authService, userService } from '../services';
import { z } from 'zod';
import { createUserSchema } from '../dto/user';
import { UserRole } from '../models/User';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const result = createUserSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const { name, email, password } = result.data;

    const existing = await userService.findByEmail(email);
    if (existing) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }

    const user = await userService.create({
      name,
      email,
      password,
      role: UserRole.MEMBER,
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },

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

  async refresh(req: Request, res: Response): Promise<void> {
    const result = refreshSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const { refreshToken } = result.data;
    const refreshResult = await authService.refreshAccessToken(refreshToken);

    if (!refreshResult) {
      res.status(401).json({ message: 'Invalid or expired refresh token' });
      return;
    }

    res.json(refreshResult);
  },

  async logout(req: Request, res: Response): Promise<void> {
    const result = refreshSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ errors: result.error.flatten().fieldErrors });
      return;
    }

    const decoded = jwt.decode(result.data.refreshToken) as {
      id?: number;
    } | null;
    if (decoded?.id) {
      await authService.revokeRefreshToken(decoded.id);
    }

    res.json({ message: 'Logged out successfully' });
  },
};
