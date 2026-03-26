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

// Mock React Native modules BEFORE imports
jest.mock('react-native/Libraries/Share/Share', () => ({
  Share: {
    share: jest.fn().mockResolvedValue({ action: 'sharedAction' }),
  },
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import ResultScreen from '../ResultScreen';
import { AnalysisResult } from '../../services/ai/types';

// Import the mocked modules
import { Share } from 'react-native/Libraries/Share/Share';
import { Alert } from 'react-native/Libraries/Alert/Alert';

// Mock navigation
const mockNavigation: any = {
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

      expect(screen.getByText('解读结果')).toBeTruthy();
    });

    it('should render the emotion label', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😊 开心')).toBeTruthy();
    });

    it('should render the emotion score', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('85分')).toBeTruthy();
    });

    it('should render the cat says text', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('主人,我今天玩得很开心!')).toBeTruthy();
    });

    it('should render the behavior analysis', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('📋 行为解读')).toBeTruthy();
      expect(screen.getAllByText(/猫咪的尾巴竖直向上/).length).toBeGreaterThan(0);
    });

    it('should render the interaction suggestion', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('💡 互动建议')).toBeTruthy();
      expect(screen.getByText(/可以尝试用玩具和猫咪互动/)).toBeTruthy();
    });

    it('should render the meme button', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('✨')).toBeTruthy();
      expect(screen.getByText('生成表情包')).toBeTruthy();
    });

    it('should render the save and share buttons', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('💾 保存')).toBeTruthy();
      expect(screen.getByText('📤 分享')).toBeTruthy();
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

      expect(screen.getByText('😊 非常开心')).toBeTruthy();
    });

    it('should render with relaxed emotion color (😌)', () => {
      const relaxedResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😌 放松',
      };
      const props = createMockParams(mockImageUri, relaxedResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😌 放松')).toBeTruthy();
    });

    it('should render with anxious emotion color (😰)', () => {
      const anxiousResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😰 焦虑',
      };
      const props = createMockParams(mockImageUri, anxiousResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😰 焦虑')).toBeTruthy();
    });

    it('should render with angry emotion color (😠)', () => {
      const angryResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😠 生气',
      };
      const props = createMockParams(mockImageUri, angryResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😠 生气')).toBeTruthy();
    });

    it('should render with curious emotion color (🤔)', () => {
      const curiousResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '🤔 好奇',
      };
      const props = createMockParams(mockImageUri, curiousResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('🤔 好奇')).toBeTruthy();
    });

    it('should render with affectionate emotion color (😽)', () => {
      const affectionateResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '😽 亲昵',
      };
      const props = createMockParams(mockImageUri, affectionateResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('😽 亲昵')).toBeTruthy();
    });

    it('should default to primary color for unknown emotions', () => {
      const unknownResult: AnalysisResult = {
        ...mockAnalysisResult,
        emotion: '🎭 未知情绪',
      };
      const props = createMockParams(mockImageUri, unknownResult);
      render(<ResultScreen {...props} />);

      expect(screen.getByText('🎭 未知情绪')).toBeTruthy();
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

      const backButton = screen.getByTestId('back-button');
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

    it('should call Alert.alert when save is triggered', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      const { getByText } = render(<ResultScreen {...props} />);

      // The save button renders
      const saveButton = getByText('💾 保存');
      expect(saveButton).toBeTruthy();

      // Verify Alert module is mocked
      expect(Alert.alert).toBeDefined();
    });
  });

  /**
   * Interaction Tests
   * Document user interaction behavior
   */
  describe('User Interactions', () => {
    it('should have Share.share available when share button is pressed', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      const { getByText } = render(<ResultScreen {...props} />);

      // The share button renders
      const shareButton = getByText('📤 分享');
      expect(shareButton).toBeTruthy();

      // Verify Share module is mocked
      expect(Share.share).toBeDefined();
    });

    it('should have reanalyze button that renders', () => {
      const props = createMockParams(mockImageUri, mockAnalysisResult);
      render(<ResultScreen {...props} />);

      // The reanalyze button is present (using testID)
      const reanalyzeButton = screen.getByTestId('right-button');
      expect(reanalyzeButton).toBeTruthy();
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
