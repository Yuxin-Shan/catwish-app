import {
  analysisListQuerySchema,
  analysisRequestSchema,
} from '../../../packages/contracts/dist/analysis.js';
import { env } from '../lib/env.js';
import { HttpError } from '../lib/http-error.js';
import { logger } from '../lib/logger.js';
import { MockAnalysisProvider } from '../providers/mock-analysis-provider.js';
import { analysisRepository } from '../repositories/analysis-repository.js';

type AnalysisRecord = Awaited<ReturnType<typeof analysisRepository.findAnalysisById>>;
type AnalysisListRecord = Awaited<ReturnType<typeof analysisRepository.listAnalyses>>[number];

const mapAnalysisRecord = (record: Exclude<AnalysisRecord, null> | AnalysisListRecord) => ({
  analysisId: record.request.id,
  status: record.request.status,
  source: record.request.source,
  requestedAt: record.request.requestedAt.toISOString(),
  completedAt: record.request.completedAt?.toISOString(),
  result: record.result
    ? {
        emotion: record.result.emotion,
        emotionScore: record.result.emotionScore,
        catSays: record.result.catSays,
        behaviorAnalysis: record.result.behaviorAnalysis,
        interactionSuggestion: record.result.interactionSuggestion ?? undefined,
        memeText: record.result.memeText ?? undefined,
        memeCategory: record.result.memeCategory ?? undefined,
      }
    : undefined,
});

const createAnalysisProvider = () => {
  switch (env.ANALYSIS_PROVIDER) {
    case 'mock':
    default:
      return new MockAnalysisProvider();
  }
};

export class AnalysisService {
  private readonly provider = createAnalysisProvider();

  async create(input: unknown) {
    const payload = analysisRequestSchema.parse(input);
    const request = await analysisRepository.createAnalysisRequest({
      petId: payload.petId ?? null,
      imageStorageKey: payload.imageUploadId,
      source: payload.source,
    });

    await analysisRepository.recordAnalysisRequested({
      analysisId: request.id,
      userId: request.userId,
      source: request.source,
    });

    logger.info('analysis.requested', {
      analysisId: request.id,
      source: request.source,
      provider: this.provider.name,
    });

    return this.orchestrate(request.id, request.imageStorageKey);
  }

  async getById(analysisId: string) {
    if (!analysisId) {
      throw new HttpError(400, 'ANALYSIS_ID_REQUIRED', 'Analysis ID is required');
    }

    const record = await analysisRepository.findAnalysisById(analysisId);
    if (!record) {
      throw new HttpError(404, 'ANALYSIS_NOT_FOUND', 'Analysis not found');
    }

    return mapAnalysisRecord(record);
  }

  async list(input: unknown) {
    const query = analysisListQuerySchema.parse(input);
    const records = await analysisRepository.listAnalyses(query);

    return {
      items: records.map((record) => mapAnalysisRecord(record)),
    };
  }

  private async orchestrate(analysisId: string, imageStorageKey: string) {
    await analysisRepository.markProcessing(analysisId);

    try {
      const providerResult = await this.provider.analyzeImage(imageStorageKey);
      const completed = await analysisRepository.completeAnalysis({
        analysisId,
        result: providerResult,
      });

      logger.info('analysis.completed', {
        analysisId,
        provider: this.provider.name,
        emotion: providerResult.emotion,
      });

      if (!completed.request || !completed.result) {
        throw new HttpError(500, 'ANALYSIS_COMPLETION_FAILED', 'Analysis completion failed');
      }

      return mapAnalysisRecord({
        request: completed.request,
        result: completed.result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown analysis failure';
      await analysisRepository.failAnalysis({
        analysisId,
        failureReason: message,
      });

      logger.error('analysis.failed', {
        analysisId,
        provider: this.provider.name,
        error: message,
      });

      throw new HttpError(502, 'ANALYSIS_PROVIDER_FAILED', 'Analysis provider failed', {
        analysisId,
      });
    }
  }
}

export const analysisService = new AnalysisService();
