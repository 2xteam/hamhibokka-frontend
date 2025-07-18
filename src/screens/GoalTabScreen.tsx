import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../styles/colors';
import CommonTabNavigator from './components/CommonTabNavigator';
import GoalScreen from './GoalScreen';
import ParticipatedGoalsScreen from './ParticipatedGoalsScreen';

const Tab = createMaterialTopTabNavigator();

const screens = [
  {
    name: 'Goals',
    component: GoalScreen,
    options: {tabBarLabel: '나의 목표'},
  },
  {
    name: 'MyParticipated',
    component: ParticipatedGoalsScreen,
    options: {tabBarLabel: '참여한 목표'},
  },
];

const tabBarOptions = {
  tabBarLabelStyle: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'none',
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.white,
    height: 3,
    borderRadius: 2,
  },
  tabBarActiveTintColor: colors.white,
  tabBarInactiveTintColor: colors.primaryLight,
  tabBarStyle: {
    backgroundColor: colors.primary,
    elevation: 0,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryLight,
  },
  tabBarItemStyle: {
    paddingVertical: 12,
  },
};

const GoalTabScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 상단 색상 영역 */}
      <View style={styles.topColorArea} />

      <View style={styles.tabContainer}>
        <CommonTabNavigator
          screens={screens}
          initialRouteName="Goals"
          tabBarOptions={tabBarOptions}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topColorArea: {
    height: 44,
    backgroundColor: colors.primary,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: colors.background,
    zIndex: 1,
  },
});

export default GoalTabScreen;
