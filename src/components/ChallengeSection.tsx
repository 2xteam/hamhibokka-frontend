import {useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {GET_FOLLOWED_USERS_GOALS} from '../queries/goal';
import {colors} from '../styles/colors';
import GoalCard from './GoalCard';

interface Goal {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  stickerCount: number;
  mode?: string;
  visibility?: string;
  status?: string;
  createdBy?: string;
  autoApprove?: boolean;
  createdAt?: string;
  updatedAt?: string;
  participants?: any[];
}

interface ChallengeSectionProps {
  navigation: any;
}

const ChallengeSection: React.FC<ChallengeSectionProps> = ({navigation}) => {
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@hamhibokka_user');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUserId(user.userId);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  const {
    data: followedGoalsData,
    loading,
    refetch: refetchFollowedGoals,
  } = useQuery(GET_FOLLOWED_USERS_GOALS, {
    fetchPolicy: 'cache-and-network',
  });

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetchFollowedGoals();
    }, [refetchFollowedGoals]),
  );

  const followedGoals = followedGoalsData?.getFollowedUsersGoals || [];

  // 챌린저 모드의 목표만 필터링하고, 로그인 사용자가 참여하지 않은 목표만 표시
  const challengeGoals = followedGoals
    .filter((goal: Goal) => goal.mode === 'challenger_recruitment')
    .filter((goal: Goal) => {
      // 로그인 사용자가 참여하지 않은 목표만 필터링
      if (!currentUserId || !goal.participants) return true;
      return !goal.participants.some(
        (participant: any) => participant.userId === currentUserId,
      );
    })
    .slice(0, 2); // 최대 2개만 표시

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {id: goal.id});
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 참여 가능한 목표</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>챌린저를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (challengeGoals.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 참여 가능한 목표</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            아직 참여할 수 있는 챌린저가 없어요! 🥺
          </Text>
          <Text style={styles.emptySubtext}>
            새로운 챌린저가 등장하면 알려드릴게요!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>🏆 참여 가능한 목표</Text>
      {challengeGoals.map((goal: Goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onPress={handleGoalPress}
          showParticipantCount={true}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  emptyText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.medium,
    textAlign: 'center',
  },
});

export default ChallengeSection;
