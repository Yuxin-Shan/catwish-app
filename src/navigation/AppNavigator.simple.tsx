// 简化版Navigator - 逐步测试Screen
import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 简单测试首页
function SimpleHomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 猫语心愿</Text>
      <Text style={styles.subtitle}>让猫咪"开口说话"</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log('相机按钮')}
      >
        <Text style={styles.cardTitle}>📷 拍照解读</Text>
        <Text style={styles.cardDesc}>AI识别猫咪情绪</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log('相册按钮')}
      >
        <Text style={styles.cardTitle}>🖼️ 从相册选择</Text>
        <Text style={styles.cardDesc}>选择猫咪照片</Text>
      </TouchableOpacity>
    </View>
  );
}

// 简单历史页
function SimpleHistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 历史记录</Text>
      <Text style={styles.subtitle}>暂无记录</Text>
    </View>
  );
}

// 简单个人页
function SimpleProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 我的</Text>
      <Text style={styles.subtitle}>个人中心</Text>
    </View>
  );
}

// Tab导航
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
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={SimpleHomeScreen}
        options={{ tabBarLabel: '首页' }}
      />
      <Tab.Screen
        name="History"
        component={SimpleHistoryScreen}
        options={{ tabBarLabel: '历史' }}
      />
      <Tab.Screen
        name="Profile"
        component={SimpleProfileScreen}
        options={{ tabBarLabel: '我的' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFB6C1',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#999',
  },
});
