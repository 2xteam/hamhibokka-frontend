import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface GoalScreenProps {
  user: User | null;
}

const GoalScreen: React.FC<GoalScreenProps> = ({ user }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>목표 관리</Text>
      <Text style={styles.subtitle}>곧 구현될 예정입니다</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 4,
  },
});

export default GoalScreen;