import React, {useState} from 'react';
import {Dimensions, View, ViewStyle} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {colors} from '../styles/colors';

export interface TabRoute {
  key: string;
  title: string;
}

interface CommonTabViewProps {
  routes: TabRoute[];
  scenes: {[key: string]: React.ComponentType<any>};
  initialIndex?: number;
  tabBarStyle?: ViewStyle;
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
  tabBarIndicatorStyle,
  tabBarActiveTintColor = colors.components.tabView.active,
  tabBarInactiveTintColor = colors.components.tabView.inactive,
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
              tabBarIndicatorStyle || {
                backgroundColor: colors.components.tabView.indicator,
              }
            }
            style={[
              {backgroundColor: '#fff', height: 48, elevation: 2, zIndex: 10},
              tabBarStyle,
            ]}
            activeColor={tabBarActiveTintColor}
            inactiveColor={tabBarInactiveTintColor}
          />
        )}
      />
    </View>
  );
};

export default CommonTabView;
