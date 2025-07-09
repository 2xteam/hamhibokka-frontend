import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth.types';

export const STORAGE_KEYS = {
  TOKEN: '@hamhibokka_token',
  USER: '@hamhibokka_user',
} as const;

export const storage = {
  // 토큰 관련
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('Failed to save token:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  // 사용자 정보 관련
  async setUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  },

  // 인증 정보 삭제
  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    } catch (error) {
      console.error('Failed to clear auth:', error);
      throw error;
    }
  },

  // 전체 스토리지 클리어 (개발/디버깅용)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear all storage:', error);
      throw error;
    }
  },
};