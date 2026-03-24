// src/services/ai/providers/KimiProvider.ts
/**
 * KIMI K2.5 AI提供者
 * 使用月之暗面KIMI API进行猫咪情绪分析
 */

import { AIProvider, AnalysisResult } from '../types';

interface KimiConfig {
  apiKey: string;
  model?: string;
  apiUrl?: string;
}

export class KimiProvider implements AIProvider {
  name = 'KIMI K2.5 (月之暗面)';
  private config: Required<KimiConfig>;

  constructor(config: KimiConfig) {
    this.config = {
      apiKey: config.apiKey,
      model: config.model || 'kimi-k2.5',
      apiUrl: config.apiUrl || 'https://api.moonshot.cn/v1'
    };
  }

  /**
   * 分析猫咪图片
   * 使用KIMI K2.5多模态模型
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    try {
      // 1. 读取并转换图片为base64
      const base64Image = await this.imageToBase64(imageUri);

      // 2. 构建请求
      const response = await fetch(`${this.config.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                },
                {
                  type: 'text',
                  text: this.getUserPrompt()
                }
              ]
            }
          ],
          temperature: 1  // KIMI K2.5要求temperature必须为1
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`KIMI API错误: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // 3. 解析JSON响应
      const result = this.parseResponse(content);
      return result;

    } catch (error) {
      console.error('KIMI分析失败:', error);
      throw error;
    }
  }

  /**
   * 估算成本 (KIMI按token计费)
   * 图片约1024 tokens，输出约500 tokens
   */
  async estimateCost(imageUri: string): Promise<number> {
    // KIMI价格: 输入 ¥12/1M tokens, 输出 ¥60/1M tokens
    // 假设: 图片1000 tokens + 输出500 tokens
    const inputTokens = 1000;
    const outputTokens = 500;
    const cost = (inputTokens / 1_000_000) * 12 + (outputTokens / 1_000_000) * 60;
    return cost; // 返回人民币费用
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 将图片转换为base64
   */
  private async imageToBase64(uri: string): Promise<string> {
    // 处理Mock URI
    if (uri.startsWith('mock://')) {
      throw new Error('Mock URI不能用于真实AI分析，请使用真实图片');
    }

    // 处理base64 URI
    if (uri.startsWith('data:image')) {
      return uri.split(',')[1];
    }

    // 处理文件URI (React Native环境)
    if (typeof window !== 'undefined' && window.FileReader) {
      // Web环境
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    throw new Error('不支持的图片URI格式');
  }

  /**
   * 系统提示词
   */
  private getSystemPrompt(): string {
    return `你是一位专业的猫咪行为解读专家，擅长用可爱温暖的语言解读猫咪的情绪和行为。

你的专长包括：
- 精准识别猫咪的7种核心情绪状态
- 理解猫咪的肢体语言和微表情
- 用猫咪第一人称的视角表达内心想法
- 提供科学的饲养建议和互动指导
- 生成适合社交媒体分享的可爱文案

请始终：
1. 使用温暖、治愈的语气
2. 加入适当的emoji增加可爱感
3. 避免使用过于专业的术语
4. 关注猫咪的福祉和需求`;
  }

  /**
   * 用户提示词
   */
  private getUserPrompt(): string {
    return `请分析这张猫咪图片，提供以下信息（必须以JSON格式输出）：

{
  "emotion": "😊开心",
  "emotion_score": 85,
  "cat_says": "喵~今天感觉超好的!",
  "behavior_analysis": "猫咪表情轻松,眼睛明亮,尾巴竖起,这是开心和自信的表现",
  "interaction_suggestion": "现在可以和猫咪玩耍,它会很开心地参与",
  "meme_text": "好开心~",
  "meme_category": "撒娇"
}

要求：
- emotion: 从以下选择 [😊开心, 😌放松, 😰焦虑, 😠生气, 🤔好奇, 😽撒娇, 困倦]
- emotion_score: 0-100的数字
- cat_says: 猫咪第一人称，30字以内，可爱调皮
- behavior_analysis: 专业但不生硬，分析肢体语言
- interaction_suggestion: 具体可操作的建议
- meme_text: 适合做表情包的短文案，20字以内
- meme_category: [撒娇, 搞笑, 治愈, 调皮] 之一

只输出JSON，不要其他文字。`;
  }

  /**
   * 解析API响应
   */
  private parseResponse(content: string): AnalysisResult {
    try {
      // 提取JSON（可能被```json包裹）
      let jsonStr = content;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
                       content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }

      const result = JSON.parse(jsonStr);

      // 验证必需字段
      if (!result.emotion || !result.cat_says) {
        throw new Error('响应缺少必需字段');
      }

      return {
        emotion: result.emotion,
        emotionScore: result.emotion_score || 70,
        catSays: result.cat_says,
        behaviorAnalysis: result.behavior_analysis || '猫咪看起来很可爱',
        interactionSuggestion: result.interaction_suggestion || '可以和猫咪互动',
        memeText: result.meme_text || result.cat_says,
        memeCategory: result.meme_category || '撒娇'
      };
    } catch (error) {
      console.error('解析KIMI响应失败:', content);
      throw new Error('无法解析AI响应');
    }
  }
}
