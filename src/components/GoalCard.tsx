import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  GOAL_STATUS_COLOR,
  GOAL_STATUS_EMOJI,
  GOAL_STATUS_TEXT,
} from '../constants/goalStatus';
import {colors} from '../styles/colors';
import {formatDate} from '../utils/dateUtils';

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
  participants?: any[];
}

interface GoalCardProps {
  goal: Goal;
  onPress: (goal: Goal) => void;
  showProgress?: boolean;
  showParticipantCount?: boolean;
  showJoinButton?: boolean;
  showDuration?: boolean;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPress,
  showProgress = false,
  showParticipantCount = false,
  showJoinButton = false,
  showDuration = false,
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

  const getStatusDisplay = (status?: string) => {
    if (!status) return null;

    switch (status) {
      case 'active':
        return `${GOAL_STATUS_EMOJI.active} ${GOAL_STATUS_TEXT.active}`;
      case 'completed':
        return `${GOAL_STATUS_EMOJI.completed} ${GOAL_STATUS_TEXT.completed}`;
      case 'cancelled':
        return `${GOAL_STATUS_EMOJI.cancelled} ${GOAL_STATUS_TEXT.cancelled}`;
      default:
        return null;
    }
  };

  // 현재 사용자가 참여자인지 확인하고 해당 participant 찾기
  const participant = goal.participants?.find(
    (p: any) => p.userId === currentUserId,
  );

  // progress 계산 시 stickerCount가 0이거나 undefined인 경우 처리
  const progress =
    participant && goal.stickerCount && goal.stickerCount > 0
      ? Math.round((participant.currentStickerCount / goal.stickerCount) * 100)
      : 0;

  const participantCount = goal.participants?.length || 0;
  const daysLeft = goal.createdAt
    ? Math.max(
        0,
        30 -
          Math.floor(
            (Date.now() - new Date(goal.createdAt).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
      )
    : 30;

  return (
    <TouchableOpacity style={styles.feedItem} onPress={() => onPress(goal)}>
      <View style={styles.feedHeader}>
        <View style={styles.feedUserInfo}>
          <View style={styles.avatar}>
            {goal.goalImage ? (
              <Image
                source={{uri: goal.goalImage}}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{getGoalEmoji(goal.title)}</Text>
            )}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.feedUserName} numberOfLines={1}>
              {goal.title}
            </Text>
            <Text style={styles.feedTime}>{formatDate(goal.updatedAt)}</Text>
          </View>
        </View>
        {showParticipantCount && (
          <View style={styles.participantCountContainer}>
            <MaterialIcons name="group" size={16} color={colors.white} />
            <Text style={styles.participantCountText}>
              {participantCount}명
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.feedGoalTitle} numberOfLines={3}>
        {goal.description || '설명이 없습니다.'}
      </Text>

      {/* 목표 상태 표시 */}
      {goal.status && (
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              {
                color:
                  GOAL_STATUS_COLOR[
                    goal.status as keyof typeof GOAL_STATUS_COLOR
                  ] || colors.primary,
              },
            ]}>
            {getStatusDisplay(goal.status)}
          </Text>
        </View>
      )}

      {showProgress && (
        <View style={styles.feedProgress}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {width: `${Math.max(0, Math.min(100, progress))}%`},
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {participant?.currentStickerCount || 0}/{goal.stickerCount || 0}{' '}
            스티커
          </Text>
        </View>
      )}

      {(showDuration || (showJoinButton && goal.status !== 'completed')) && (
        <View style={styles.footer}>
          {showDuration && (
            <Text style={styles.duration}>{daysLeft}일 남음</Text>
          )}
          {showJoinButton && goal.status !== 'completed' && (
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>참여하기</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  feedItem: {
    backgroundColor: colors.components.goalCard.background,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.components.goalCard.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.components.goalCard.border,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.components.goalCard.avatar.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.components.goalCard.avatar.border,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  avatarText: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
  },
  feedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.components.goalCard.title,
    marginBottom: 4,
  },
  feedTime: {
    fontSize: 12,
    color: colors.medium,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  participantCount: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  feedGoalTitle: {
    fontSize: 16,
    color: colors.components.goalCard.description,
    lineHeight: 22,
    marginBottom: 16,
  },
  feedProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#E6F3FF',
    borderRadius: 5,
    marginRight: 12,
    overflow: 'hidden',
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
    fontSize: 14,
    color: colors.medium,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: colors.components.goalCard.button.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: colors.components.goalCard.button.shadow,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  joinButtonText: {
    fontSize: 14,
    color: colors.components.goalCard.button.text,
    fontWeight: '600',
  },
  participantCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.components.goalCard.participant.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  participantCountText: {
    fontSize: 14,
    color: colors.components.goalCard.participant.text,
    marginLeft: 6,
    fontWeight: '600',
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GoalCard;
