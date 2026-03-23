// src/types/navigation.ts
/**
 * 导航类型定义
 */

import { AnalysisResult } from '../services/ai/types';

export type RootStackParamList = {
  MainTabs: undefined;
  Camera: { fromHistory?: boolean };
  Analysis: { imageUri: string };
  Result: {
    imageUri: string;
    analysisResult: AnalysisResult;
  };
  MemeEditor: {
    imageUri: string;
    analysisResult: AnalysisResult;
  };
};

export type MainTabParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
};
