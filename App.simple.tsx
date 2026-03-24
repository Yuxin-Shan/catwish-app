/**
 * 极简测试版 - 只测试Navigation
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 猫语心愿</Text>
      <Text style={styles.subtitle}>首页测试</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Detail')}
      >
        <Text style={styles.buttonText}>点击测试导航</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ 导航成功！</Text>
      <Text style={styles.subtitle}>这个页面能显示说明Navigation正常</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
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
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFB6C1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
