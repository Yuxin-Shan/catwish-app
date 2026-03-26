import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: AuthUser;
}

const SESSION_KEY = '@catwish:auth_session';

export const authSessionStorage = {
  async get(): Promise<AuthSession | null> {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  },

  async set(session: AuthSession): Promise<void> {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  },
};
