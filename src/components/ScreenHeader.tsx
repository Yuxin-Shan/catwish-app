// src/components/ScreenHeader.tsx
/**
 * 通用屏幕头部组件
 * 统一导航栏UI,消除代码重复
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing } from '../constants/theme';

export interface ScreenHeaderProps {
  /**
   * 标题文本
   */
  title: string;

  /**
   * 返回按钮点击事件
   * 如果不提供,则不显示返回按钮
   */
  onBack?: () => void;

  /**
   * 右侧图标名称 (Ionicons)
   * 如果不提供,则不显示右侧按钮
   */
  rightIcon?: keyof typeof Ionicons.glyphMap;

  /**
   * 右侧按钮点击事件
   */
  onRightPress?: () => void;

  /**
   * 标题颜色
   * @default Colors.text.primary
   */
  titleColor?: string;

  /**
   * 图标颜色
   * @default Colors.text.primary
   */
  iconColor?: string;

  /**
   * 背景颜色
   * @default Colors.background.primary
   */
  backgroundColor?: string;

  /**
   * 容器样式
   */
  style?: ViewStyle;

  /**
   * 测试ID (用于测试)
   */
  testID?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  rightIcon,
  onRightPress,
  titleColor = Colors.text.primary,
  iconColor = Colors.text.primary,
  backgroundColor = Colors.background.primary,
  style,
  testID
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]} testID={testID}>
      {/* 左侧: 返回按钮 */}
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          testID="back-button"
          accessibilityRole="button"
          accessibilityLabel="返回"
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={iconColor}
            testID="back-icon"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* 中间: 标题 */}
      <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
        {title}
      </Text>

      {/* 右侧: 自定义按钮 */}
      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={styles.rightButton}
          testID="right-button"
          accessibilityRole="button"
        >
          <Ionicons
            name={rightIcon}
            size={24}
            color={iconColor}
            testID="right-icon"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
    minHeight: 100,
    zIndex: 600
  },

  // 返回按钮
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },

  // 标题
  title: {
    ...Typography.bodyLarge,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.md
  },

  // 右侧按钮
  rightButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },

  // 占位符 (保持布局平衡)
  placeholder: {
    width: 44,
    height: 44
  }
});

export default ScreenHeader;
