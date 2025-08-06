import {useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FloatingAddGoalButton from '../../components/FloatingAddGoalButton';
import GoalList, {Goal} from '../../components/GoalList';
import {GET_GOALS} from '../../queries/goal';

const GoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [userId, setUserId] = useState<string | null>(null);
  const {data, loading, error, refetch} = useQuery(GET_GOALS, {
    fetchPolicy: 'network-only', // 캐시 무시하고 항상 네트워크에서 새로 가져오기
  });

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
        userId={userId || undefined}
        onPressGoal={(goal: Goal) =>
          navigation.navigate('GoalDetail', {id: goal.id})
        }
        contentContainerStyle={styles.listContainer}
        emptyText="아직 등록된 목표가 없습니다."
        emptyType="goals"
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
  title: {
    fontSize: 26, // 24에서 26으로 증가
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
    fontSize: 20, // 18에서 20으로 증가
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  goalDesc: {
    fontSize: 16, // 14에서 16으로 증가
    color: '#7F8C8D',
    marginBottom: 8,
  },
  stickerCount: {
    fontSize: 14, // 13에서 14로 증가
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
