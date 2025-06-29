import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, Text} from 'react-native';

const Stack = createStackNavigator();

function GoalPlaceholderScreen() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Goal Screen</Text>
    </View>
  );
}

export function GoalStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Goal"
        component={GoalPlaceholderScreen}
        options={{title: 'Goal'}}
      />
    </Stack.Navigator>
  );
}
