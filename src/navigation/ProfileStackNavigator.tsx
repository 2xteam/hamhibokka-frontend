import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// 예시로 ProfileScreen을 임시로 사용합니다. 실제 화면에 맞게 수정하세요.
import ProfileScreen from '@/screens/main/ProfileScreen';

const Stack = createStackNavigator();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Stack.Navigator>
  );
}
