import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import GoalScreen from './GoalScreen';
import InvitationListScreen from './InvitationListScreen';

const Tab = createMaterialTopTabNavigator();

const GoalTabScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.tabContainer}>
        <Tab.Navigator
          initialRouteName="Goals"
          screenOptions={{
            tabBarLabelStyle: {fontSize: 15, fontWeight: 'bold'},
            tabBarIndicatorStyle: {backgroundColor: '#4A90E2'},
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: '#7F8C8D',
            tabBarStyle: {backgroundColor: '#fff', elevation: 2, zIndex: 10},
          }}>
          <Tab.Screen
            name="Goals"
            component={GoalScreen}
            options={{tabBarLabel: '나의 목표'}}
          />
          <Tab.Screen
            name="Invitations"
            component={InvitationListScreen}
            options={{tabBarLabel: '요청 & 초대'}}
          />
        </Tab.Navigator>
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
    marginTop: 8, // 헤더와 겹치지 않게 약간의 여백
    backgroundColor: '#F8F9FA',
    zIndex: 1,
  },
});

export default GoalTabScreen;
