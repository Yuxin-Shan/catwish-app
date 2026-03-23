// src/components/Skeleton.tsx
/**
 * 骨架屏加载组件
 * 用于内容加载时的占位显示
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  style
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width, height },
        style
      ]}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Skeleton height={20} width="60%" style={styles.cardTitle} />
        <Skeleton height={14} style={styles.cardText} />
        <Skeleton height={14} width="80%" style={styles.cardText} />
      </View>
    </View>
  );
};

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4
  },
  cardContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row'
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: '#E0E0E0'
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.md
  },
  cardTitle: {
    marginBottom: Spacing.sm
  },
  cardText: {
    marginBottom: Spacing.xs
  }
});
