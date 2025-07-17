import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
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
  tabBarLabelStyle: {fontSize: 15, fontWeight: 'bold'},
  tabBarIndicatorStyle: {backgroundColor: '#FF6B9D'},
  tabBarActiveTintColor: '#FF6B9D',
  tabBarInactiveTintColor: '#7F8C8D',
  tabBarStyle: {backgroundColor: '#fff', elevation: 2, zIndex: 10},
};

const ExploreTabScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        <CommonTabNavigator
          screens={screens}
          initialRouteName="FriendSearch"
          tabBarOptions={tabBarOptions}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    marginTop: 44,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    zIndex: 1,
    marginTop: 0,
  },
});

export default ExploreTabScreen;
