import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import CommonTabNavigator from './components/CommonTabNavigator';
import GoalScreen from './GoalScreen';
import ParticipatedGoalsScreen from './ParticipatedGoalsScreen';

const Tab = createMaterialTopTabNavigator();

const screens = [
  {
    name: 'Goals',
    component: GoalScreen,
    options: {tabBarLabel: '목표'},
  },
  {
    name: 'MyParticipated',
    component: ParticipatedGoalsScreen,
    options: {tabBarLabel: '참여한 목표'},
  },
];

const tabBarOptions = {
  tabBarLabelStyle: {fontSize: 15, fontWeight: 'bold'},
  tabBarIndicatorStyle: {backgroundColor: '#FF6B9D'},
  tabBarActiveTintColor: '#FF6B9D',
  tabBarInactiveTintColor: '#7F8C8D',
  tabBarStyle: {backgroundColor: '#fff', elevation: 2, zIndex: 10},
};

const GoalTabScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        <CommonTabNavigator
          screens={screens}
          initialRouteName="Goals"
          tabBarOptions={tabBarOptions}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 44,
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  tabContainer: {
    flex: 1,
    // marginTop: 8, // 헤더와 겹치지 않게 약간의 여백
    backgroundColor: '#F8F9FA',
    zIndex: 1,
  },
});

export default GoalTabScreen;
