import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ExploreScreen from '../screens/ExploreScreen';
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
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#95A5A6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E6ED',
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
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
        {() => <ExploreScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen name="Profile" options={{tabBarLabel: '프로필'}}>
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
