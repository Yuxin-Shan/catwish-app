// src/services/ai/providers/ClaudeProvider.ts
/**
 * Claude AI提供者
 * 真实的Claude API调用 (需要API Key)
 */

import { AIProvider, AnalysisResult } from '../types';
import { DEFAULT_PROMPTS } from '../config';

interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  apiUrl: string;
}

export class ClaudeProvider implements AIProvider {
  name = 'Claude 3.5 Sonnet';
  private config: ClaudeConfig;

  constructor(config: ClaudeConfig) {
    this.config = config;
  }

  /**
   * 调用Claude API分析图片
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    // 检查API Key
    if (!this.config.apiKey) {
      throw new Error('Claude API Key未配置');
    }

    try {
      // 读取Prompt (优先使用外部文件)
      const prompt = await this.loadPrompt();

      // 转换图片为base64
      const base64Image = await this.imageToBase64(imageUri);

      // 调用Claude API
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true' // 仅用于开发
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: this.config.maxTokens,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image
                }
              },
              {
                type: 'text',
                text: prompt
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API错误: ${response.status}`);
      }

      const data = await response.json();

      // 解析响应
      const content = data.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('无法解析AI响应');
      }

      const result = JSON.parse(jsonMatch[0]);
      return result as AnalysisResult;

    } catch (error) {
      console.error('Claude API调用失败:', error);
      throw error;
    }
  }

  /**
   * 估算成本
   */
  async estimateCost(imageUri: string): Promise<number> {
    // Claude 3.5定价: $3/1M tokens (input)
    // 假设图片约300K tokens
    const estimatedTokens = 300000;
    const cost = (estimatedTokens / 1000000) * 3;
    return cost;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    if (!this.config.apiKey) {
      return false;
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.config.apiKey,
          'content-type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.config.model,
          max_tokens: 10,
          messages: [{
            role: 'user',
            content: 'Hello'
          }]
        })
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 加载Prompt模板
   * 优先从外部文件读取,否则使用内置默认值
   */
  private async loadPrompt(): Promise<string> {
    // TODO: 实现从外部文件读取
    // 暂时使用内置Prompt
    return DEFAULT_PROMPTS.analysis;
  }

  /**
   * 图片转base64
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    // TODO: 实现真实的图片转base64
    // 可以使用 react-native-fs
    // 暂时返回示例数据
    console.log('转换图片为base64:', imageUri);
    return 'base64_image_data_placeholder';
  }
}
