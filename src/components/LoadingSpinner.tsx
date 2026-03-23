// src/components/LoadingSpinner.tsx
/**
 * 通用加载动画组件
 */

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large' | number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = Colors.primary,
  text,
  fullScreen = false
}) => {
  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (fullScreen) {
    return <View style={styles.fullScreenOverlay}>{content}</View>;
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.lg
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.text.secondary,
    marginTop: Spacing.md
  }
});
