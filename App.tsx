import {ApolloProvider} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import Reactotron from 'reactotron-react-native';
import CustomBackButton from './src/components/CustomBackButton';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import AuthScreen from './src/screens/AuthScreen';
import CreateGoalScreen from './src/screens/CreateGoalScreen';
import GoalDetailScreen from './src/screens/GoalDetailScreen';
import InvitationDetailScreen from './src/screens/InvitationDetailScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import apolloClient from './src/services/apollo-client';
import {colors} from './src/styles/colors';

if (__DEV__) {
  import('./ReactotronConfig').then(() =>
    Reactotron.log('Reactotron Configured'),
  );
}

const Stack = createStackNavigator();

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

// 공통 헤더 스타일 정의
const commonHeaderStyle = {
  backgroundColor: colors.primary,
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0,
  height: 120,
};

const commonHeaderTitleStyle = {
  fontWeight: 'bold' as const,
  fontSize: 24,
  color: colors.white,
};

// 헤더가 있는 화면을 위한 공통 옵션 생성 함수
const createHeaderOptions =
  (title: string) =>
  ({navigation}: any) => ({
    headerShown: true,
    title,
    headerStyle: commonHeaderStyle,
    headerTintColor: colors.white,
    headerTitleStyle: commonHeaderTitleStyle,
    headerLeft: () => <CustomBackButton onPress={() => navigation.goBack()} />,
  });

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // AsyncStorage에서 토큰과 사용자 정보 확인
      const token = await AsyncStorage.getItem('@hamhibokka_token');
      const userData = await AsyncStorage.getItem('@hamhibokka_user');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);

        // TODO: 토큰 유효성 검증 API 호출
        // const isValidToken = await validateToken(token);
        // if (!isValidToken) {
        //   await logout();
        //   return;
        // }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['@hamhibokka_token', '@hamhibokka_user']);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAuthSuccess = async (token: string, userData: User) => {
    try {
      await AsyncStorage.setItem('@hamhibokka_token', token);
      await AsyncStorage.setItem('@hamhibokka_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to save auth data:', error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            headerStyle: commonHeaderStyle,
            headerTintColor: colors.white,
            headerTitleStyle: commonHeaderTitleStyle,
          }}>
          {isAuthenticated ? (
            <>
              <Stack.Screen name="Main">
                {() => <MainTabNavigator user={user} onLogout={logout} />}
              </Stack.Screen>
              <Stack.Screen
                name="CreateGoal"
                component={CreateGoalScreen}
                options={createHeaderOptions('✨ 새 목표 만들기')}
              />
              <Stack.Screen
                name="GoalDetail"
                component={GoalDetailScreen}
                options={createHeaderOptions('🥇 목표 상세')}
              />
              <Stack.Screen
                name="InvitationDetail"
                component={InvitationDetailScreen}
                options={createHeaderOptions('📨 목표 요청 상세')}
              />
              <Stack.Screen
                name="UserProfile"
                component={UserProfileScreen}
                options={createHeaderOptions('🤖 프로필')}
              />
            </>
          ) : (
            <Stack.Screen name="Auth">
              {() => <AuthScreen onAuthSuccess={handleAuthSuccess} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
