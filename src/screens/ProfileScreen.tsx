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
  TouchableOpacity
} from 'react-native';

import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🐱</Text>
        </View>
        <Text style={styles.nickname}>猫语心愿</Text>
        <Text style={styles.bio}>让每只猫咪都被理解</Text>
      </View>

      {/* 菜单列表 */}
      <ScrollView style={styles.menu}>
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
