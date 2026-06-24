import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ token: string } | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' },
    );

    return { token };
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}
