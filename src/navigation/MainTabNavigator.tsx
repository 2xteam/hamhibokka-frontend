import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
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
              iconName = 'home';
              break;
            case 'Goals':
              iconName = 'flag';
              break;
            case 'Explore':
              iconName = 'search';
              break;
            case 'Profile':
              iconName = 'person';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#8E44AD',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#FFE5F0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 90,
          shadowColor: '#FF6B9D',
          shadowOffset: {width: 0, height: -2},
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}>
      <Tab.Screen name="Home" options={{tabBarLabel: '홈'}}>
        {() => <HomeScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Goals"
        component={GoalTabScreen}
        options={{tabBarLabel: '목표 관리'}}
      />

      <Tab.Screen name="Explore" options={{tabBarLabel: '탐색'}}>
        {() => <ExploreTabScreen />}
      </Tab.Screen>

      <Tab.Screen name="Profile" options={{tabBarLabel: '프로필'}}>
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
