import {useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Loading} from '../components/common';
import {GET_MY_PARTICIPATED_GOALS} from '../queries/goal';
import FloatingAddGoalButton from './components/FloatingAddGoalButton';
import GoalList, {Goal} from './components/GoalList';

const ParticipatedGoalsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState<string | null>(null);
  const {data, loading, error, refetch} = useQuery(GET_MY_PARTICIPATED_GOALS, {
    fetchPolicy: 'network-only', // 캐시 무시하고 항상 네트워크에서 새로 가져오기
  });

  // 화면에 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('@hamhibokka_user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.userId);
        }
      } catch (e) {
        console.log('Failed to get user data');
      }
    };
    getUserId();
  }, []);

  const goals: Goal[] = data?.getMyParticipatedGoals || [];

  if (loading) {
    return (
      <Loading
        variant="fullscreen"
        message="참여한 목표를 불러오는 중이에요!"
      />
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>참여한 목표를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoalList
        goals={goals}
        userId={userId || undefined}
        onPressGoal={(goal: Goal) =>
          navigation.navigate('GoalDetail', {id: goal.id})
        }
        contentContainerStyle={styles.listContainer}
        emptyText="참여한 목표가 없습니다."
        emptyType="participated"
      />
      <FloatingAddGoalButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // 연한 회색 배경으로 구분
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  listContainer: {
    paddingBottom: 40,
  },
});

export default ParticipatedGoalsScreen;
