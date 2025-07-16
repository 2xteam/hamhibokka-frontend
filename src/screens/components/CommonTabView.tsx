import React, {ReactNode, useState} from 'react';
import {Dimensions, Text, TextStyle, View, ViewStyle} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';

export interface TabRoute {
  key: string;
  title: string;
}

interface CommonTabViewProps {
  routes: TabRoute[];
  scenes: {[key: string]: React.ComponentType<any> | (() => ReactNode)};
  initialIndex?: number;
  tabBarStyle?: ViewStyle;
  tabBarLabelStyle?: TextStyle;
  tabBarIndicatorStyle?: ViewStyle;
  tabBarActiveTintColor?: string;
  tabBarInactiveTintColor?: string;
}

const initialLayout = {width: Dimensions.get('window').width};

const CommonTabView: React.FC<CommonTabViewProps> = ({
  routes,
  scenes,
  initialIndex = 0,
  tabBarStyle,
  tabBarLabelStyle,
  tabBarIndicatorStyle,
  tabBarActiveTintColor = '#4A90E2',
  tabBarInactiveTintColor = '#2C3E50',
}) => {
  const [index, setIndex] = useState(initialIndex);

  const renderScene = SceneMap(scenes);

  return (
    <View style={{flex: 1}}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={
              tabBarIndicatorStyle || {backgroundColor: '#4A90E2'}
            }
            style={[
              {backgroundColor: '#fff', height: 48, elevation: 2, zIndex: 10},
              tabBarStyle,
            ]}
            renderLabel={({route, focused}) => (
              <Text
                style={[
                  {fontWeight: 'bold', fontSize: 15},
                  tabBarLabelStyle,
                  {
                    color: focused
                      ? tabBarActiveTintColor
                      : tabBarInactiveTintColor,
                  },
                ]}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    </View>
  );
};

export default CommonTabView;
