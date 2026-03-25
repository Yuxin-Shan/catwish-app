import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../db/client.js';
import { authRefreshTokens, users } from '../db/schema.js';

type CreateUserInput = {
  email: string;
  passwordHash: string;
  displayName: string;
};

type CreateRefreshTokenInput = {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
};

export class AuthRepository {
  async findUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user ?? null;
  }

  async createUser(input: CreateUserInput) {
    const [user] = await db
      .insert(users)
      .values({
        email: input.email,
        passwordHash: input.passwordHash,
        displayName: input.displayName,
      })
      .returning();

    return user;
  }

  async createRefreshToken(input: CreateRefreshTokenInput) {
    const [token] = await db
      .insert(authRefreshTokens)
      .values({
        userId: input.userId,
        tokenHash: input.tokenHash,
        expiresAt: input.expiresAt,
        userAgent: input.userAgent ?? null,
        ipAddress: input.ipAddress ?? null,
      })
      .returning();

    return token;
  }

  async findActiveRefreshToken(tokenHash: string) {
    const [record] = await db
      .select({
        token: authRefreshTokens,
        user: users,
      })
      .from(authRefreshTokens)
      .innerJoin(users, eq(authRefreshTokens.userId, users.id))
      .where(
        and(
          eq(authRefreshTokens.tokenHash, tokenHash),
          isNull(authRefreshTokens.revokedAt)
        )
      )
      .limit(1);

    return record ?? null;
  }

  async revokeRefreshToken(tokenHash: string) {
    await db
      .update(authRefreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(eq(authRefreshTokens.tokenHash, tokenHash));
  }

  async revokeAllRefreshTokensForUser(userId: string) {
    const revoked = await db
      .update(authRefreshTokens)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(authRefreshTokens.userId, userId),
          isNull(authRefreshTokens.revokedAt)
        )
      )
      .returning({
        id: authRefreshTokens.id,
      });

    return revoked.length;
  }
}

export const authRepository = new AuthRepository();
