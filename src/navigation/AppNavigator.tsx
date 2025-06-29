// src/navigation/AppNavigator.tsx
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useRecoilValue} from 'recoil';

import {isAuthenticatedState} from '../state/authState';
import {useAuth} from '../hooks/useAuth';
import {AuthStackNavigator} from './AuthNavigator';
import {MainTabNavigator} from './MainTabNavigator';
import LoadingScreen from '@/screens/LoadingScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const {loadStoredAuth} = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const initAuth = async () => {
      await loadStoredAuth();
      setIsLoading(false);
    };
    initAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
