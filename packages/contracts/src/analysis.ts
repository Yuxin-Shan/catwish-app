import { z } from 'zod';
import { successEnvelopeSchema, idSchema } from './common.js';

export const analysisSourceSchema = z.enum(['camera', 'gallery', 'history']);
export const analysisStatusSchema = z.enum(['pending', 'processing', 'completed', 'failed']);

export const analysisRequestSchema = z.object({
  petId: idSchema.optional(),
  imageUploadId: idSchema,
  source: analysisSourceSchema,
});

export const analysisResultPayloadSchema = z.object({
  emotion: z.string().min(1),
  emotionScore: z.number().int().min(0).max(100),
  catSays: z.string().min(1),
  behaviorAnalysis: z.string().min(1),
  interactionSuggestion: z.string().min(1).optional(),
  memeText: z.string().min(1).optional(),
  memeCategory: z.string().min(1).optional(),
});

export const analysisResponseDataSchema = z.object({
  analysisId: idSchema,
  status: analysisStatusSchema,
  source: analysisSourceSchema,
  requestedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  result: analysisResultPayloadSchema.optional(),
});

export const analysisResponseSchema = successEnvelopeSchema(analysisResponseDataSchema);

export const analysisListQuerySchema = z.object({
  status: analysisStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const analysisListResponseDataSchema = z.object({
  items: z.array(analysisResponseDataSchema),
});

export const analysisListResponseSchema = successEnvelopeSchema(analysisListResponseDataSchema);

export type AnalysisRequest = z.infer<typeof analysisRequestSchema>;
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
export type AnalysisListQuery = z.infer<typeof analysisListQuerySchema>;
export type AnalysisListResponse = z.infer<typeof analysisListResponseSchema>;
