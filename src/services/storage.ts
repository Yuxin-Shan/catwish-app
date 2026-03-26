// src/services/storage.ts
/**
 * 本地存储服务
 * AsyncStorage封装
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '../services/ai/types';

/**
 * 分析记录
 */
export interface AnalysisRecord {
  id: string;
  imageUri: string;
  imageBase64?: string;  // 用于显示的缩略图
  result: AnalysisResult;
  timestamp: number;
  synced: boolean;  // 是否已同步到云端
}

/**
 * 本地存储键
 */
const STORAGE_KEYS = {
  ANALYSES: '@catwish:analyses',
  ANALYSIS_INDEX: '@catwish:analysis_index',
  USER_PREFERENCES: '@catwish:prefs',
  USAGE_STATS: '@catwish:usage'
};

/**
 * 本地存储服务类
 */
export class StorageService {
  /**
   * 保存分析记录
   */
  async saveAnalysis(record: AnalysisRecord): Promise<void> {
    try {
      // 保存记录
      const key = `${STORAGE_KEYS.ANALYSES}:${record.id}`;
      await AsyncStorage.setItem(key, JSON.stringify(record));

      // 更新索引
      const index = await this.getAnalysisIndex();
      index.unshift(record.id);
      await AsyncStorage.setItem(STORAGE_KEYS.ANALYSIS_INDEX, JSON.stringify(index));

      // 限制索引大小 (最多保存1000条)
      if (index.length > 1000) {
        const toRemove = index.slice(1000);
        for (const id of toRemove) {
          await AsyncStorage.removeItem(`${STORAGE_KEYS.ANALYSES}:${id}`);
        }
        const newIndex = index.slice(0, 1000);
        await AsyncStorage.setItem(STORAGE_KEYS.ANALYSIS_INDEX, JSON.stringify(newIndex));
      }
    } catch (error) {
      console.error('保存分析记录失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有分析记录
   */
  async getAnalyses(): Promise<AnalysisRecord[]> {
    try {
      const index = await this.getAnalysisIndex();
      const records: AnalysisRecord[] = [];

      for (const id of index) {
        const key = `${STORAGE_KEYS.ANALYSES}:${id}`;
        const data = await AsyncStorage.getItem(key);
        if (data) {
          records.push(JSON.parse(data));
        }
      }

      return records;
    } catch (error) {
      console.error('读取分析记录失败:', error);
      return [];
    }
  }

  /**
   * 获取单条分析记录
   */
  async getAnalysis(id: string): Promise<AnalysisRecord | null> {
    try {
      const key = `${STORAGE_KEYS.ANALYSES}:${id}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('读取分析记录失败:', error);
      return null;
    }
  }

  /**
   * 搜索分析记录
   */
  async searchAnalyses(keyword: string): Promise<AnalysisRecord[]> {
    try {
      const analyses = await this.getAnalyses();
      const lowerKeyword = keyword.toLowerCase();

      return analyses.filter(record => {
        return (
          record.result.emotion.toLowerCase().includes(lowerKeyword) ||
          record.result.catSays.toLowerCase().includes(lowerKeyword) ||
          record.result.memeText?.toLowerCase().includes(lowerKeyword) ||
          record.result.behaviorAnalysis.toLowerCase().includes(lowerKeyword)
        );
      });
    } catch (error) {
      console.error('搜索分析记录失败:', error);
      return [];
    }
  }

  /**
   * 按情绪筛选
   */
  async filterByEmotion(emotion: string): Promise<AnalysisRecord[]> {
    try {
      const analyses = await this.getAnalyses();
      return analyses.filter(record => record.result.emotion.includes(emotion));
    } catch (error) {
      console.error('筛选分析记录失败:', error);
      return [];
    }
  }

  /**
   * 按时间范围筛选
   */
  async filterByTimeRange(range: 'today' | 'week' | 'month'): Promise<AnalysisRecord[]> {
    try {
      const analyses = await this.getAnalyses();
      const now = Date.now();
      let cutoffTime: number;

      switch (range) {
        case 'today':
          cutoffTime = now - 24 * 60 * 60 * 1000;
          break;
        case 'week':
          cutoffTime = now - 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          cutoffTime = now - 30 * 24 * 60 * 60 * 1000;
          break;
      }

      return analyses.filter(record => record.timestamp >= cutoffTime);
    } catch (error) {
      console.error('筛选分析记录失败:', error);
      return [];
    }
  }

  /**
   * 删除分析记录
   */
  async deleteAnalysis(id: string): Promise<void> {
    try {
      // 删除记录
      await AsyncStorage.removeItem(`${STORAGE_KEYS.ANALYSES}:${id}`);

      // 更新索引
      const index = await this.getAnalysisIndex();
      const newIndex = index.filter(itemId => itemId !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.ANALYSIS_INDEX, JSON.stringify(newIndex));
    } catch (error) {
      console.error('删除分析记录失败:', error);
      throw error;
    }
  }

  /**
   * 清理过期数据 (> 30天)
   */
  async cleanOldData(): Promise<number> {
    try {
      const analyses = await this.getAnalyses();
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const toDelete = analyses.filter(a => a.timestamp < thirtyDaysAgo);

      for (const record of toDelete) {
        await this.deleteAnalysis(record.id);
      }

      return toDelete.length;
    } catch (error) {
      console.error('清理过期数据失败:', error);
      return 0;
    }
  }

  /**
   * 获取分析记录索引
   */
  private async getAnalysisIndex(): Promise<string[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ANALYSIS_INDEX);
    return data ? JSON.parse(data) : [];
  }

  /**
   * 保存用户偏好
   */
  async savePreferences(prefs: Record<string, any>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(prefs));
    } catch (error) {
      console.error('保存用户偏好失败:', error);
    }
  }

  /**
   * 获取用户偏好
   */
  async getPreferences(): Promise<Record<string, any>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  /**
   * 记录使用统计
   */
  async recordUsage(event: string, data?: Record<string, any>): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.USAGE_STATS}:${event}`;
      const existing = await AsyncStorage.getItem(key);
      const stats = existing ? JSON.parse(existing) : { count: 0, events: [] };

      stats.count++;
      stats.events.push({
        timestamp: Date.now(),
        data
      });

      await AsyncStorage.setItem(key, JSON.stringify(stats));
    } catch (error) {
      console.error('记录使用统计失败:', error);
    }
  }

  /**
   * 清除所有数据 (谨慎使用)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('清除所有数据失败:', error);
      throw error;
    }
  }
}

// 导出单例
export const storageService = new StorageService();
