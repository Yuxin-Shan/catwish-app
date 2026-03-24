// src/services/ai/types.ts
/**
 * AI服务类型定义
 * 可插拔架构的核心接口
 */

/**
 * AI分析结果
 */
export interface AnalysisResult {
  // 情绪识别
  emotion: string;           // Emoji + 标签，如 "😊开心"
  emotionScore: number;      // 情绪指数 0-100

  // 第一人称解读
  catSays: string;           // 猫咪视角的可爱文案

  // 行为分析
  behaviorAnalysis: string;  // 行为解读

  // 互动建议
  interactionSuggestion: string; // 主人可以做什么

  // 表情包相关
  memeText?: string;         // 表情包文案
  memeCategory?: string;     // 分类: 撒娇/搞笑/治愈
}

/**
 * AI服务提供者接口
 * 所有AI服务都必须实现这个接口
 */
export interface AIProvider {
  /**
   * 提供者名称
   */
  name: string;

  /**
   * 分析猫咪图片
   * @param imageUri 图片本地路径或base64
   * @returns 分析结果
   */
  analyzeImage(imageUri: string): Promise<AnalysisResult>;

  /**
   * 估算成本
   * @param imageUri 图片路径
   * @returns 预估成本(美元)
   */
  estimateCost(imageUri: string): Promise<number>;

  /**
   * 健康检查
   * @returns 服务是否可用
   */
  healthCheck(): Promise<boolean>;
}

/**
 * AI服务配置
 */
export interface AIConfig {
  // 当前使用的提供者
  currentProvider: 'kimi' | 'claude' | 'gpt4v' | 'custom' | 'mock';

  // KIMI配置
  kimi?: {
    apiKey: string;
    model: string;
    apiUrl: string;
  };

  // Claude配置
  claude?: {
    apiKey: string;
    model: string;
    maxTokens: number;
    apiUrl: string;
  };

  // GPT-4V配置
  gpt4v?: {
    apiKey: string;
    model: string;
    maxTokens: number;
    apiUrl: string;
  };

  // 自定义模型配置
  custom?: {
    apiUrl: string;
    apiKey?: string;
    model?: string;
  };

  // 成本控制
  costControl?: {
    maxCostPerRequest: number;  // 单次最大成本($)
    dailyBudget: number;         // 每日预算($)
    enableCompression: boolean;  // 启用图片压缩
  };

  // Prompt模板路径
  prompts?: {
    analysis: string;  // 主分析Prompt
    fallback: string;  // 降级Prompt
  };

  // 数据采集 (V2.0功能)
  dataCollection?: {
    enabled: boolean;
    storagePath: string;
    maxSamples?: number;
  };
}

/**
 * 图片压缩配置
 */
export interface CompressionConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;  // 0-100
  format: 'jpeg' | 'png';
}

/**
 * AI使用统计
 */
export interface AIUsageRecord {
  id: string;
  userId?: string;
  provider: string;
  model: string;
  tokensUsed: number;
  costEstimated: number;
  timestamp: number;
  success: boolean;
  errorMessage?: string;
}
