// src/services/ai/providers/MockProvider.ts
/**
 * Mock AI提供者
 * 用于开发和测试
 */

import { AIProvider, AnalysisResult } from '../types';

export class MockProvider implements AIProvider {
  name = 'Mock Service (开发测试)';

  /**
   * 模拟AI分析
   * 返回预设的测试数据
   */
  async analyzeImage(imageUri: string): Promise<AnalysisResult> {
    // 模拟网络延迟
    await this.delay(1000);

    // 随机返回不同情绪
    const emotions = [
      {
        emotion: '😊开心',
        emotionScore: 85,
        catSays: '喵~今天感觉超好的!',
        behaviorAnalysis: '猫咪表情轻松,眼睛明亮,尾巴竖起,这是开心和自信的表现',
        interactionSuggestion: '现在可以和猫咪玩耍,它会很开心地参与',
        memeText: '好开心~',
        memeCategory: '撒娇'
      },
      {
        emotion: '😌放松',
        emotionScore: 90,
        catSays: '阳光真好,本喵正在做一个美梦呢~',
        behaviorAnalysis: '猫咪身体舒展,眼睛微闭,呼吸平稳,处于完全放松状态',
        interactionSuggestion: '可以轻轻抚摸,或者就在旁边陪着它',
        memeText: '好舒服啊~',
        memeCategory: '治愈'
      },
      {
        emotion: '😽撒娇',
        emotionScore: 88,
        catSays: '想让你抱抱我~摸摸头就好啦',
        behaviorAnalysis: '猫咪竖起尾巴,身体蹭人,这是典型的亲昵行为',
        interactionSuggestion: '这是最好的互动时机!可以摸摸头、挠挠下巴',
        memeText: '抱抱我嘛~',
        memeCategory: '撒娇'
      },
      {
        emotion: '🤔好奇',
        emotionScore: 75,
        catSays: '这是什么?想仔细看看~',
        behaviorAnalysis: '猫咪歪头,睁大眼睛,耳朵竖起,正在观察和探索',
        interactionSuggestion: '可以给猫咪展示新玩具或物体,满足好奇心',
        memeText: '是什么呀?',
        memeCategory: '搞笑'
      }
    ];

    // 随机选择一个
    const randomIndex = Math.floor(Math.random() * emotions.length);
    return emotions[randomIndex];
  }

  /**
   * 估算成本 (Mock免费)
   */
  async estimateCost(imageUri: string): Promise<number> {
    return 0;
  }

  /**
   * 健康检查 (Mock总是可用)
   */
  async healthCheck(): Promise<boolean> {
    return true;
  }

  /**
   * 模拟延迟
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
