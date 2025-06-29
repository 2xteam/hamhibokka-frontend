// src/state/authState.ts
import {atom, selector} from 'recoil';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';

export const accessTokenState = atom<string | null>({
  key: 'accessTokenState',
  default: null,
});

export const currentUserState = atom<User | null>({
  key: 'currentUserState',
  default: null,
});

export const isAuthenticatedState = selector({
  key: 'isAuthenticatedState',
  get: ({get}) => {
    const token = get(accessTokenState);
    const user = get(currentUserState);
    return !!token && !!user;
  },
});

// 토큰 관리 유틸리티
export const saveToken = async (token: string) => {
  await AsyncStorage.setItem('accessToken', token);
};

export const loadToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

export const removeToken = async () => {
  await AsyncStorage.removeItem('accessToken');
};
