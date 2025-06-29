import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'users' | 'challenges';

const ExploreScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchText, setSearchText] = useState('');

  const tabs = [
    { key: 'users', label: '사용자 검색', icon: 'people-outline' },
    { key: 'challenges', label: '공개 챌린저', icon: 'trophy-outline' },
  ];

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.listItem}>
      <View style={styles.itemLeft}>
        <View style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <Text style={styles.userId}>@{item.userId}</Text>
          <Text style={styles.userStats}>
            팔로워 {item.followerCount} · 목표 {item.goalCount}개 달성
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>팔로우</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderChallengeItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>{item.title}</Text>
        <View style={styles.challengeParticipants}>
          <Ionicons name="people" size={14} color="#007AFF" />
          <Text style={styles.participantCount}>{item.participantCount}명</Text>
        </View>
      </View>
      
      <Text style={styles.challengeDescription}>{item.description}</Text>
      
      <View style={styles.challengeCreator}>
        <View style={styles.creatorAvatar} />
        <Text style={styles.creatorName}>{item.creatorName}</Text>
      </View>
      
      <View style={styles.challengeFooter}>
        <View style={styles.challengeInfo}>
          <Text style={styles.challengePeriod}>{item.period}</Text>
          <Text style={styles.challengeReward}>스티커 {item.totalStickers}개</Text>
        </View>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>참여하기</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getUsersData = () => [
    {
      id: '1',
      nickname: '운동왕김철수',
      userId: 'fitness_kim',
      followerCount: 120,
      goalCount: 15,
    },
    {
      id: '2',
      nickname: '독서광이영희',
      userId: 'book_lover_lee',
      followerCount: 89,
      goalCount: 22,
    },
    {
      id: '3',
      nickname: '요리달인박민수',
      userId: 'chef_park',
      followerCount: 245,
      goalCount: 8,
    },
  ];

  const getChallengesData = () => [
    {
      id: '1',
      title: '30일 아침 기상 챌린지',
      description: '매일 오전 6시에 일어나서 건강한 하루를 시작하는 챌린지입니다.',
      creatorName: '얼리버드',
      participantCount: 156,
      period: '2025.01.01 - 2025.01.30',
      totalStickers: 30,
    },
    {
      id: '2',
      title: '하루 한 페이지 일기 쓰기',
      description: '감사한 일들과 하루의 소감을 기록하며 자기성찰 시간을 갖는 챌린지',
      creatorName: '글쓰기좋아',
      participantCount: 89,
      period: '2025.01.15 - 2025.02.14',
      totalStickers: 31,
    },
    {
      id: '3',
      title: '플라스틱 프리 라이프',
      description: '환경을 생각하며 일회용 플라스틱 사용을 줄이는 친환경 챌린지',
      creatorName: '지구지킴이',
      participantCount: 203,
      period: '2025.01.01 - 2025.03.31',
      totalStickers: 90,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>탐색</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'users' 
                ? '사용자 ID 또는 닉네임 검색'
                : '챌린지 검색'
            }
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.key ? '#007AFF' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'users' ? (
        <FlatList
          data={getUsersData()}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={getChallengesData()}
          renderItem={renderChallengeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 5,
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userStats: {
    fontSize: 12,
    color: '#999',
  },
  followButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  challengeParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 15,
  },
  challengeCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
  },
  creatorName: {
    fontSize: 12,
    color: '#666',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeInfo: {
    flex: 1,
  },
  challengePeriod: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  challengeReward: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ExploreScreen;