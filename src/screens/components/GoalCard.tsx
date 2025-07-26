import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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

  const participant = goal.participants?.find(
    (p: any) => p.userId === goal.createdBy,
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
            <Text style={styles.avatarText}>{getGoalEmoji(goal.title)}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.feedUserName} numberOfLines={1}>
              {goal.title}
            </Text>
            <Text style={styles.feedTime}>
              {goal.updatedAt
                ? new Date(goal.updatedAt).toLocaleDateString()
                : '-'}
            </Text>
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
      <Text style={styles.feedGoalTitle} numberOfLines={2}>
        {goal.description || '설명이 없습니다.'}
      </Text>

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

      {(showDuration || showJoinButton) && (
        <View style={styles.footer}>
          {showDuration && (
            <Text style={styles.duration}>{daysLeft}일 남음</Text>
          )}
          {showJoinButton && (
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
    borderRadius: 22,
    backgroundColor: colors.components.goalCard.avatar.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.components.goalCard.avatar.border,
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
    backgroundColor: colors.components.goalCard.progress.background,
    borderRadius: 5,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.components.goalCard.progress.fill,
    borderRadius: 5,
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
});

export default GoalCard;
