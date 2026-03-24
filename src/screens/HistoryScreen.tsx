// src/screens/HistoryScreen.tsx
/**
 * 历史记录页面
 * 显示所有分析记录,支持搜索和筛选
 * 完整实现: 集成storageService
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../constants/theme';
import { storageService, AnalysisRecord } from '../services/storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type HistoryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: HistoryScreenNavigationProp;
}

type TimeFilter = 'all' | 'today' | 'week' | 'month';

export default function HistoryScreen({ navigation }: Props) {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AnalysisRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [loading, setLoading] = useState(true);

  // 加载历史记录
  useEffect(() => {
    loadRecords();
  }, []);

  // 搜索和筛选
  useEffect(() => {
    filterRecords();
  }, [records, searchKeyword, timeFilter]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await storageService.getAnalyses();
      setRecords(data);
    } catch (error) {
      console.error('加载历史记录失败:', error);
      Alert.alert('加载失败', '无法加载历史记录');
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];

    // 时间筛选
    if (timeFilter !== 'all') {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;

      filtered = filtered.filter(record => {
        const diff = now - record.timestamp;
        switch (timeFilter) {
          case 'today':
            return diff < dayMs;
          case 'week':
            return diff < 7 * dayMs;
          case 'month':
            return diff < 30 * dayMs;
          default:
            return true;
        }
      });
    }

    // 关键词搜索
    if (searchKeyword.trim()) {
      filtered = filtered.filter(record =>
        record.result.emotion.includes(searchKeyword) ||
        record.result.catSays.includes(searchKeyword) ||
        record.result.behaviorAnalysis.includes(searchKeyword)
      );
    }

    setFilteredRecords(filtered);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      '删除记录',
      '确定要删除这条记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await storageService.deleteAnalysis(id);
              await loadRecords();
            } catch (error) {
              console.error('删除失败:', error);
              Alert.alert('删除失败', '无法删除记录');
            }
          }
        }
      ]
    );
  };

  const handleRecordPress = (record: AnalysisRecord) => {
    navigation.navigate('Result' as any, {
      imageUri: record.imageUri,
      analysisResult: record.result
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));

    if (days === 0) {
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <Text style={styles.title}>历史记录</Text>
        <Text style={styles.subtitle}>共 {filteredRecords.length} 条记录</Text>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索情绪、关键词..."
          placeholderTextColor={Colors.text.tertiary}
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
      </View>

      {/* 时间筛选标签 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, timeFilter === 'all' && styles.active]}
          onPress={() => setTimeFilter('all')}
        >
          <Text style={[styles.filterText, timeFilter === 'all' && styles.activeText]}>全部</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, timeFilter === 'today' && styles.active]}
          onPress={() => setTimeFilter('today')}
        >
          <Text style={[styles.filterText, timeFilter === 'today' && styles.activeText]}>今天</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, timeFilter === 'week' && styles.active]}
          onPress={() => setTimeFilter('week')}
        >
          <Text style={[styles.filterText, timeFilter === 'week' && styles.activeText]}>本周</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, timeFilter === 'month' && styles.active]}
          onPress={() => setTimeFilter('month')}
        >
          <Text style={[styles.filterText, timeFilter === 'month' && styles.activeText]}>本月</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 记录列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : filteredRecords.length === 0 ? (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyText}>还没有记录哦</Text>
            <Text style={styles.emptySubtext}>快去拍第一张照片吧~</Text>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
          {filteredRecords.map(record => (
            <TouchableOpacity
              key={record.id}
              style={styles.recordCard}
              onPress={() => handleRecordPress(record)}
              onLongPress={() => handleDelete(record.id)}
            >
              <View style={styles.recordHeader}>
                <Text style={styles.recordEmotion}>{record.result.emotion}</Text>
                <Text style={styles.recordDate}>{formatDate(record.timestamp)}</Text>
              </View>
              <Text style={styles.recordText} numberOfLines={2}>
                {record.result.catSays}
              </Text>
              <View style={styles.recordFooter}>
                <Text style={styles.recordHint}>长按删除</Text>
                {!record.synced && (
                  <View style={styles.unsyncBadge}>
                    <Text style={styles.unsyncText}>未同步</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary
  },
  header: {
    padding: Spacing.lg,
    paddingTop: 60,
    backgroundColor: Colors.background.primary
  },
  title: {
    ...Typography.h2,
    color: Colors.text.primary
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs
  },
  searchContainer: {
    padding: Spacing.lg,
    paddingTop: 0
  },
  searchInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light
  },
  filterScroll: {
    marginBottom: Spacing.sm
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.full
  },
  active: {
    backgroundColor: Colors.primary
  },
  filterText: {
    ...Typography.bodySmall,
    color: Colors.text.secondary
  },
  activeText: {
    color: Colors.text.inverse,
    fontWeight: '600'
  },
  list: {
    flex: 1
  },
  listContent: {
    padding: Spacing.lg,
    gap: Spacing.md
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    ...Typography.body,
    color: Colors.text.tertiary
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl * 2
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.lg
  },
  emptyText: {
    ...Typography.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary
  },
  recordCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadow.sm
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm
  },
  recordEmotion: {
    ...Typography.h3,
    color: Colors.text.primary
  },
  recordDate: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary
  },
  recordText: {
    ...Typography.body,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.sm
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  recordHint: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary
  },
  unsyncBadge: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm
  },
  unsyncText: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    fontSize: 12
  }
});
