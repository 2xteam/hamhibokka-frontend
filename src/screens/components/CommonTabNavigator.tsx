import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

interface CommonTabNavigatorProps {
  screens: {
    name: string;
    component: React.ComponentType<any>;
    options?: object;
  }[];
  initialRouteName?: string;
  tabBarOptions?: object;
}

const CommonTabNavigator: React.FC<CommonTabNavigatorProps> = ({
  screens,
  initialRouteName,
  tabBarOptions,
}) => (
  <Tab.Navigator
    initialRouteName={initialRouteName}
    screenOptions={tabBarOptions}>
    {screens.map(screen => (
      <Tab.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
        options={screen.options}
      />
    ))}
  </Tab.Navigator>
);

export default CommonTabNavigator;
