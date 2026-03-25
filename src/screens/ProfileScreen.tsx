// src/screens/ProfileScreen.tsx
/**
 * 个人中心页面
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';

import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { API_CONFIG } from '../config/api';
import { useApp } from '../context/AppContext';
import { logoutWithBackend } from '../services/api/auth';

export default function ProfileScreen() {
  const { user, authReady, authSession, clearAuthSession } = useApp();

  const handleLogout = async () => {
    try {
      if (API_CONFIG.ENABLE_BACKEND_API && authSession?.refreshToken) {
        await logoutWithBackend(authSession.refreshToken);
      }

      await clearAuthSession();
      Alert.alert('已退出', '当前会话已清理');
    } catch (error) {
      Alert.alert('退出失败', error instanceof Error ? error.message : '请稍后重试');
    }
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🐱</Text>
        </View>
        <Text style={styles.nickname}>{user?.displayName || '猫语心愿'}</Text>
        <Text style={styles.bio}>
          {authReady
            ? user?.email || '让每只猫咪都被理解'
            : '正在加载会话状态...'}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {API_CONFIG.ENABLE_BACKEND_API ? 'Backend Alpha Mode' : 'Local Demo Mode'}
          </Text>
        </View>
      </View>

      {/* 菜单列表 */}
      <ScrollView style={styles.menu}>
        {user && (
          <MenuItem icon="🚪" title="退出登录" onPress={handleLogout} />
        )}
        <MenuItem icon="⚙️" title="设置" onPress={() => {}} />
        <MenuItem icon="ℹ️" title="关于" onPress={() => {}} />
        <MenuItem icon="📝" title="反馈" onPress={() => {}} />
        <MenuItem icon="🔔" title="通知" onPress={() => {}} />
        <MenuItem icon="🌟" title="去评分" onPress={() => {}} />
        <MenuItem icon="📖" title="使用指南" onPress={() => {}} />
      </ScrollView>

      {/* 版本信息 */}
      <View style={styles.footer}>
        <Text style={styles.version}>版本 0.0.1</Text>
        <Text style={styles.copyright}>© 2026 猫语心愿</Text>
      </View>
    </View>
  );
}

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

function MenuItem({ icon, title, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    backgroundColor: Colors.background.primary
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md
  },
  avatarEmoji: {
    fontSize: 40
  },
  nickname: {
    ...Typography.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs
  },
  bio: {
    ...Typography.bodySmall,
    color: Colors.text.secondary
  },
  statusBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight
  },
  statusText: {
    ...Typography.bodySmall,
    color: Colors.primary
  },
  menu: {
    backgroundColor: Colors.background.primary,
    marginTop: Spacing.sm
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Spacing.lg
  },
  menuTitle: {
    ...Typography.body,
    color: Colors.text.primary,
    flex: 1
  },
  menuArrow: {
    ...Typography.h2,
    color: Colors.text.tertiary
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.background.primary
  },
  version: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs
  },
  copyright: {
    ...Typography.bodySmall,
    color: Colors.text.tertiary
  }
});
