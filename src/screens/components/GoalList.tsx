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
}

const GoalList: React.FC<GoalListProps> = ({
  goals,
  onPressGoal,
  emptyText = '등록된 목표가 없습니다.',
  contentContainerStyle,
}) => {
  const renderItem = ({item}: {item: Goal}) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => onPressGoal && onPressGoal(item)}>
      <Text style={styles.goalTitle}>{item.title}</Text>
      <Text style={styles.goalDesc}>{item.description || '설명 없음'}</Text>
      <View style={styles.goalInfo}>
        <Text style={styles.stickerCount}>
          스티커 목표: {item.stickerCount}개
        </Text>
        {item.creatorNickname && (
          <Text style={styles.creator}>생성자: {item.creatorNickname}</Text>
        )}
        {item.mode && <Text style={styles.mode}>모드: {item.mode}</Text>}
        {item.isParticipant && <Text style={styles.participant}>참여 중</Text>}
      </View>
      {item.participants && item.participants.length > 0 && (
        <View style={styles.participantsSection}>
          <Text style={styles.participantsTitle}>
            참가자 ({item.participants.length}명)
          </Text>
          {item.participants.slice(0, 3).map((participant, index) => (
            <Text key={index} style={styles.participantInfo}>
              {participant.nickname || '익명'} -{' '}
              {participant.currentStickerCount}개 수집
            </Text>
          ))}
          {item.participants.length > 3 && (
            <Text style={styles.moreParticipants}>
              외 {item.participants.length - 3}명
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  if (!goals || goals.length === 0) {
    return <Text style={styles.emptyText}>{emptyText}</Text>;
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  goalDesc: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  stickerCount: {
    fontSize: 13,
    color: '#F39C12',
    fontWeight: 'bold',
  },
  creator: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  mode: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: '500',
  },
  participant: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
  },
  participantsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E6ED',
    paddingTop: 12,
  },
  participantsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  participantInfo: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  moreParticipants: {
    fontSize: 12,
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default GoalList;
