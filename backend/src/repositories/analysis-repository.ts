import { desc, eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { analysisRequests, analysisResults, userEvents } from '../db/schema.js';

type CreateAnalysisRequestInput = {
  userId?: string | null;
  petId?: string | null;
  imageStorageKey: string;
  source: 'camera' | 'gallery' | 'history';
};

export class AnalysisRepository {
  async createAnalysisRequest(input: CreateAnalysisRequestInput) {
    const [request] = await db
      .insert(analysisRequests)
      .values({
        userId: input.userId ?? null,
        petId: input.petId ?? null,
        imageStorageKey: input.imageStorageKey,
        source: input.source,
        status: 'pending',
      })
      .returning();

    return request;
  }

  async findAnalysisById(analysisId: string) {
    const [record] = await db
      .select({
        request: analysisRequests,
        result: analysisResults,
      })
      .from(analysisRequests)
      .leftJoin(analysisResults, eq(analysisResults.analysisRequestId, analysisRequests.id))
      .where(eq(analysisRequests.id, analysisId))
      .limit(1);

    return record ?? null;
  }

  async listAnalyses(input: {
    status?: 'pending' | 'processing' | 'completed' | 'failed';
    limit: number;
  }) {
    const baseQuery = db
      .select({
        request: analysisRequests,
        result: analysisResults,
      })
      .from(analysisRequests)
      .leftJoin(analysisResults, eq(analysisResults.analysisRequestId, analysisRequests.id))
      .orderBy(desc(analysisRequests.requestedAt))
      .limit(input.limit);

    if (input.status) {
      return baseQuery.where(eq(analysisRequests.status, input.status));
    }

    return baseQuery;
  }

  async markProcessing(analysisId: string) {
    const [request] = await db
      .update(analysisRequests)
      .set({
        status: 'processing',
      })
      .where(eq(analysisRequests.id, analysisId))
      .returning();

    return request ?? null;
  }

  async completeAnalysis(input: {
    analysisId: string;
    result: {
      emotion: string;
      emotionScore: number;
      catSays: string;
      behaviorAnalysis: string;
      interactionSuggestion?: string;
      memeText?: string;
      memeCategory?: string;
      rawProviderPayload?: Record<string, unknown>;
    };
  }) {
    return db.transaction(async (tx) => {
      const [request] = await tx
        .update(analysisRequests)
        .set({
          status: 'completed',
          failureReason: null,
          completedAt: new Date(),
        })
        .where(eq(analysisRequests.id, input.analysisId))
        .returning();

      const [result] = await tx
        .insert(analysisResults)
        .values({
          analysisRequestId: input.analysisId,
          emotion: input.result.emotion,
          emotionScore: input.result.emotionScore,
          catSays: input.result.catSays,
          behaviorAnalysis: input.result.behaviorAnalysis,
          interactionSuggestion: input.result.interactionSuggestion ?? null,
          memeText: input.result.memeText ?? null,
          memeCategory: input.result.memeCategory ?? null,
          rawProviderPayload: input.result.rawProviderPayload ?? null,
        })
        .returning();

      if (request?.userId) {
        await tx.insert(userEvents).values({
          userId: request.userId,
          eventType: 'analysis_completed',
          properties: {
            analysisId: input.analysisId,
            source: request.source,
            status: 'completed',
          },
        });
      }

      return {
        request,
        result,
      };
    });
  }

  async failAnalysis(input: {
    analysisId: string;
    failureReason: string;
  }) {
    return db.transaction(async (tx) => {
      const [request] = await tx
        .update(analysisRequests)
        .set({
          status: 'failed',
          failureReason: input.failureReason,
          completedAt: new Date(),
        })
        .where(eq(analysisRequests.id, input.analysisId))
        .returning();

      if (request?.userId) {
        await tx.insert(userEvents).values({
          userId: request.userId,
          eventType: 'analysis_requested',
          properties: {
            analysisId: input.analysisId,
            source: request.source,
            status: 'failed',
            failureReason: input.failureReason,
          },
        });
      }

      return request ?? null;
    });
  }

  async recordAnalysisRequested(input: {
    analysisId: string;
    userId?: string | null;
    source: 'camera' | 'gallery' | 'history';
  }) {
    if (!input.userId) {
      return;
    }

    await db.insert(userEvents).values({
      userId: input.userId,
      eventType: 'analysis_requested',
      properties: {
        analysisId: input.analysisId,
        source: input.source,
        status: 'pending',
      },
    });
  }
}

export const analysisRepository = new AnalysisRepository();
