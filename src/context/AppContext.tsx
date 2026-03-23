// src/context/AppContext.tsx
/**
 * 全局应用上下文
 * 提供Toast、Loading、User等全局状态
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '../components/Toast';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface AppContextType {
  // Toast
  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  hideToast: () => void;
  toast: ToastMessage | null;

  // Loading
  setLoading: (loading: boolean) => void;
  loading: boolean;

  // User
  setUser: (user: any) => void;
  user: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', duration = 3000) => {
      const id = Date.now().toString();
      setToast({ id, message, type, duration });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const handleDismiss = useCallback(() => {
    hideToast();
  }, [hideToast]);

  return (
    <AppContext.Provider
      value={{
        showToast,
        hideToast,
        toast,
        setLoading,
        loading,
        setUser,
        user
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          visible={!!toast}
          onDismiss={handleDismiss}
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
