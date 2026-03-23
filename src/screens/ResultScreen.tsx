// src/screens/ResultScreen.tsx
/**
 * 分析结果页面 - 完整实现
 * 集成AI分析结果,显示表情包生成入口
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { AnalysisResult } from '../services/ai/types';
import { storageService } from '../services/storage';
import { Button } from '../components/Button';

type ResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Result'>;

interface Props {
  navigation: ResultScreenNavigationProp;
  route: {
    params: {
      imageUri: string;
      analysisResult: AnalysisResult;
    };
  };
}

export default function ResultScreen({ navigation, route }: Props) {
  const { imageUri, analysisResult } = route.params;

  // 保存到本地存储
  React.useEffect(() => {
    saveToHistory();
  }, []);

  const saveToHistory = async () => {
    try {
      const record = {
        id: Date.now().toString(),
        imageUri,
        result: analysisResult,
        timestamp: Date.now(),
        synced: false
      };

      await storageService.saveAnalysis(record);
      console.log('已保存到历史记录:', record);
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleGenerateMeme = () => {
    navigation.navigate('MemeEditor', {
      imageUri,
      analysisResult
    } as any);
  };

  const handleShare = async () => {
    try {
      const { url } = await Share.share({
        message: `我家的猫咪说: "${analysisResult.catSays}" 🐱\n\n用猫语心愿APP看看你的猫咪在想什么~`,
        url: 'https://catwish.app' // 未来添加
      });

      if (url) {
        console.log('分享成功:', url);
      }
    } catch (error: any) {
      console.error('分享失败:', error);
    }
  };

  const handleSave = async () => {
    Alert.alert(
      '保存成功',
      '已保存到历史记录',
      [
        { text: '查看历史', onPress: () => navigation.navigate('History' as any) },
        { text: '确定', style: 'cancel' }
      ]
    );
  };

  const handleReanalyze = () => {
    Alert.alert(
      '重新分析',
      '需要返回相机页面重新拍摄',
      [
        { text: '确定', style: 'cancel' }
      ]
    );
  };

  // 获取情绪颜色
  const getEmotionColor = (emotion: string) => {
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

  return (
    <View style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>解读结果</Text>
        <TouchableOpacity style={styles.moreButton} onPress={handleReanalyze}>
          <Text style={styles.moreIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 猫咪照片 */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Text style={styles.imagePlaceholder}>🐱</Text>
            <Text style={styles.imageSubtext}>{imageUri}</Text>
            <Text style={styles.imageNote}>
              {analysisResult.behaviorAnalysis.slice(0, 50)}...
            </Text>
          </View>
        </View>

        {/* 情绪标签 */}
        <View style={styles.emotionCard}>
          <View style={styles.emotionHeader}>
            <Text style={styles.emotionLabel}>{analysisResult.emotion}</Text>
            <View style={styles.emotionScoreBadge}>
              <Text style={styles.emotionScoreText}>
                {analysisResult.emotionScore}分
              </Text>
            </View>
          </View>

          {/* 进度条 */}
          <View style={styles.emotionBarContainer}>
            <View
              style={[styles.emotionBar, { width: `${analysisResult.emotionScore}%` }]}
            />
          </View>
        </View>

        {/* 猫咪的话 */}
        <View style={styles.catSayCard}>
          <View style={styles.catSayHeader}>
            <Text style={styles.catSayIcon}>💬</Text>
            <Text style={styles.catSayTitle}>本喵说</Text>
          </View>
          <Text style={styles.catSayText}>{analysisResult.catSays}</Text>
        </View>

        {/* 行为分析 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>📋 行为解读</Text>
          <Text style={styles.sectionText}>{analysisResult.behaviorAnalysis}</Text>
        </View>

        {/* 互动建议 */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💡 互动建议</Text>
          <Text style={styles.sectionText}>{analysisResult.interactionSuggestion}</Text>
        </View>

        {/* 表情包生成按钮 - 核心差异化功能 */}
        <TouchableOpacity
          style={styles.memeButton}
          onPress={handleGenerateMeme}
          activeOpacity={0.8}
        >
          <Text style={styles.memeIcon}>✨</Text>
          <Text style={styles.memeTitle}>生成表情包</Text>
          <Text style={styles.memeSubtitle}>
            {analysisResult.memeCategory || '可爱'}风格
          </Text>
        </TouchableOpacity>

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          <Button
            title="💾 保存"
            onPress={handleSave}
            variant="outline"
            size="large"
            icon="💾"
          />
          <Button
            title="📤 分享"
            onPress={handleShare}
            variant="primary"
            size="large"
            icon="📤"
          />
        </View>

        {/* 保存提示 */}
        <View style={styles.saveTip}>
          <Text style={styles.saveTipText}>
            💾 已自动保存到历史记录
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary
  },

  // 导航栏
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.primary
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  backIcon: {
    fontSize: 28,
    color: Colors.text.primary
  },
  navTitle: {
    ...Typography.bodyLarge,
    color: Colors.text.primary,
    fontWeight: '600'
  },
  moreButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  moreIcon: {
    fontSize: 24
  },

  // 滚动内容
  scrollContent: {
    padding: Spacing.lg
  },

  // 图片区域
  imageContainer: {
    marginBottom: Spacing.lg
  },
  imageWrapper: {
    aspectRatio: 1,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light
  },
  imagePlaceholder: {
    fontSize: 80,
    marginBottom: Spacing.sm
  },
  imageSubtext: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs
  },
  imageNote: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.md
  },

  // 情绪卡片
  emotionCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.sm
  },
  emotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  emotionLabel: {
    ...Typography.h3,
    color: Colors.text.primary
  },
  emotionScoreBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm
  },
  emotionScoreText: {
    ...Typography.bodySmall,
    color: Colors.text.inverse,
    fontWeight: '600'
  },
  emotionBarContainer: {
    height: 8,
    backgroundColor: Colors.border.light,
    borderRadius: 4,
    overflow: 'hidden'
  },
  emotionBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4
  },

  // 猫咪的话
  catSayCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary
  },
  catSayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  catSayIcon: {
    fontSize: 20,
    marginRight: Spacing.sm
  },
  catSayTitle: {
    ...Typography.h3,
    color: Colors.text.primary
  },
  catSayText: {
    ...Typography.bodyLarge,
    color: Colors.text.primary,
    lineHeight: 26,
    marginTop: Spacing.sm
  },

  // 通用区块卡片
  sectionCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm
  },
  sectionText: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 22
  },

  // 表情包按钮
  memeButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.sm
  },
  memeIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm
  },
  memeTitle: {
    ...Typography.buttonLarge,
    color: Colors.text.inverse,
    fontWeight: '600',
    marginBottom: Spacing.xs
  },
  memeSubtitle: {
    ...Typography.bodySmall,
    color: Colors.text.inverse,
    opacity: 0.9
  },

  // 操作按钮
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md
  },

  // 保存提示
  saveTip: {
    alignItems: 'center',
    marginTop: Spacing.lg
  },
  saveTipText: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary
  }
});
