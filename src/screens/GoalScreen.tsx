import {useQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {GET_GOALS} from '../queries/goal';
import FloatingAddGoalButton from './components/FloatingAddGoalButton';
import GoalList, {Goal} from './components/GoalList';

const GoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {data, loading, error, refetch} = useQuery(GET_GOALS, {
    fetchPolicy: 'network-only', // 캐시 무시하고 항상 네트워크에서 새로 가져오기
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const goals = data?.getGoals || [];

  return (
    <View style={styles.container}>
      <GoalList
        goals={goals}
        onPressGoal={(goal: Goal) =>
          navigation.navigate('GoalDetail', {id: goal.id})
        }
        contentContainerStyle={styles.listContainer}
        emptyText="아직 등록된 목표가 없습니다."
      />
      <FloatingAddGoalButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 24,
    alignSelf: 'center',
  },
  listContainer: {
    paddingBottom: 40,
  },
  goalItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  goalDesc: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  stickerCount: {
    fontSize: 13,
    color: '#F39C12',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default GoalScreen;
