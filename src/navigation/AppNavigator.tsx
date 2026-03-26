// src/navigation/AppNavigator.tsx
/**
 * 应用主导航器
 * 使用React Navigation 6
 */

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ResultScreen from '../screens/ResultScreen';
import MemeEditorScreen from '../screens/MemeEditorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Types
import { RootStackParamList, MainTabParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * 主Tab导航 (底部导航栏)
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFB6C1',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        tabBarLabelStyle: {
          fontSize: 12
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color }) => (
            <TabIcon name="home" color={color} />
          )
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: '历史',
          tabBarIcon: ({ color }) => (
            <TabIcon name="history" color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => (
            <TabIcon name="profile" color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Tab图标组件
 */
function TabIcon({ name, color }: { name: string; color: string }) {
  // TODO: 使用真实的图标库 (react-native-vector-icons)
  // 暂时用Emoji替代
  const icons: Record<string, string> = {
    home: '🏠',
    history: '📋',
    profile: '👤'
  };

  return <Text style={{ color, fontSize: 24 }}>{icons[name] || '•'}</Text>;
}

/**
 * 栈导航 (全屏页面)
 */
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFF5F7' },
          animation: 'fade'
        }}
      >
        {/* 底部Tab页面 */}
        <Stack.Screen name="MainTabs" component={MainTabs} />

        {/* 全屏页面 - 首页触发 */}
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false
          }}
        />

        <Stack.Screen
          name="Analysis"
          component={AnalysisScreen}
          options={{
            presentation: 'card',
            gestureEnabled: false
          }}
        />

        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            presentation: 'card'
          }}
        />

        <Stack.Screen
          name="MemeEditor"
          component={MemeEditorScreen}
          options={{
            presentation: 'modal',
            gestureEnabled: true
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
