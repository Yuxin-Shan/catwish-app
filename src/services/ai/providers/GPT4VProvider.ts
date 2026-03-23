// src/services/ai/providers/GPT4VProvider.ts
/**
 * GPT-4V AI提供者 (备用)
 */

import { AIProvider, AnalysisResult } from '../types';

interface GPT4VConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  apiUrl: string;
}

export class GPT4VProvider implements AIProvider {
  name = 'GPT-4 Vision';
  private config: GPT4VConfig;

  constructor(config: GPT4VConfig) {
    this.config = config;
  }

  /**
   * 调用GPT-4V API
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API Key未配置');
    }

    try {
      const base64Image = await this.imageToBase64(imageUri);

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: await this.loadPrompt()
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }],
          max_tokens: this.config.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API错误: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('无法解析AI响应');
      }

      const result = JSON.parse(jsonMatch[0]);
      return result as AnalysisResult;

    } catch (error) {
      console.error('GPT-4V API调用失败:', error);
      throw error;
    }
  }

  /**
   * 估算成本
   */
  async estimateCost(imageUri: string): Promise<number> {
    // GPT-4V定价: 约 $0.01/图片 + $0.03/1K tokens
    return 0.80;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    return !!this.config.apiKey;
  }

  /**
   * 加载Prompt
   */
  private async loadPrompt(): Promise<string> {
    // TODO: 实现Prompt加载
    return '请分析这张猫咪的情绪...';
  }

  /**
   * 图片转base64
   */
  private async imageToBase64(imageUri: string): Promise<string> {
    console.log('转换图片为base64:', imageUri);
    return 'base64_image_data_placeholder';
  }
}
