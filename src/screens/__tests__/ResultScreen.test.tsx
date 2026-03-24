/**
 * ResultScreen Component Tests
 *
 * TDD Approach: Characterization Tests
 * These tests document the CURRENT behavior of ResultScreen
 * to create a safety net before any refactoring.
 *
 * Key Focus Areas:
 * 1. getEmotionColor function - to be extracted and refactored
 * 2. Navigation and user interactions
 * 3. Data display and rendering
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ResultScreen from '../ResultScreen';
import { AnalysisResult } from '../../services/ai/types';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
};

// Mock route params
const createMockParams = (imageUri: string, analysisResult: AnalysisResult) => ({
  navigation: mockNavigation,
  route: {
    params: {
      imageUri,
      analysisResult,
    },
  },
});

// Mock storage service
jest.mock('../../services/storage', () => ({
  storageService: {
    saveAnalysis: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock Share
jest.mock('react-native/Libraries/Share/Share', () => ({
  Share: {
    share: jest.fn().mockResolvedValue({ url: 'https://test.com' }),
  },
}));

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe('ResultScreen', () => {
  const mockImageUri = 'file://test/cat.jpg';
  const mockAnalysisResult: AnalysisResult = {
    emotion: '😊 开心',
    emotionScore: 85,
    catSays: '主人,我今天玩得很开心!',
    behaviorAnalysis: '猫咪的尾巴竖直向上,耳朵向前,表示它心情愉悦,愿意与人互动。',
    interactionSuggestion: '可以尝试用玩具和猫咪互动,增进感情。',
    memeCategory: 'happy',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /**
   * Rendering Tests
   * Document what the screen currently displays
   */
  describe('Rendering', () => {
    it('should render the navigation title', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('解读结果')).toBeOnTheScreen();
    });

    it('should render the emotion label', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😊 开心')).toBeOnTheScreen();
    });

    it('should render the emotion score', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('85分')).toBeOnTheScreen();
    });

    it('should render the cat says text', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('主人,我今天玩得很开心!')).toBeOnTheScreen();
    });

    it('should render the behavior analysis', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('📋 行为解读')).toBeOnTheScreen();
      expect(screen.getByText(/猫咪的尾巴竖直向上/)).toBeOnTheScreen();
    });

    it('should render the interaction suggestion', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('💡 互动建议')).toBeOnTheScreen();
      expect(screen.getByText(/可以尝试用玩具和猫咪互动/)).toBeOnTheScreen();
    });

    it('should render the meme button', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('✨')).toBeOnTheScreen();
      expect(screen.getByText('生成表情包')).toBeOnTheScreen();
    });

    it('should render the save and share buttons', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('💾 保存')).toBeOnTheScreen();
      expect(screen.getByText('📤 分享')).toBeOnTheScreen();
    });
  });

  /**
   * getEmotionColor Function Tests
   * Document current behavior before extracting this function
   */
  describe('getEmotionColor function (internal)', () => {
    it('should render with happy emotion color (😊)', () => {
      const happyResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😊 非常开心',
      };
      const props = createMockParams(mockImageUri, happyResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😊 非常开心')).toBeOnTheScreen();
    });

    it('should render with relaxed emotion color (😌)', () => {
      const relaxedResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😌 放松',
      };
      const props = createMockParams(mockImageUri, relaxedResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😌 放松')).toBeOnTheScreen();
    });

    it('should render with anxious emotion color (😰)', () => {
      const anxiousResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😰 焦虑',
      };
      const props = createMockParams(mockImageUri, anxiousResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😰 焦虑')).toBeOnTheScreen();
    });

    it('should render with angry emotion color (😠)', () => {
      const angryResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😠 生气',
      };
      const props = createMockParams(mockImageUri, angryResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😠 生气')).toBeOnTheScreen();
    });

    it('should render with curious emotion color (🤔)', () => {
      const curiousResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '🤔 好奇',
      };
      const props = createMockParams(mockImageUri, curiousResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('🤔 好奇')).toBeOnTheScreen();
    });

    it('should render with affectionate emotion color (😽)', () => {
      const affectionateResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😽 亲昵',
      };
      const props = createMockParams(mockImageUri, affectionateResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😽 亲昵')).toBeOnTheScreen();
    });

    it('should default to primary color for unknown emotions', () => {
      const unknownResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '🎭 未知情绪',
      };
      const props = createMockParams(mockImageUri, unknownResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('🎭 未知情绪')).toBeOnTheScreen();
    });
  });

  /**
   * Navigation Tests
   * Document current navigation behavior
   */
  describe('Navigation', () => {
    it('should navigate back when back button is pressed', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      const backButton = screen.getByText('←');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);
    });

    it('should navigate to MemeEditor when generate meme button is pressed', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      const memeButton = screen.getByText('生成表情包');
      fireEvent.press(memeButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('MemeEditor', {
        imageUri: mockImageUri,
        analysisResult: mockAnalysisResult,
      });
    });

    it('should navigate to History when save alert is confirmed', () => {
      const { Alert } = require('react-native/Libraries/Alert/Alert');
      Alert.alert.mockImplementationOnce((title, message, buttons) => {
        if (buttons && buttons[0].onPress) {
          buttons[0].onPress();
        }
      });

      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      const saveButton = screen.getByText('💾 保存');
      fireEvent.press(saveButton);

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  /**
   * Interaction Tests
   * Document user interaction behavior
   */
  describe('User Interactions', () => {
    it('should trigger share when share button is pressed', async () => {
      const { Share } = require('react-native/Libraries/Share/Share');

      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      const shareButton = screen.getByText('📤 分享');
      fireEvent.press(shareButton);

      expect(Share.share).toHaveBeenCalledWith({
        message: `我家的猫咪说: "${mockAnalysisResult.catSays}" 🐱\n\n用猫语心愿APP看看你的猫咪在想什么~`,
        url: 'https://catwish.app',
      });
    });

    it('should show alert when reanalyze button is pressed', () => {
      const { Alert } = require('react-native/Libraries/Alert/Alert');

      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      const reanalyzeButton = screen.getByText('🔄');
      fireEvent.press(reanalyzeButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        '重新分析',
        '需要返回相机页面重新拍摄',
        expect.arrayContaining([
          expect.objectContaining({ text: '确定', style: 'cancel' }),
        ])
      );
    });
  });

  /**
   * Snapshot Test
   * Record the current component structure
   */
  describe('Snapshot', () => {
    it('should match the snapshot', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      const tree = render(<ResultScreen {...props} />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
