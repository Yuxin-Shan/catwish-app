import { z } from 'zod';

export const requestIdHeaderSchema = z.object({
  'x-request-id': z.string().min(1).optional(),
});

export const successEnvelopeSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    data,
    meta: z.record(z.string(), z.unknown()).optional(),
  });

export const errorEnvelopeSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1),
    details: z.unknown().optional(),
  }),
});

export const idSchema = z.string().min(1);
