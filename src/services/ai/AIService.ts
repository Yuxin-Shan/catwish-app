// src/services/ai/AIService.ts
/**
 * AI服务主类
 * 可插拔架构的核心实现
 */

import { AIProvider, AIConfig, AnalysisResult } from './types';
import { ClaudeProvider } from './providers/ClaudeProvider';
import { GPT4VProvider } from './providers/GPT4VProvider';
import { KimiProvider } from './providers/KimiProvider';
import { MockProvider } from './providers/MockProvider';
import { DEFAULT_AI_CONFIG } from './config';
import { COMPRESSION_CONFIG } from './config';

/**
 * 内部使用记录类型
 */
interface UsageRecord {
  date: string;
  cost: number;
  success: boolean;
  timestamp: number;
}

export class AIService {
  private provider: AIProvider;
  private config: AIConfig;
  private usage: UsageRecord[] = []; // 每日使用记录

  constructor(config: AIConfig = DEFAULT_AI_CONFIG) {
    this.config = config;
    this.provider = this.createProvider(config.currentProvider);
  }

  /**
   * 创建AI提供者
   */
  private createProvider(providerName: string): AIProvider {
    switch (providerName) {
      case 'kimi':
        return new KimiProvider(this.config.kimi!);
      case 'claude':
        return new ClaudeProvider(this.config.claude!);
      case 'gpt4v':
        return new GPT4VProvider(this.config.gpt4v!);
      case 'custom':
        // V2.0功能
        throw new Error('Custom provider not implemented yet');
      case 'mock':
        return new MockProvider();
      default:
        return new MockProvider();
    }
  }

  /**
   * 分析猫咪图片 (主方法)
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    try {
      // 1. 成本检查
      const estimatedCost = await this.provider.estimateCost(imageUri);
      if (estimatedCost > this.config.costControl!.maxCostPerRequest) {
        throw new Error(`成本超限: $${estimatedCost.toFixed(2)} > $${this.config.costControl!.maxCostPerRequest}`);
      }

      // 2. 检查每日预算
      if (this.checkDailyBudget(estimatedCost)) {
        throw new Error('每日预算已用完');
      }

      // 3. 图片压缩 (如果启用)
      const processedImage = this.config.costControl!.enableCompression
        ? await this.compressImage(imageUri)
        : imageUri;

      // 4. 调用AI分析
      const result = await this.provider.analyzeImage(processedImage);

      // 5. 记录使用统计
      this.recordUsage(estimatedCost, true);

      return result;
    } catch (error) {
      // 错误处理
      this.recordUsage(0, false);
      console.error('AI分析失败:', error);

      // 尝试降级到Mock
      if (this.config.currentProvider !== 'mock') {
        const mockProvider = new MockProvider();
        return await mockProvider.analyzeImage(imageUri);
      }

      throw error;
    }
  }

  /**
   * 切换AI提供者 (无需重启)
   */
  async switchProvider(providerName: AIConfig['currentProvider']): Promise<void> {
    this.config.currentProvider = providerName;
    this.provider = this.createProvider(providerName);
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    return await this.provider.healthCheck();
  }

  /**
   * 获取当前提供者名称
   */
  getProviderName(): string {
    return this.provider.name;
  }

  /**
   * 获取使用统计
   */
  getDailyUsage(): { count: number; cost: number } {
    const today = new Date().toDateString();
    const todayUsage = this.usage.filter(u => u.date === today);

    return {
      count: todayUsage.length,
      cost: todayUsage.reduce((sum, u) => sum + u.cost, 0)
    };
  }

  /**
   * 重置每日预算
   */
  resetDailyBudget(): void {
    this.usage = [];
  }

  /**
   * 压缩图片
   */
  private async compressImage(imageUri: string): Promise<string> {
    // TODO: 实现图片压缩
    // 可以使用 react-native-image-resizer
    return imageUri; // 暂时返回原图
  }

  /**
   * 检查每日预算
   */
  private checkDailyBudget(estimatedCost: number): boolean {
    const { cost } = this.getDailyUsage();
    return (cost + estimatedCost) > this.config.costControl!.dailyBudget;
  }

  /**
   * 记录使用统计
   */
  private recordUsage(cost: number, success: boolean): void {
    const today = new Date().toDateString();
    const record: UsageRecord = {
      date: today,
      cost,
      success,
      timestamp: Date.now()
    };
    this.usage.push(record);
  }
}

// 导出单例
export const aiService = new AIService();
