// src/components/Toast.tsx
/**
 * Toast通知组件
 * 用于显示成功、错误、警告等消息
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { Typography, Spacing, BorderRadius } from '../constants/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  visible: boolean;
  onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  visible,
  onDismiss
}) => {
  const [opacity] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(-100));

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      onDismiss?.();
    });
  }, [onDismiss, opacity, translateY]);

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();

    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, hideToast, opacity, translateY, visible]);

  if (!visible) return null;

  const getTypeConfig = () => {
    const configs = {
      success: {
        backgroundColor: '#4CAF50',
        icon: '✓'
      },
      error: {
        backgroundColor: '#F44336',
        icon: '✕'
      },
      warning: {
        backgroundColor: '#FFC107',
        icon: '⚠'
      },
      info: {
        backgroundColor: '#2196F3',
        icon: 'ℹ'
      }
    };
    return configs[type];
  };

  const config = getTypeConfig();

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.backgroundColor,
          opacity,
          transform: [{ translateY }]
        }
      ]}
    >
      <Text style={styles.icon}>{config.icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000
  },
  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
    color: '#FFF'
  },
  message: {
    ...Typography.body,
    color: '#FFF',
    flex: 1
  }
});
