import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import {useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  accessTokenState,
  currentUserState,
  isAuthenticatedState,
  saveToken,
  removeToken,
} from '../state/authState';
import {LOGIN_MUTATION, REGISTER_MUTATION} from '../graphql/auth';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  const [loginMutation, {loading: loginLoading}] = useMutation(LOGIN_MUTATION);
  const [registerMutation, {loading: registerLoading}] =
    useMutation(REGISTER_MUTATION);

  const login = async (email: string, password: string) => {
    try {
      const {data} = await loginMutation({
        variables: {
          loginInput: {email, password},
        },
      });

      const {accessToken: token, user} = data.login;
      await saveToken(token);
      setAccessToken(token);
      setCurrentUser(user);

      return {success: true, user};
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {success: false, error: errorMessage};
    }
  };

  const register = async (
    email: string,
    password: string,
    nickname: string,
  ) => {
    try {
      const {data} = await registerMutation({
        variables: {
          registerInput: {email, password, nickname},
        },
      });

      const {accessToken: token, user} = data.register;
      await saveToken(token);
      setAccessToken(token);
      setCurrentUser(user);

      return {success: true, user};
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return {success: false, error: errorMessage};
    }
  };

  const logout = async () => {
    await removeToken();
    setAccessToken(null);
    setCurrentUser(null);
  };

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('accessToken');
      if (storedToken) {
        setAccessToken(storedToken);
        // 여기서 ME_QUERY를 실행하여 사용자 정보를 가져올 수 있습니다
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    }
  };

  return {
    accessToken,
    currentUser,
    isAuthenticated,
    login,
    register,
    logout,
    loadStoredAuth,
    loginLoading,
    registerLoading,
  };
};
