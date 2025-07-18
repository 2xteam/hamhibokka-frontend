import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TAB_LABELS} from '../constants';
import ExploreTabScreen from '../screens/ExploreTabScreen';
import GoalTabScreen from '../screens/GoalTabScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface MainTabNavigatorProps {
  user: User | null;
  onLogout: () => void;
}

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({
  user,
  onLogout,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName = '';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Goals':
              iconName = focused ? 'flag' : 'flag-outline';
              break;
            case 'Explore':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return (
            <Icon name={iconName} size={focused ? 28 : 24} color={color} />
          );
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#FFB3D1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingBottom: 12,
          paddingTop: 12,
          height: 100,
          shadowColor: '#FF6B9D',
          shadowOffset: {width: 0, height: -4},
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 12,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" options={{tabBarLabel: TAB_LABELS.HOME}}>
        {() => <HomeScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Goals"
        component={GoalTabScreen}
        options={{tabBarLabel: TAB_LABELS.GOALS}}
      />

      <Tab.Screen name="Explore" options={{tabBarLabel: TAB_LABELS.EXPLORE}}>
        {() => <ExploreTabScreen />}
      </Tab.Screen>

      <Tab.Screen name="Profile" options={{tabBarLabel: TAB_LABELS.PROFILE}}>
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
