import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../../styles/colors';

const FloatingAddGoalButton: React.FC = () => {
  const navigation = useNavigation<any>();
  const handleAddGoal = () => {
    navigation.navigate('CreateGoal');
  };
  return (
    <TouchableOpacity style={styles.fab} onPress={handleAddGoal}>
      <MaterialIcons name="add" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.components.fab.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.components.fab.shadow,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.components.fab.border,
  },
});

export default FloatingAddGoalButton;
