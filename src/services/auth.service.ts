import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { userService } from './user.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const authService = {
  async login(
    email: string,
    password: string,
  ): Promise<{ token: string } | null> {
    const user = await userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  },

  verifyToken(token: string): { id: number; email: string } {
    return jwt.verify(token, JWT_SECRET) as { id: number; email: string };
  },
};
