/**
 * 猫语心愿 - 主入口文件
 * Expo版本
 */

import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AppProvider>
    </ErrorBoundary>
  );
}
