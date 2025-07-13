import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ChallengeSection = () => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>참여 가능한 챌린저</Text>
    <TouchableOpacity style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeTitle}>새해 독서 챌린지</Text>
        <View style={styles.challengeParticipants}>
          <MaterialIcons name="group" size={16} color="#7F8C8D" />
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
});

export default ChallengeSection; 