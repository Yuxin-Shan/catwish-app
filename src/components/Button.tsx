// src/components/Button.tsx
/**
 * 通用按钮组件 (带防抖功能)
 */

import React, { useState, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  fullWidth?: boolean;
  debounce?: boolean; // 是否启用防抖
  debounceMs?: number; // 防抖延迟(毫秒)
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading: externalLoading = false,
  icon,
  fullWidth = false,
  debounce = false,
  debounceMs = 500
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [lastPress, setLastPress] = useState(0);

  const handlePress = useCallback(async () => {
    // 如果禁用或加载中,直接返回
    if (disabled || externalLoading || internalLoading) {
      return;
    }

    // 防抖逻辑
    if (debounce) {
      const now = Date.now();
      if (now - lastPress < debounceMs) {
        return;
      }
      setLastPress(now);
    }

    // 如果是异步操作,显示loading
    try {
      setInternalLoading(true);
      await onPress();
    } catch (error) {
      console.error('Button press error:', error);
    } finally {
      setInternalLoading(false);
    }
  }, [disabled, externalLoading, internalLoading, debounce, debounceMs, lastPress, onPress]);

  const isLoading = externalLoading || internalLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        (disabled || isLoading) && styles.disabled
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'text' ? Colors.primary : Colors.text.inverse} />
      ) : (
        <>
          {icon && <Text style={[styles.icon, (variant === 'outline' || variant === 'text') && styles.iconColored]}>{icon}</Text>}
          <Text
            style={[
              styles.text,
              styles[`${variant}Text`],
              styles[`${size}Text`]
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  // 变体
  primary: {
    backgroundColor: Colors.primary
  },
  secondary: {
    backgroundColor: Colors.secondary
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary
  },
  text: {
    backgroundColor: 'transparent'
  },

  // 尺寸
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm
  },
  medium: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md
  },
  large: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg
  },

  // 全宽
  fullWidth: {
    width: '100%'
  },

  // 禁用状态
  disabled: {
    opacity: 0.5
  },

  // 文字
  text: {
    ...Typography.button,
    color: Colors.text.inverse,
    fontWeight: '600'
  },
  primaryText: {
    color: Colors.text.inverse
  },
  secondaryText: {
    color: Colors.text.inverse
  },
  outlineText: {
    color: Colors.primary
  },
  textText: {
    color: Colors.primary
  },
  smallText: {
    ...Typography.buttonSmall
  },
  largeText: {
    ...Typography.buttonLarge
  },

  // 图标
  icon: {
    fontSize: 18,
    marginRight: Spacing.xs,
    color: Colors.text.inverse
  },
  iconColored: {
    color: Colors.primary
  }
});
