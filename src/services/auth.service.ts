import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserService } from './user.service';
import { UserRole } from '../models/User';

const JWT_SECRET: string = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRY = '1m';
const REFRESH_TOKEN_EXPIRY = '1d';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface RefreshTokenPayload {
  id: number;
  tokenVersion: string;
}

export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const tokenVersion = crypto.randomBytes(16).toString('hex');
    const refreshToken = jwt.sign({ id: user.id, tokenVersion }, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');
    await this.userService.updateRefreshToken(user.id, hashedToken);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    let payload: RefreshTokenPayload;
    try {
      payload = jwt.verify(
        refreshToken,
        JWT_SECRET,
      ) as unknown as RefreshTokenPayload;
    } catch {
      return null;
    }

    const user = await this.userService.findById(payload.id);
    if (!user || !user.refreshToken) return null;

    const incomingHash = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    if (incomingHash !== user.refreshToken) {
      // Possible stolen token — revoke all refresh tokens for this user
      await this.userService.updateRefreshToken(user.id, null);
      return null;
    }

    // Rotate: issue new refresh token, invalidate old one
    const newTokenVersion = crypto.randomBytes(16).toString('hex');
    const newRefreshToken = jwt.sign(
      { id: user.id, tokenVersion: newTokenVersion },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    const newHashedToken = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');
    await this.userService.updateRefreshToken(user.id, newHashedToken);

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    return { accessToken, refreshToken: newRefreshToken };
  }

  async revokeRefreshToken(userId: number): Promise<void> {
    await this.userService.updateRefreshToken(userId, null);
  }

  verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
  }
}
