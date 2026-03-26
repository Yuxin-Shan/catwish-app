import { createHash } from 'node:crypto';
import {
  loginRequestSchema,
  logoutAllRequestSchema,
  logoutRequestSchema,
  refreshRequestSchema,
  registerRequestSchema,
} from '../../../packages/contracts/dist/auth.js';
import { env } from '../lib/env.js';
import { HttpError } from '../lib/http-error.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { generateRefreshToken, signAccessToken } from '../lib/tokens.js';
import { authRepository } from '../repositories/auth-repository.js';

type SessionContext = {
  userAgent?: string | null;
  ipAddress?: string | null;
};

const normalizeUser = (user: {
  id: string;
  email: string;
  displayName: string | null;
}) => ({
  id: user.id,
  email: user.email,
  displayName: user.displayName ?? null,
});

export class AuthService {
  async register(input: unknown, context: SessionContext) {
    const payload = registerRequestSchema.parse(input);

    const existingUser = await authRepository.findUserByEmail(payload.email);
    if (existingUser) {
      throw new HttpError(409, 'AUTH_EMAIL_ALREADY_EXISTS', 'Email already exists');
    }

    const createdUser = await authRepository.createUser({
      email: payload.email,
      passwordHash: hashPassword(payload.password),
      displayName: payload.displayName,
    });

    return this.createSession(normalizeUser(createdUser), context);
  }

  async login(input: unknown, context: SessionContext) {
    const payload = loginRequestSchema.parse(input);

    const user = await authRepository.findUserByEmail(payload.email);
    if (!user?.passwordHash) {
      throw new HttpError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
    }

    const isValid = verifyPassword(payload.password, user.passwordHash);
    if (!isValid) {
      throw new HttpError(401, 'AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
    }

    return this.createSession(normalizeUser(user), context);
  }

  async refresh(input: unknown, context: SessionContext) {
    const payload = refreshRequestSchema.parse(input);
    const tokenHash = await this.hashRefreshToken(payload.refreshToken);
    const record = await authRepository.findActiveRefreshToken(tokenHash);

    if (!record) {
      throw new HttpError(401, 'AUTH_INVALID_REFRESH_TOKEN', 'Invalid refresh token');
    }

    if (record.token.expiresAt.getTime() <= Date.now()) {
      await authRepository.revokeRefreshToken(tokenHash);
      throw new HttpError(401, 'AUTH_REFRESH_TOKEN_EXPIRED', 'Refresh token expired');
    }

    await authRepository.revokeRefreshToken(tokenHash);

    return this.createSession(normalizeUser(record.user), context);
  }

  async logout(input: unknown) {
    const payload = logoutRequestSchema.parse(input);
    const tokenHash = await this.hashRefreshToken(payload.refreshToken);

    await authRepository.revokeRefreshToken(tokenHash);

    return {
      revoked: true as const,
    };
  }

  async logoutAll(input: unknown) {
    const payload = logoutAllRequestSchema.parse(input);
    const count = await authRepository.revokeAllRefreshTokensForUser(payload.userId);

    return {
      revoked: true as const,
      count,
    };
  }

  private async createSession(
    user: { id: string; email: string; displayName: string | null },
    context: SessionContext
  ) {
    const accessToken = await signAccessToken(user);
    const refreshTokenPair = generateRefreshToken();
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
    );

    await authRepository.createRefreshToken({
      userId: user.id,
      tokenHash: refreshTokenPair.tokenHash,
      expiresAt,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
    });

    return {
      accessToken,
      refreshToken: refreshTokenPair.token,
      expiresInSeconds: env.ACCESS_TOKEN_EXPIRES_IN_SECONDS,
      user,
    };
  }

  private async hashRefreshToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}

export const authService = new AuthService();
