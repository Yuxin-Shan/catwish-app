import { z } from 'zod';
import { successEnvelopeSchema, idSchema } from './common.js';

export const registerRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
  displayName: z.string().min(1).max(120),
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const refreshRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutRequestSchema = z.object({
  refreshToken: z.string().min(1),
});

export const logoutAllRequestSchema = z.object({
  userId: idSchema,
});

export const authUserSchema = z.object({
  id: idSchema,
  email: z.email(),
  displayName: z.string().min(1).max(120).nullable(),
});

export const authSessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresInSeconds: z.number().int().positive(),
  user: authUserSchema,
});

export const authResponseSchema = successEnvelopeSchema(authSessionSchema);
export const logoutResponseSchema = successEnvelopeSchema(
  z.object({
    revoked: z.literal(true),
  })
);
export const logoutAllResponseSchema = successEnvelopeSchema(
  z.object({
    revoked: z.literal(true),
    count: z.number().int().nonnegative(),
  })
);

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type LogoutRequest = z.infer<typeof logoutRequestSchema>;
export type LogoutAllRequest = z.infer<typeof logoutAllRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
