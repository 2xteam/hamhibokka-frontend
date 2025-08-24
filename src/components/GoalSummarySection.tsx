import {useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GET_GOALS} from '../queries/goal';
import {colors} from '../styles/colors';

interface Goal {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  goalImage?: string;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

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
    data: goalsData,
    loading,
    refetch: refetchGoals,
  } = useQuery(GET_GOALS, {
    fetchPolicy: 'cache-and-network',
  });

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetchGoals();
    }, [refetchGoals]),
  );

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
      case 'competition':
        return '🏆';
      case 'challenger_recruitment':
        return '👬';
      default:
        return '🥇';
    }
  };

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {id: goal.id});
  };

  const renderGoalItem = ({item}: {item: Goal}) => {
    // 나의 목표에서는 목표 생성자의 관점에서 진행률을 보여줌
    const myParticipant = item.participants?.find(
      (p: any) => p.userId === currentUserId,
    );

    let progress = 0;
    let currentStickerCount = 0;
    let totalStickerCount = item.stickerCount || 0;

    if (myParticipant) {
      // 내가 참여한 경우 내 진행률 사용
      currentStickerCount = myParticipant.currentStickerCount || 0;
      progress =
        totalStickerCount > 0
          ? Math.round((currentStickerCount / totalStickerCount) * 100)
          : 0;
    } else if (item.participants && item.participants.length > 0) {
      // 내가 참여하지 않았지만 다른 참여자들이 있는 경우 최고 진행률을 보여줌
      const validParticipants = item.participants.filter(
        (p: any) => p.currentStickerCount !== undefined,
      );
      if (validParticipants.length > 0) {
        const maxCurrentStickers = Math.max(
          ...validParticipants.map((p: any) => p.currentStickerCount || 0),
        );
        currentStickerCount = maxCurrentStickers;
        progress =
          totalStickerCount > 0
            ? Math.round((currentStickerCount / totalStickerCount) * 100)
            : 0;
      }
    }

    return (
      <TouchableOpacity
        style={styles.goalCard}
        onPress={() => handleGoalPress(item)}>
        <View style={styles.goalIconContainer}>
          {item.goalImage ? (
            <Image
              source={{uri: item.goalImage}}
              style={styles.goalImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.goalEmoji}>{getGoalEmoji(item.title)}</Text>
          )}
        </View>
        <Text style={styles.goalTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.goalMeta}>
          <Text style={styles.modeEmoji}>{getModeEmoji(item.mode)}</Text>
          <Text style={styles.modeText}>
            {item.mode === 'personal'
              ? '개인'
              : item.mode === 'competition'
              ? '경쟁'
              : item.mode === 'challenger_recruitment'
              ? '챌린저'
              : '목표'}
          </Text>
        </View>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.max(5, Math.min(100, progress))}%`},
              ]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🥇 나의 목표</Text>
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
    marginTop: 20,
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
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  goalEmoji: {
    fontSize: 20,
  },
  goalImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
  progressContainer: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#E6F3FF',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
    borderWidth: 0,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#20B2AA',
    borderRadius: 5,
    shadowColor: '#20B2AA',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  progressText: {
    fontSize: 9,
    color: colors.medium,
    fontWeight: '600',
  },
});

export default MyCreatedGoalsSection;
