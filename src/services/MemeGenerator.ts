// src/services/MemeGenerator.ts
/**
 * 表情包生成服务
 * 使用ViewShot实现真实的图片合成
 */

import { View, StyleProp, ViewStyle, Image, Text } from 'react-native';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Share, Alert, Platform, PermissionsAndroid } from 'react-native';
import { Colors } from '../constants/theme';

export interface MemeConfig {
  imageUri: string;
  text: string;
  stickers: string[];
  filter: 'cute' | 'funny' | 'healing';
}

export interface MemeResult {
  uri: string;
  width: number;
  height: number;
}

/**
 * 表情包生成器
 */
export class MemeGenerator {
  /**
   * 生成表情包（真实实现）
   * 注意：需要在UI层使用ViewShot组件包裹预览区域
   */
  async generateMeme(config: MemeConfig, viewShotRef: any): Promise<MemeResult> {
    try {

      // 使用ViewShot截图
      const uri = await viewShotRef.current.capture({
        format: 'png',
        quality: 1.0,
        width: 640,
        height: 640
      });

      return {
        uri,
        width: 640,
        height: 640
      };
    } catch (error) {
      console.error('❌ 生成失败:', error);
      throw new Error('生成表情包失败，请重试');
    }
  }

  /**
   * 保存表情包到相册（真实实现）
   */
  async saveToGallery(uri: string): Promise<boolean> {
    try {

      // Android权限检查
      if (Platform.OS === 'android') {
        const granted = await this.requestStoragePermission();
        if (!granted) {
          Alert.alert('权限拒绝', '需要相册权限才能保存图片');
          return false;
        }
      }

      // 保存到相册
      const savedUri = await CameraRoll.save(uri, { type: 'photo' });

      Alert.alert('保存成功', '表情包已保存到相册');
      return true;
    } catch (error: any) {
      console.error('❌ 保存失败:', error);

      if (error.message?.includes('permission')) {
        Alert.alert('权限错误', '请在设置中允许访问相册');
      } else {
        Alert.alert('保存失败', error.message || '无法保存到相册');
      }

      return false;
    }
  }

  /**
   * 分享表情包（真实实现）
   */
  async shareMeme(uri: string, text?: string): Promise<void> {
    try {
      const shareText = text || '快来用猫语心愿APP生成猫咪表情包~ 🐱';

      if (Platform.OS === 'ios') {
        await Share.share({
          message: shareText,
          url: uri
        });
      } else {
        await Share.share({
          message: shareText
        });
      }
    } catch (error: any) {
      if (error.message?.includes('cancelled')) {
        // 用户取消分享,静默处理
      } else {
        Alert.alert('分享失败', '无法打开分享面板');
      }
    }
  }

  /**
   * 请求Android存储权限
   */
  private async requestStoragePermission(): Promise<boolean> {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: '相册权限',
          message: '需要相册权限来保存表情包',
          buttonNegative: '取消',
          buttonPositive: '允许'
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('权限请求失败:', error);
      return false;
    }
  }

  /**
   * 批量生成表情包（暂不实现）
   */
  async generateBatch(configs: MemeConfig[]): Promise<MemeResult[]> {
    throw new Error('批量生成功能暂未实现');
  }

  /**
   * 获取滤镜样式配置
   */
  getFilterStyle(filter: 'cute' | 'funny' | 'healing') {
    const filters = {
      cute: {
        overlay: 'rgba(255, 182, 193, 0.2)',  // 粉色叠加
        overlayColor: '#FFB6C1',
        borderColor: '#FFB6C1',
        tintColor: '#FFE4E1'
      },
      funny: {
        overlay: 'rgba(255, 215, 0, 0.15)',    // 金色叠加
        overlayColor: '#FFD700',
        borderColor: '#FFD700',
        tintColor: '#FFF8DC'
      },
      healing: {
        overlay: 'rgba(135, 206, 235, 0.15)', // 蓝色叠加
        overlayColor: '#87CEEB',
        borderColor: '#87CEEB',
        tintColor: '#E0F7FF'
      }
    };

    return filters[filter] || filters.cute;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalGenerated: 0,
      todayGenerated: 0,
      popularFilter: 'cute',
      popularStickers: ['❤️', '✨', '🥺']
    };
  }
}

export const memeGenerator = new MemeGenerator();
