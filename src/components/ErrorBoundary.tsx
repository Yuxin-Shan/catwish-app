// src/components/ErrorBoundary.tsx
/**
 * 错误边界组件
 * 捕获子组件的JavaScript错误,显示友好的错误界面
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Spacing } from '../constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新state使下一次渲染能够显示降级后的UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // 可以将错误日志上报给服务器
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.emoji}>😿</Text>
            <Text style={styles.title}>哎呀,出错了</Text>
            <Text style={styles.message}>
              {this.state.error?.message || '应用遇到了一些问题'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>重新加载</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    padding: Spacing.xxl,
    alignItems: 'center'
  },
  emoji: {
    fontSize: 64,
    marginBottom: Spacing.lg
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.md
  },
  message: {
    ...Typography.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.xl
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: 12
  },
  buttonText: {
    ...Typography.button,
    color: Colors.text.inverse
  }
});
