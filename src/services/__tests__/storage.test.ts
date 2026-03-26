/**
 * StorageService Tests
 *
 * TDD Approach: Characterization Tests
 * These tests document the CURRENT behavior of StorageService
 * to create a safety net before any refactoring.
 *
 * Test Categories:
 * 1. Save Data Tests - Test saving functionality
 * 2. Read Data Tests - Test reading functionality
 * 3. Delete Data Tests - Test deletion functionality
 * 4. Search and Filter Tests - Test search and filter functionality
 * 5. User Preferences Tests - Test preferences functionality
 * 6. Usage Stats Tests - Test usage statistics functionality
 * 7. Error Handling Tests - Test error handling
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, AnalysisRecord } from '../storage';
import { AnalysisResult } from '../ai/types';

const originalError = console.error;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
}));

describe('StorageService', () => {
  let storageService: StorageService;

  beforeAll(() => {
    console.error = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    storageService = new StorageService();
  });

  afterAll(() => {
    console.error = originalError;
  });

  /**
   * Save Data Tests
   * Test the save functionality
   */
  describe('Save Data', () => {
    it('should save analysis record successfully', async () => {
      const mockRecord: AnalysisRecord = {
        id: 'test-id-1',
        imageUri: 'file://test.jpg',
        result: {
          emotion: '开心',
          confidence: 0.95,
          catSays: '喵~ 今天心情真好！',
          behaviorAnalysis: '猫咪耳朵竖起，尾巴轻轻摇摆，表示很开心',
          memeText: '今天也是元气满满的一天喵~',
          timestamp: Date.now(),
        } as unknown as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined);

      await storageService.saveAnalysis(mockRecord);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:analyses:test-id-1',
        expect.stringContaining('"id":"test-id-1"')
      );
    });

    it('should update analysis index when saving record', async () => {
      const mockRecord: AnalysisRecord = {
        id: 'test-id-2',
        imageUri: 'file://test.jpg',
        result: {
          emotion: '开心',
          confidence: 0.95,
          catSays: '喵~ 今天心情真好！',
          behaviorAnalysis: '猫咪耳朵竖起，尾巴轻轻摇摆，表示很开心',
          memeText: '今天也是元气满满的一天喵~',
          timestamp: Date.now(),
        } as unknown as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('[]');
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.saveAnalysis(mockRecord);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:analysis_index',
        expect.stringContaining('"test-id-2"')
      );
    });

    it('should limit index size to 1000 records', async () => {
      // Create 1001 mock records
      const records = Array.from({ length: 1001 }, (_, i) => `id-${i}`);

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(records));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

      const mockRecord: AnalysisRecord = {
        id: 'new-id',
        imageUri: 'file://test.jpg',
        result: {
          emotion: '开心',
          confidence: 0.95,
          catSays: '喵~ 今天心情真好！',
          behaviorAnalysis: '猫咪耳朵竖起，尾巴轻轻摇摆，表示很开心',
          memeText: '今天也是元气满满的一天喵~',
          timestamp: Date.now(),
        } as unknown as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };

      await storageService.saveAnalysis(mockRecord);

      // Should remove old records to keep only 1000
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });

    it('should handle save error gracefully', async () => {
      const mockRecord: AnalysisRecord = {
        id: 'test-id-error',
        imageUri: 'file://test.jpg',
        result: {
          emotion: '开心',
          confidence: 0.95,
          catSays: '喵~ 今天心情真好！',
          behaviorAnalysis: '猫咪耳朵竖起，尾巴轻轻摇摆，表示很开心',
          memeText: '今天也是元气满满的一天喵~',
          timestamp: Date.now(),
        } as unknown as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(storageService.saveAnalysis(mockRecord)).rejects.toThrow();
    });
  });

  /**
   * Read Data Tests
   * Test the read functionality
   */
  describe('Read Data', () => {
    it('should get all analysis records', async () => {
      const mockRecords = ['id-1', 'id-2', 'id-3'];
      const mockData1 = {
        id: 'id-1',
        imageUri: 'file://test1.jpg',
        result: { emotion: '开心' } as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };
      const mockData2 = {
        id: 'id-2',
        imageUri: 'file://test2.jpg',
        result: { emotion: '生气' } as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };
      const mockData3 = {
        id: 'id-3',
        imageUri: 'file://test3.jpg',
        result: { emotion: '悲伤' } as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };

      (AsyncStorage.getItem as jest.Mock)
        .mockResolvedValueOnce(JSON.stringify(mockRecords))
        .mockResolvedValueOnce(JSON.stringify(mockData1))
        .mockResolvedValueOnce(JSON.stringify(mockData2))
        .mockResolvedValueOnce(JSON.stringify(mockData3));

      const result = await storageService.getAnalyses();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('id-1');
      expect(result[1].id).toBe('id-2');
      expect(result[2].id).toBe('id-3');
    });

    it('should get single analysis record', async () => {
      const mockData = {
        id: 'test-id',
        imageUri: 'file://test.jpg',
        result: { emotion: '开心' } as AnalysisResult,
        timestamp: Date.now(),
        synced: false,
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));

      const result = await storageService.getAnalysis('test-id');

      expect(result).not.toBeNull();
      expect(result?.id).toBe('test-id');
    });

    it('should return null for non-existent record', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storageService.getAnalysis('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return empty array on read error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Read error'));

      const result = await storageService.getAnalyses();

      expect(result).toEqual([]);
    });

    it('should return null on single record read error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Read error'));

      const result = await storageService.getAnalysis('test-id');

      expect(result).toBeNull();
    });
  });

  /**
   * Search and Filter Tests
   */
  describe('Search and Filter', () => {
    it('should search records by keyword', async () => {
      const mockRecords = [
        {
          id: 'id-1',
          imageUri: 'file://test1.jpg',
          result: {
            emotion: '开心',
            catSays: '喵~ 今天心情真好！',
            behaviorAnalysis: '猫咪很开心',
          } as AnalysisResult,
          timestamp: Date.now(),
          synced: false,
        },
        {
          id: 'id-2',
          imageUri: 'file://test2.jpg',
          result: {
            emotion: '生气',
            catSays: '哼！',
            behaviorAnalysis: '猫咪很生气',
          } as AnalysisResult,
          timestamp: Date.now(),
          synced: false,
        },
      ];

      jest.spyOn(storageService, 'getAnalyses').mockResolvedValueOnce(mockRecords as any);

      const result = await storageService.searchAnalyses('开心');

      expect(result).toHaveLength(1);
      expect(result[0].result.emotion).toContain('开心');
    });

    it('should filter records by emotion', async () => {
      const mockRecords = [
        {
          id: 'id-1',
          imageUri: 'file://test1.jpg',
          result: { emotion: '开心' } as AnalysisResult,
          timestamp: Date.now(),
          synced: false,
        },
        {
          id: 'id-2',
          imageUri: 'file://test2.jpg',
          result: { emotion: '生气' } as AnalysisResult,
          timestamp: Date.now(),
          synced: false,
        },
      ];

      jest.spyOn(storageService, 'getAnalyses').mockResolvedValueOnce(mockRecords as any);

      const result = await storageService.filterByEmotion('开心');

      expect(result).toHaveLength(1);
      expect(result[0].result.emotion).toContain('开心');
    });

    it('should filter records by time range - today', async () => {
      const now = Date.now();
      const mockRecords = [
        {
          id: 'id-1',
          imageUri: 'file://test1.jpg',
          result: { emotion: '开心' } as AnalysisResult,
          timestamp: now - 1000, // 1 second ago
          synced: false,
        },
        {
          id: 'id-2',
          imageUri: 'file://test2.jpg',
          result: { emotion: '生气' } as AnalysisResult,
          timestamp: now - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          synced: false,
        },
      ];

      jest.spyOn(storageService, 'getAnalyses').mockResolvedValueOnce(mockRecords as any);

      const result = await storageService.filterByTimeRange('today');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('id-1');
    });

    it('should filter records by time range - week', async () => {
      const now = Date.now();
      const mockRecords = [
        {
          id: 'id-1',
          imageUri: 'file://test1.jpg',
          result: { emotion: '开心' } as AnalysisResult,
          timestamp: now - 3 * 24 * 60 * 60 * 1000, // 3 days ago
          synced: false,
        },
        {
          id: 'id-2',
          imageUri: 'file://test2.jpg',
          result: { emotion: '生气' } as AnalysisResult,
          timestamp: now - 10 * 24 * 60 * 60 * 1000, // 10 days ago
          synced: false,
        },
      ];

      jest.spyOn(storageService, 'getAnalyses').mockResolvedValueOnce(mockRecords as any);

      const result = await storageService.filterByTimeRange('week');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('id-1');
    });

    it('should return empty array on search error', async () => {
      jest.spyOn(storageService, 'getAnalyses').mockRejectedValueOnce(new Error('Search error'));

      const result = await storageService.searchAnalyses('test');

      expect(result).toEqual([]);
    });
  });

  /**
   * Delete Data Tests
   */
  describe('Delete Data', () => {
    it('should delete analysis record successfully', async () => {
      const mockIndex = ['id-1', 'id-2', 'id-3'];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockIndex));
      (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.deleteAnalysis('id-2');

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@catwish:analyses:id-2');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:analysis_index',
        expect.stringContaining('"id-1"')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:analysis_index',
        expect.not.stringContaining('"id-2"')
      );
    });

    it('should clean old data (> 30 days)', async () => {
      const now = Date.now();
      const oldTimestamp = now - 35 * 24 * 60 * 60 * 1000; // 35 days ago
      const newTimestamp = now - 10 * 24 * 60 * 60 * 1000; // 10 days ago

      const mockRecords = [
        {
          id: 'old-id',
          imageUri: 'file://old.jpg',
          result: { emotion: '开心' } as AnalysisResult,
          timestamp: oldTimestamp,
          synced: false,
        },
        {
          id: 'new-id',
          imageUri: 'file://new.jpg',
          result: { emotion: '生气' } as AnalysisResult,
          timestamp: newTimestamp,
          synced: false,
        },
      ];

      jest.spyOn(storageService, 'getAnalyses').mockResolvedValueOnce(mockRecords as any);
      jest.spyOn(storageService, 'deleteAnalysis').mockResolvedValue(undefined);

      const deletedCount = await storageService.cleanOldData();

      expect(deletedCount).toBe(1);
      expect(storageService.deleteAnalysis).toHaveBeenCalledWith('old-id');
    });

    it('should handle delete error gracefully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Delete error'));

      await expect(storageService.deleteAnalysis('test-id')).rejects.toThrow();
    });
  });

  /**
   * User Preferences Tests
   */
  describe('User Preferences', () => {
    it('should save user preferences', async () => {
      const prefs = { theme: 'dark', language: 'zh' };

      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.savePreferences(prefs);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:prefs',
        JSON.stringify(prefs)
      );
    });

    it('should get user preferences', async () => {
      const prefs = { theme: 'dark', language: 'zh' };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(prefs));

      const result = await storageService.getPreferences();

      expect(result).toEqual(prefs);
    });

    it('should return empty object when no preferences exist', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await storageService.getPreferences();

      expect(result).toEqual({});
    });

    it('should return empty object on preferences read error', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Read error'));

      const result = await storageService.getPreferences();

      expect(result).toEqual({});
    });
  });

  /**
   * Usage Stats Tests
   */
  describe('Usage Statistics', () => {
    it('should record usage event', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.recordUsage('photo_taken', { count: 1 });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:usage:photo_taken',
        expect.stringContaining('"count":1')
      );
    });

    it('should increment usage count on repeated events', async () => {
      const existingStats = { count: 5, events: [{ timestamp: Date.now() }] };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(existingStats));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await storageService.recordUsage('photo_taken');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@catwish:usage:photo_taken',
        expect.stringContaining('"count":6')
      );
    });
  });

  /**
   * Clear All Data Tests
   */
  describe('Clear All Data', () => {
    it('should clear all data', async () => {
      (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);

      await storageService.clearAll();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should handle clear error gracefully', async () => {
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(new Error('Clear error'));

      await expect(storageService.clearAll()).rejects.toThrow();
    });
  });
});
