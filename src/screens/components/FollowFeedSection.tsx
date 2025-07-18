import {useQuery} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GET_MY_PARTICIPATED_GOALS} from '../../queries/goal';
import {colors} from '../../styles/colors';
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
  creatorNickname?: string;
  autoApprove?: boolean;
  createdAt?: string;
  updatedAt?: string;
  participants?: any[];
}

interface FollowFeedSectionProps {
  navigation: any;
}

const FollowFeedSection: React.FC<FollowFeedSectionProps> = ({navigation}) => {
  const {
    data: participatedGoalsData,
    loading,
    refetch: refetchParticipatedGoals,
  } = useQuery(GET_MY_PARTICIPATED_GOALS, {
    fetchPolicy: 'cache-and-network',
  });

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetchParticipatedGoals();
    }, [refetchParticipatedGoals]),
  );

  const participatedGoals = participatedGoalsData?.getMyParticipatedGoals || [];

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {id: goal.id});
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👬 팔로우한 목표</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>참여한 목표를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  if (participatedGoals.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👬 팔로우한 목표</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 참여한 목표가 없어요! 🥺</Text>
          <Text style={styles.emptySubtext}>
            목표에 참여하고 함께 달성해보세요!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>👬 팔로우한 목표</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Goals', {screen: 'MyParticipated'})
          }>
          <Text style={styles.seeAllText}>전체보기</Text>
        </TouchableOpacity>
      </View>
      {participatedGoals.slice(0, 3).map((goal: Goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onPress={handleGoalPress}
          showProgress={true}
          showParticipantCount={false}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
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

export default FollowFeedSection;
