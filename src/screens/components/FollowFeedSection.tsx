import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FollowFeedSection = () => (
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
          <MaterialIcons name="star" size={16} color="#F39C12" />
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
          <MaterialIcons name="star" size={16} color="#F39C12" />
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
);

const styles = StyleSheet.create({
  section: {
    marginTop: 10,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
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
});

export default FollowFeedSection; 