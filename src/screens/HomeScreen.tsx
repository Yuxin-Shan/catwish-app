// src/screens/HomeScreen.tsx
/**
 * 首页 (性能优化版)
 * 核心入口,引导用户拍照/上传
 */

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen = ({ navigation }: Props) => {
  // 使用useCallback缓存函数,避免不必要的重渲染
  const handleCameraPress = useCallback(() => {
    navigation.navigate('Camera' as any);
  }, [navigation]);

  const handleGalleryPress = useCallback(() => {
    // TODO: 实现相册选择
    // 功能待实现
  }, []);

  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('History' as any);
  }, [navigation]);

  // 使用useMemo缓存静态内容
  const illustrationContent = useMemo(() => ({
    emoji: '🐱💬',
    title: '让猫咪"开口说话"',
    subtitle: 'AI解读猫咪情绪,生成可爱表情包'
  }), []);

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>🐱 猫语心愿</Text>
        <TouchableOpacity style={styles.settingsButton} testID="settings-icon">
          <Ionicons name="settings" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* 主内容区 */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 插图区域 */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationEmoji}>{illustrationContent.emoji}</Text>
          <Text style={styles.illustrationText}>{illustrationContent.title}</Text>
          <Text style={styles.illustrationSubtext}>{illustrationContent.subtitle}</Text>
        </View>

        {/* 主要操作按钮 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.cameraButton]}
            onPress={handleCameraPress}
            activeOpacity={0.8}
          >
            <Ionicons name="camera" size={32} color={Colors.text.inverse} />
            <Text style={styles.primaryButtonText}>拍照解读猫咪心情</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, styles.galleryButton]}
            onPress={handleGalleryPress}
            activeOpacity={0.8}
          >
            <Ionicons name="image" size={32} color={Colors.text.inverse} />
            <Text style={styles.primaryButtonText}>从相册选择</Text>
          </TouchableOpacity>
        </View>

        {/* 最近记录预览 */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>最近记录</Text>
            <TouchableOpacity onPress={handleSeeAllPress}>
              <Text style={styles.seeAllText}>查看全部 →</Text>
            </TouchableOpacity>
          </View>

          {/* 占位符 */}
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              😿 还没有记录哦
            </Text>
            <Text style={styles.placeholderSubtext}>
              快来拍第一张照片吧~
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// 使用React.memo优化,仅在props变化时重渲染
export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary
  },

  // 头部
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background.primary
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // 滚动内容
  scrollContent: {
    padding: Spacing.lg
  },

  // 插图区域
  illustration: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl
  },
  illustrationEmoji: {
    fontSize: 80,
    marginBottom: Spacing.lg
  },
  illustrationText: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.sm
  },
  illustrationSubtext: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center'
  },

  // 操作按钮
  actionButtons: {
    gap: Spacing.md
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  cameraButton: {
    backgroundColor: Colors.primary
  },
  galleryButton: {
    backgroundColor: Colors.secondary
  },
  primaryButtonText: {
    ...Typography.buttonLarge,
    color: Colors.text.inverse
  },

  // 最近记录
  recentSection: {
    marginTop: Spacing.xl
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text.primary
  },
  seeAllText: {
    ...Typography.bodySmall,
    color: Colors.primary
  },
  placeholderContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxxl,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.border.light
  },
  placeholderText: {
    ...Typography.body,
    color: Colors.text.tertiary,
    marginTop: Spacing.sm
  },
  placeholderSubtext: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs
  }
});
