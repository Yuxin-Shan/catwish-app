import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  APP_VERSION: z.string().default('0.1.0'),
  DATABASE_URL: z.string().min(1).default('postgresql://postgres:postgres@localhost:5432/catwish'),
  DATABASE_SSL: z.coerce.boolean().default(false),
  ANALYSIS_PROVIDER: z.enum(['mock']).default('mock'),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(1).default('replace-me'),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(1).default('replace-me'),
  JWT_ISSUER: z.string().min(1).default('catwish-backend'),
  ACCESS_TOKEN_EXPIRES_IN_SECONDS: z.coerce.number().int().positive().default(900),
  REFRESH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(30),
});

export type AppEnv = z.infer<typeof envSchema>;

export const env: AppEnv = envSchema.parse(process.env);
