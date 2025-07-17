import {useQuery} from '@apollo/client';
import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GET_GOALS} from '../../queries/goal';
import {colors} from '../../styles/colors';

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
  isParticipant?: boolean;
  participants?: any[];
}

interface MyCreatedGoalsSectionProps {
  navigation: any;
}

const MyCreatedGoalsSection: React.FC<MyCreatedGoalsSectionProps> = ({
  navigation,
}) => {
  const {data: goalsData, loading} = useQuery(GET_GOALS, {
    fetchPolicy: 'cache-and-network',
  });

  const goals = goalsData?.getGoals || [];

  // 내가 생성한 목표만 필터링
  const myGoals = goals.filter(
    (goal: Goal) => goal.createdBy === goal.createdBy,
  );

  const getGoalEmoji = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('운동') || lowerTitle.includes('스포츠'))
      return '🏃‍♂️';
    if (lowerTitle.includes('공부') || lowerTitle.includes('학습')) return '📚';
    if (lowerTitle.includes('독서') || lowerTitle.includes('책')) return '📖';
    if (lowerTitle.includes('그림') || lowerTitle.includes('미술')) return '🎨';
    if (lowerTitle.includes('음악') || lowerTitle.includes('악기')) return '🎵';
    if (lowerTitle.includes('요리') || lowerTitle.includes('음식')) return '👨‍🍳';
    if (lowerTitle.includes('청소') || lowerTitle.includes('정리')) return '🧹';
    if (lowerTitle.includes('게임')) return '🎮';
    if (lowerTitle.includes('산책') || lowerTitle.includes('걷기')) return '🚶‍♂️';
    return '🥇';
  };

  const getModeEmoji = (mode?: string) => {
    switch (mode) {
      case 'personal':
        return '💪';
      case 'group':
        return '👬';
      case 'competition':
        return '🏆';
      case 'challenger_recruitment':
        return '🤝';
      default:
        return '🥇';
    }
  };

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {id: goal.id});
  };

  const renderGoalItem = ({item}: {item: Goal}) => (
    <TouchableOpacity
      style={styles.goalCard}
      onPress={() => handleGoalPress(item)}>
      <View style={styles.goalIconContainer}>
        <Text style={styles.goalEmoji}>{getGoalEmoji(item.title)}</Text>
      </View>
      <Text style={styles.goalTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={styles.goalMeta}>
        <Text style={styles.modeEmoji}>{getModeEmoji(item.mode)}</Text>
        <Text style={styles.modeText}>
          {item.mode === 'personal'
            ? '개인'
            : item.mode === 'group'
            ? '그룹'
            : item.mode === 'competition'
            ? '경쟁'
            : item.mode === 'challenger_recruitment'
            ? '챌린저'
            : '목표'}
        </Text>
      </View>
      <View style={styles.stickerInfo}>
        <Text style={styles.stickerEmoji}>⭐</Text>
        <Text style={styles.stickerCount}>{item.stickerCount}개</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🥇 내가 만든 목표</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Goals', {screen: 'Goals'})}>
          <Text style={styles.seeAllText}>전체보기</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>목표를 불러오는 중...</Text>
        </View>
      ) : myGoals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 만든 목표가 없어요! 🥺</Text>
          <Text style={styles.emptySubtext}>새로운 목표를 만들어보세요!</Text>
        </View>
      ) : (
        <FlatList
          data={myGoals}
          keyExtractor={item => item.id}
          renderItem={renderGoalItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.goalsList}
        />
      )}
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
  goalsList: {
    paddingRight: 20,
  },
  goalCard: {
    width: 120,
    height: 120,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  goalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  goalEmoji: {
    fontSize: 20,
  },
  goalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 16,
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeEmoji: {
    fontSize: 10,
    marginRight: 2,
  },
  modeText: {
    fontSize: 10,
    color: colors.medium,
    fontWeight: '600',
  },
  stickerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickerEmoji: {
    fontSize: 10,
    marginRight: 2,
  },
  stickerCount: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: 'bold',
  },
});

export default MyCreatedGoalsSection;
