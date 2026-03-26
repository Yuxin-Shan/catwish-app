/**
 * EmotionUtils Unit Tests
 */

import { getEmotionColor, getEmotionEmoji, EmotionUtils } from '../emotionUtils';
import { Colors } from '../../constants/theme';

describe('EmotionUtils', () => {
  describe('getEmotionColor', () => {
    it('should return happy color for 😊 emotion', () => {
      const result = getEmotionColor('😊 开心');
      expect(result).toBe(Colors.emotions.happy);
    });

    it('should return relaxed color for 😌 emotion', () => {
      const result = getEmotionColor('😌 放松');
      expect(result).toBe(Colors.emotions.relaxed);
    });

    it('should return anxious color for 😰 emotion', () => {
      const result = getEmotionColor('😰 焦虑');
      expect(result).toBe(Colors.emotions.anxious);
    });

    it('should return angry color for 😠 emotion', () => {
      const result = getEmotionColor('😠 生气');
      expect(result).toBe(Colors.emotions.angry);
    });

    it('should return curious color for 🤔 emotion', () => {
      const result = getEmotionColor('🤔 好奇');
      expect(result).toBe(Colors.emotions.curious);
    });

    it('should return affectionate color for 😽 emotion', () => {
      const result = getEmotionColor('😽 亲昵');
      expect(result).toBe(Colors.emotions.affectionate);
    });

    it('should return primary color for unknown emotions', () => {
      const result = getEmotionColor('🎭 未知情绪');
      expect(result).toBe(Colors.primary);
    });

    it('should handle emotion text without emoji', () => {
      const result = getEmotionColor('开心');
      expect(result).toBe(Colors.primary);
    });
  });

  describe('getEmotionEmoji', () => {
    it('should return 😊 for 开心', () => {
      const result = getEmotionEmoji('开心');
      expect(result).toBe('😊');
    });

    it('should return 😊 for 非常开心', () => {
      const result = getEmotionEmoji('非常开心');
      expect(result).toBe('😊');
    });

    it('should return 😌 for 放松', () => {
      const result = getEmotionEmoji('放松');
      expect(result).toBe('😌');
    });

    it('should return 😰 for 焦虑', () => {
      const result = getEmotionEmoji('焦虑');
      expect(result).toBe('😰');
    });

    it('should return 😠 for 生气', () => {
      const result = getEmotionEmoji('生气');
      expect(result).toBe('😠');
    });

    it('should return 🤔 for 好奇', () => {
      const result = getEmotionEmoji('好奇');
      expect(result).toBe('🤔');
    });

    it('should return 😽 for 亲昵', () => {
      const result = getEmotionEmoji('亲昵');
      expect(result).toBe('😽');
    });

    it('should return 😸 for 可爱', () => {
      const result = getEmotionEmoji('可爱');
      expect(result).toBe('😸');
    });

    it('should return 😿 for 害怕', () => {
      const result = getEmotionEmoji('害怕');
      expect(result).toBe('😿');
    });

    it('should return 😲 for 惊讶', () => {
      const result = getEmotionEmoji('惊讶');
      expect(result).toBe('😲');
    });

    it('should return default 😊 for unknown emotions', () => {
      const result = getEmotionEmoji('未知');
      expect(result).toBe('😊');
    });
  });

  describe('EmotionUtils class', () => {
    describe('getColor', () => {
      it('should return happy color for 😊 emotion', () => {
        const result = EmotionUtils.getColor('😊 开心');
        expect(result).toBe(Colors.emotions.happy);
      });
    });

    describe('getEmoji', () => {
      it('should return 😊 for 开心', () => {
        const result = EmotionUtils.getEmoji('开心');
        expect(result).toBe('😊');
      });
    });

    describe('parseEmotionLabel', () => {
      it('should parse emotion label with emoji and text', () => {
        const result = EmotionUtils.parseEmotionLabel('😊 开心');
        expect(result).toEqual({
          emoji: '😊',
          text: '开心'
        });
      });

      it('should parse emotion label with different emoji', () => {
        const result = EmotionUtils.parseEmotionLabel('😌 放松');
        expect(result).toEqual({
          emoji: '😌',
          text: '放松'
        });
      });

      it('should handle text without emoji', () => {
        const result = EmotionUtils.parseEmotionLabel('开心');
        expect(result).toEqual({
          emoji: '😊',
          text: '开心'
        });
      });

      it('should handle emoji only', () => {
        const result = EmotionUtils.parseEmotionLabel('😊');
        expect(result).toEqual({
          emoji: '😊',
          text: ''
        });
      });

      it('should handle multiple emojis in text', () => {
        const result = EmotionUtils.parseEmotionLabel('😊 非常开心 😸');
        expect(result.emoji).toBe('😊');
        expect(result.text).toBe('非常开心 😸');
      });
    });
  });
});
