import { AnalysisResult } from '../ai/types';
import { apiFetch } from './client';

type AnalysisResponse = {
  analysisId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  source: 'camera' | 'gallery' | 'history';
  requestedAt: string;
  completedAt?: string;
  result?: AnalysisResult;
};

export const requestBackendAnalysis = async (imageUri: string): Promise<AnalysisResult> => {
  const analysis = await apiFetch<AnalysisResponse>('/v1/analysis', {
    method: 'POST',
    body: JSON.stringify({
      imageUploadId: imageUri,
      source: 'camera',
    }),
  });

  if (!analysis.result) {
    throw new Error(`Analysis did not complete successfully: ${analysis.status}`);
  }

  return analysis.result;
};
