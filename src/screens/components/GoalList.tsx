import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
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
  userId?: string;
}

const GoalList: React.FC<GoalListProps> = ({
  goals,
  onPressGoal,
  emptyText = '등록된 목표가 없습니다.',
  contentContainerStyle,
  emptyType = 'goals',
  userId,
}) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    userId || null,
  );

  useEffect(() => {
    if (!userId) {
      // userId가 props로 전달되지 않은 경우 AsyncStorage에서 가져오기
      const getUserId = async () => {
        try {
          const userData = await AsyncStorage.getItem('@hamhibokka_user');
          if (userData) {
            const user = JSON.parse(userData);
            setCurrentUserId(user.userId);
          }
        } catch (e) {
          console.log('Failed to get user data');
        }
      };
      getUserId();
    } else {
      setCurrentUserId(userId);
    }
  }, [userId]);

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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return '#27AE60';
      case 'completed':
        return '#E74C3C';
      case 'archived':
        return '#95A5A6';
      default:
        return '#FF6B9D';
    }
  };

  const renderItem = ({item}: {item: Goal}) => {
    // 내가 참여한 목표에서 완료 상태 확인
    const myParticipant = item.participants?.find(
      p => p.userId === currentUserId,
    );
    const isCompleted =
      myParticipant && myParticipant.currentStickerCount >= item.stickerCount;

    return (
      <TouchableOpacity
        style={[styles.goalItem, isCompleted && styles.completedGoalItem]}
        onPress={() => onPressGoal && onPressGoal(item)}>
        {/* 완료 오버레이 아이콘 */}
        {isCompleted && (
          <View style={styles.completedOverlay}>
            <Text style={styles.completedIcon}>🏆</Text>
          </View>
        )}

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
          {/* 스티커 완료 배지 */}
          {item.isParticipant &&
            item.participants &&
            (() => {
              const currentUser = item.participants.find(
                (p: any) =>
                  p.userId === item.createdBy ||
                  p.currentStickerCount >= item.stickerCount,
              );
              if (
                currentUser &&
                currentUser.currentStickerCount >= item.stickerCount
              ) {
                return (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedBadgeText}>🏆 완료!</Text>
                  </View>
                );
              }
              return null;
            })()}
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
                <View style={styles.participantStickerInfo}>
                  <Text style={styles.participantStickers}>
                    ⭐ {participant.currentStickerCount}개 수집
                  </Text>
                  {participant.currentStickerCount >= item.stickerCount && (
                    <Text style={styles.completedEmoji}>🏆</Text>
                  )}
                </View>
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
  };

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
              <Text style={styles.decorationEmoji}>👬</Text>
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
    position: 'relative',
  },
  completedGoalItem: {
    backgroundColor: '#E6FFE6',
    borderColor: '#27AE60',
    borderWidth: 3,
    shadowColor: '#27AE60',
    shadowOpacity: 0.2,
  },
  completedOverlay: {
    position: 'absolute',
    top: 10,
    right: 16,
    zIndex: 10,
    backgroundColor: '#27AE60',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#27AE60',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  completedIcon: {
    fontSize: 20,
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
  completedBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    shadowColor: '#27AE60',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
  participantStickerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  completedEmoji: {
    fontSize: 14,
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
