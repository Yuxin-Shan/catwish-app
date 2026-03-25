import { z } from 'zod';
import { successEnvelopeSchema } from './common.js';

export const healthDataSchema = z.object({
  status: z.literal('ok'),
  service: z.string().min(1),
  environment: z.enum(['development', 'test', 'staging', 'production']),
  version: z.string().min(1),
  database: z.object({
    configured: z.boolean(),
    ssl: z.boolean(),
  }).optional(),
});

export const healthResponseSchema = successEnvelopeSchema(healthDataSchema);

export const versionDataSchema = z.object({
  version: z.string().min(1),
});

export const versionResponseSchema = successEnvelopeSchema(versionDataSchema);

export type HealthResponse = z.infer<typeof healthResponseSchema>;
export type VersionResponse = z.infer<typeof versionResponseSchema>;
