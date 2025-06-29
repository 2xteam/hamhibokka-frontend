// src/navigation/MainTabNavigator.tsx
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {Colors} from '../theme';
import {HomeScreen} from '../screens/home/HomeScreen';
import {GoalStackNavigator} from '../navigation/GoalStackNavigator';
import {ExploreScreen} from '../screens/explore/ExploreScreen';
import {ProfileStackNavigator} from '../navigation/ProfileStackNavigator';

const Tab = createBottomTabNavigator();

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Goals':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            case 'Explore':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.borderLight,
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{title: '홈'}} />
      <Tab.Screen
        name="Goals"
        component={GoalStackNavigator}
        options={{title: '목표'}}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{title: '탐색'}}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{title: '프로필'}}
      />
    </Tab.Navigator>
  );
};
