import React from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export interface Goal {
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
  participants?: GoalParticipant[];
}

export interface GoalParticipant {
  userId: string;
  nickname?: string;
  status: string;
  currentStickerCount: number;
  joinedAt: string;
  stickerReceivedLogs: StickerReceivedLog[];
}

export interface StickerReceivedLog {
  date: string;
  count: number;
}

interface GoalListProps {
  goals: Goal[];
  onPressGoal?: (goal: Goal) => void;
  emptyText?: string;
  contentContainerStyle?: any;
  emptyType?: 'goals' | 'participated';
}

const GoalList: React.FC<GoalListProps> = ({
  goals,
  onPressGoal,
  emptyText = '등록된 목표가 없습니다.',
  contentContainerStyle,
  emptyType = 'goals',
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
    return '🥇'; // 기본 이모지
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'completed':
        return '#FF9800';
      case 'archived':
        return '#9E9E9E';
      default:
        return '#FF6B9D';
    }
  };

  const renderItem = ({item}: {item: Goal}) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => onPressGoal && onPressGoal(item)}>
      <View style={styles.goalHeader}>
        <View style={styles.goalIconContainer}>
          <Text style={styles.goalEmoji}>{getGoalEmoji(item.title)}</Text>
        </View>
        <View style={styles.goalTitleContainer}>
          <Text style={styles.goalTitle}>{item.title}</Text>
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
                ? '챌린저 모집'
                : '목표'}
            </Text>
          </View>
        </View>
        {item.isParticipant && (
          <View style={styles.participantBadge}>
            <Text style={styles.participantBadgeText}>🎉 참여중</Text>
          </View>
        )}
      </View>

      {item.description && (
        <Text style={styles.goalDesc}>{item.description}</Text>
      )}

      <View style={styles.goalInfoRow}>
        <View style={styles.stickerContainer}>
          <Text style={styles.stickerEmoji}>⭐</Text>
          <Text style={styles.stickerCount}>{item.stickerCount}개 목표</Text>
        </View>
        {item.creatorNickname && (
          <View style={styles.creatorContainer}>
            <Text style={styles.creatorEmoji}>👑</Text>
            <Text style={styles.creator}>{item.creatorNickname}</Text>
          </View>
        )}
      </View>

      {item.participants && item.participants.length > 0 && (
        <View style={styles.participantsSection}>
          <View style={styles.participantsHeader}>
            <Text style={styles.participantsEmoji}>👬</Text>
            <Text style={styles.participantsTitle}>
              참가자{' '}
              <Text style={{color: '#FF6B9D'}}>
                ({item.participants.length}명)
              </Text>
            </Text>
          </View>
          {item.participants.slice(0, 3).map((participant, index) => (
            <View key={index} style={styles.participantInfo}>
              <Text style={styles.participantName}>
                {participant.nickname || '익명'}
              </Text>
              <Text style={styles.participantStickers}>
                ⭐ {participant.currentStickerCount}개 수집
              </Text>
            </View>
          ))}
          {item.participants.length > 3 && (
            <Text style={styles.moreParticipants}>
              외 {item.participants.length - 3}명 더 있어요! 🎊
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (!goals || goals.length === 0) {
    if (emptyType === 'participated') {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>👬</Text>
            <Text style={styles.emptyTitle}>아직 참여한 목표가 없어요!</Text>
            <Text style={styles.emptyText}>{emptyText}</Text>
            <Text style={styles.emptySubtext}>
              친구들과 함께 목표에 참여해보세요! 🤝
            </Text>
            <View style={styles.emptyDecoration}>
              <Text style={styles.decorationEmoji}>👥</Text>
              <Text style={styles.decorationEmoji}>🤝</Text>
              <Text style={styles.decorationEmoji}>🎉</Text>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🥇</Text>
          <Text style={styles.emptyTitle}>아직 목표가 없어요!</Text>
          <Text style={styles.emptyText}>{emptyText}</Text>
          <Text style={styles.emptySubtext}>
            새로운 목표를 만들어서 성취감을 느껴보세요! ✨
          </Text>
          <View style={styles.emptyDecoration}>
            <Text style={styles.decorationEmoji}>🎯</Text>
            <Text style={styles.decorationEmoji}>⭐</Text>
            <Text style={styles.decorationEmoji}>🏆</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={goals}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
    />
  );
};

const styles = StyleSheet.create({
  goalItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE5F0',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFE5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFB6D5',
  },
  goalEmoji: {
    fontSize: 28,
  },
  goalTitleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  goalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  modeText: {
    fontSize: 14,
    color: '#8E44AD',
    fontWeight: '600',
  },
  participantBadge: {
    backgroundColor: '#FF8FA3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  participantBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  goalDesc: {
    fontSize: 15,
    color: '#8E44AD',
    marginBottom: 16,
    lineHeight: 22,
  },
  goalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF8FA',
    borderRadius: 12,
  },
  stickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickerEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  stickerCount: {
    fontSize: 15,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  creator: {
    fontSize: 15,
    color: '#8E44AD',
    fontWeight: 'bold',
  },
  participantsSection: {
    marginTop: 10,
    backgroundColor: '#FFF8FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFE5F0',
  },
  participantsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantsEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  participantsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  participantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  participantName: {
    fontSize: 14,
    color: '#8E44AD',
    fontWeight: '600',
  },
  participantStickers: {
    fontSize: 13,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  moreParticipants: {
    fontSize: 13,
    color: '#8E44AD',
    marginTop: 6,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE5F0',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#8E44AD',
    textAlign: 'center',
  },
  emptyDecoration: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  decorationEmoji: {
    fontSize: 24,
    marginHorizontal: 5,
  },
});

export default GoalList;
