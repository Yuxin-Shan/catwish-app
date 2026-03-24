// src/utils/emotionUtils.ts
/**
 * 情绪工具类
 * 提供情绪相关的颜色和图标获取方法
 */

import { Colors } from '../constants/theme';

/**
 * 获取情绪对应的颜色
 * @param emotion 情绪字符串 (例如: "😊 开心", "😌 放松")
 * @returns 颜色值
 */
export const getEmotionColor = (emotion: string): string => {
  const emotionColors: Record<string, string> = {
    '😊': Colors.emotions.happy,
    '😌': Colors.emotions.relaxed,
    '😰': Colors.emotions.anxious,
    '😠': Colors.emotions.angry,
    '🤔': Colors.emotions.curious,
    '😽': Colors.emotions.affectionate
  };

  for (const [key, color] of Object.entries(emotionColors)) {
    if (emotion.includes(key)) {
      return color;
    }
  }

  return Colors.primary;
};

/**
 * 获取情绪对应的Emoji图标
 * @param emotion 情绪字符串 (例如: "开心", "放松")
 * @returns Emoji图标
 */
export const getEmotionEmoji = (emotionText: string): string => {
  const emotionEmojis: Record<string, string> = {
    '开心': '😊',
    '非常开心': '😊',
    '放松': '😌',
    '焦虑': '😰',
    '生气': '😠',
    '好奇': '🤔',
    '亲昵': '😽',
    '可爱': '😸',
    '害怕': '😿',
    '惊讶': '😲'
  };

  for (const [key, emoji] of Object.entries(emotionEmojis)) {
    if (emotionText.includes(key)) {
      return emoji;
    }
  }

  return '😊'; // 默认表情
};

/**
 * EmotionUtils 类
 * 提供面向对象的API
 */
export class EmotionUtils {
  /**
   * 获取情绪颜色
   */
  static getColor(emotion: string): string {
    return getEmotionColor(emotion);
  }

  /**
   * 获取情绪Emoji
   */
  static getEmoji(emotion: string): string {
    return getEmotionEmoji(emotion);
  }

  /**
   * 解析情绪标签，提取表情和文本
   * @param emotionLabel 完整的情绪标签 (例如: "😊 开心")
   * @returns 包含emoji和text的对象
   */
  static parseEmotionLabel(emotionLabel: string): { emoji: string; text: string } {
    // 提取emoji (Unicode范围)
    const emojiMatch = emotionLabel.match(/[\u{1F300}-\u{1F9FF}]/u);
    const emoji = emojiMatch ? emojiMatch[0] : '😊';

    // 提取文本部分
    const text = emotionLabel.replace(/[\u{1F300}-\u{1F9FF}]\s*/u, '').trim();

    return { emoji, text };
  }
}

export default EmotionUtils;
