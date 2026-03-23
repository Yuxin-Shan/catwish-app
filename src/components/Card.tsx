// src/components/Card.tsx
/**
 * 通用卡片组件
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadow, Spacing } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'primary';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  padding = 'lg',
  onPress
}) => {
  const cardStyle = [
    styles.card,
    styles[variant],
    styles[`${padding}Padding`],
    onPress && styles.pressable,
    style
  ];

  if (onPress) {
    return (
      <View style={cardStyle}>
        {children}
      </View>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg
  },
  default: {},
  elevated: {
    ...Shadow.md
  },
  outlined: {
    borderWidth: 1,
    borderColor: Colors.border.light
  },
  primary: {
    backgroundColor: Colors.primary
  },

  // 内边距
  nonePadding: {
    padding: 0
  },
  smPadding: {
    padding: Spacing.sm
  },
  mdPadding: {
    padding: Spacing.md
  },
  lgPadding: {
    padding: Spacing.lg
  },

  // 可点击
  pressable: {
    // 可以添加点击效果
  }
});
