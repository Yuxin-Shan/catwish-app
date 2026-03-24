// src/screens/AnalysisScreen.tsx
/**
 * AI分析页面 - 完整实现
 * 显示加载动画,调用AI服务
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Colors, Typography, Spacing } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { aiService } from '../services/ai/AIService';

type AnalysisScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Analysis'>;

interface Props {
  navigation: AnalysisScreenNavigationProp;
  route: {
    params: {
      imageUri: string;
    };
  };
}

export default function AnalysisScreen({ navigation, route }: Props) {
  const { imageUri } = route.params;

  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 启动进入动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true
      })
    ]).start();

    // 模拟AI分析过程
    const runAnalysis = async () => {
      try {
        // 调用AI服务 (使用Mock,无需API Key)
        const result = await aiService.analyzeImage(imageUri);

        // 分析完成,跳转到结果页
        setTimeout(() => {
          navigation.replace('Result', {
            imageUri,
            analysisResult: result
          });
        }, 500);

      } catch (error) {
        console.error('AI分析失败:', error);

        // 显示错误提示
        Alert.alert(
          '分析失败',
          '无法分析猫咪图片,请重试',
          [
            { text: '重试', onPress: () => navigation.goBack() },
            { text: '返回', style: 'cancel' }
          ]
        );
      }
    };

    runAnalysis();
  }, [imageUri, navigation]);

  return (
    <View style={styles.container}>
      {/* 动画内容 */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* 猫咪图标动画 */}
        <View style={styles.catContainer}>
          <Ionicons name="paw-outline" size={80} color={Colors.primary} />

          {/* 思考动画 */}
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.loader}
          />

          <Text style={styles.thinkingText}>本喵正在思考中...</Text>
        </View>

        {/* 分析步骤提示 */}
        <View style={styles.stepsContainer}>
          <AnalysisStep step={1} text="正在识别猫咪表情..." />
          <AnalysisStep step={2} text="正在分析情绪状态..." />
          <AnalysisStep step={3} text="正在生成可爱文案..." />
        </View>

        {/* 提示信息 */}
        <View style={styles.tipContainer}>
          <Text style={styles.tip}>这可能需要2-3秒钟</Text>
          <Text style={styles.tip}>请耐心等待哦~</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// 分析步骤组件
interface AnalysisStepProps {
  step: number;
  text: string;
}

function AnalysisStep({ step, text }: AnalysisStepProps) {
  const [visible, setVisible] = React.useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer1 = setTimeout(() => setVisible(true), step * 500);
    const timer2 = setTimeout(() => {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }, step * 500 + 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [step, opacityAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.step, { opacity: opacityAnim }]}>
      <View style={[styles.stepDot, { backgroundColor: Colors.primary }]} />
      <Text style={styles.stepText}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center'
  },

  content: {
    alignItems: 'center',
    width: '100%'
  },

  // 猫咪容器
  catContainer: {
    marginBottom: Spacing.xxxl
  },
  catEmoji: {
    fontSize: 100,
    marginBottom: Spacing.lg
  },
  loader: {
    marginTop: Spacing.md
  },
  thinkingText: {
    ...Typography.h3,
    color: Colors.text.primary,
    marginTop: Spacing.lg
  },

  // 分析步骤
  stepsContainer: {
    alignItems: 'flex-start',
    width: '80%',
    marginTop: Spacing.xl
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm
  },
  stepText: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm
  },

  // 提示
  tipContainer: {
    marginTop: Spacing.xxxl,
    alignItems: 'center'
  },
  tip: {
    ...Typography.body,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.xs
  }
});
