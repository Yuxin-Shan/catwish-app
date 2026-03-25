export type AnalysisProviderResult = {
  emotion: string;
  emotionScore: number;
  catSays: string;
  behaviorAnalysis: string;
  interactionSuggestion?: string;
  memeText?: string;
  memeCategory?: string;
  rawProviderPayload?: Record<string, unknown>;
};

export interface AnalysisProvider {
  name: string;
  analyzeImage(imageStorageKey: string): Promise<AnalysisProviderResult>;
}
