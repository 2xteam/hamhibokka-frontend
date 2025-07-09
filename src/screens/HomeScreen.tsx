import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface HomeScreenProps {
  user: User | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: 데이터 새로고침 로직
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>안녕하세요! 👋</Text>
          <Text style={styles.userName}>{user?.nickname}님</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications" size={24} color="#2C3E50" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 내 목표 요약 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>내 목표 현황</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>전체보기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalSummaryContainer}>
            <View style={styles.goalSummaryCard}>
              <View style={styles.goalSummaryIcon}>
                <Icon name="flag" size={20} color="#4A90E2" />
              </View>
              <Text style={styles.goalSummaryNumber}>3</Text>
              <Text style={styles.goalSummaryLabel}>진행 중</Text>
            </View>

            <View style={styles.goalSummaryCard}>
              <View style={styles.goalSummaryIcon}>
                <Icon name="check-circle" size={20} color="#27AE60" />
              </View>
              <Text style={styles.goalSummaryNumber}>12</Text>
              <Text style={styles.goalSummaryLabel}>완료됨</Text>
            </View>

            <View style={styles.goalSummaryCard}>
              <View style={styles.goalSummaryIcon}>
                <Icon name="stars" size={20} color="#F39C12" />
              </View>
              <Text style={styles.goalSummaryNumber}>127</Text>
              <Text style={styles.goalSummaryLabel}>스티커</Text>
            </View>
          </View>
        </View>

        {/* 팔로우 피드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>팔로우 피드</Text>
          
          {/* 피드 아이템 예시 */}
          <View style={styles.feedItem}>
            <View style={styles.feedHeader}>
              <View style={styles.feedUserInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>김</Text>
                </View>
                <View>
                  <Text style={styles.feedUserName}>김철수</Text>
                  <Text style={styles.feedTime}>2시간 전</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.stickerButton}>
                <Icon name="star" size={16} color="#F39C12" />
                <Text style={styles.stickerButtonText}>스티커</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.feedGoalTitle}>매일 영어 단어 20개 외우기</Text>
            <View style={styles.feedProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>12/20 스티커</Text>
            </View>
          </View>

          <View style={styles.feedItem}>
            <View style={styles.feedHeader}>
              <View style={styles.feedUserInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>이</Text>
                </View>
                <View>
                  <Text style={styles.feedUserName}>이영희</Text>
                  <Text style={styles.feedTime}>5시간 전</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.stickerButton}>
                <Icon name="star" size={16} color="#F39C12" />
                <Text style={styles.stickerButtonText}>스티커</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.feedGoalTitle}>주 3회 운동하기</Text>
            <View style={styles.feedProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '80%' }]} />
              </View>
              <Text style={styles.progressText}>8/10 스티커</Text>
            </View>
          </View>
        </View>

        {/* 추천 챌린저 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>참여 가능한 챌린저</Text>
          
          <TouchableOpacity style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>새해 독서 챌린지</Text>
              <View style={styles.challengeParticipants}>
                <Icon name="group" size={16} color="#7F8C8D" />
                <Text style={styles.participantCount}>15명 참여</Text>
              </View>
            </View>
            <Text style={styles.challengeDescription}>
              한 달 동안 책 3권 읽기 도전!
            </Text>
            <View style={styles.challengeFooter}>
              <Text style={styles.challengeDuration}>30일 남음</Text>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>참여하기</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity style={styles.fab}>
        <Icon name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  goalSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalSummaryIcon: {
    marginBottom: 8,
  },
  goalSummaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalSummaryLabel: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  feedItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  feedUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  feedUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  feedTime: {
    fontSize: 12,
    color: '#95A5A6',
    marginTop: 2,
  },
  stickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stickerButtonText: {
    fontSize: 12,
    color: '#F39C12',
    fontWeight: '500',
    marginLeft: 4,
  },
  feedGoalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  feedProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  challengeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  challengeParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantCount: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 12,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeDuration: {
    fontSize: 12,
    color: '#E74C3C',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default HomeScreen;