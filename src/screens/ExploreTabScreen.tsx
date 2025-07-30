import React, {useEffect} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {colors} from '../styles/colors';
import CommonTabNavigator from './components/CommonTabNavigator';
import FriendSearchScreen from './FriendSearchScreen';
import GoalSearchScreen from './GoalSearchScreen';

const screens = [
  {
    name: 'FriendSearch',
    component: FriendSearchScreen,
    options: {tabBarLabel: '친구 찾기'},
  },
  {
    name: 'GoalSearch',
    component: GoalSearchScreen,
    options: {tabBarLabel: '목표 찾기'},
  },
];

const tabBarOptions = {
  tabBarLabelStyle: {
    fontSize: 24, // 22에서 24로 증가
    fontWeight: 'bold',
    textShadowColor: colors.primaryDark,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.white,
    height: 4,
    borderRadius: 2,
  },
  tabBarActiveTintColor: colors.white,
  tabBarInactiveTintColor: colors.light,
  tabBarStyle: {
    backgroundColor: colors.primary,
    elevation: 0,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryLight,
    marginTop: -10,
  },
  tabBarItemStyle: {
    paddingVertical: 14, // 12에서 16으로 증가
  },
};

const ExploreTabScreen: React.FC = () => {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primary);
      StatusBar.setTranslucent(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* SafeArea 위쪽 영역을 같은 색상으로 덮기 */}
      <View style={styles.statusBarArea} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.tabContainer}>
          <CommonTabNavigator
            screens={screens}
            initialRouteName="FriendSearch"
            tabBarOptions={tabBarOptions}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBarArea: {
    height: 62, // SafeAreaView의 상단 여백을 채우기 위한 높이
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
});

export default ExploreTabScreen;
