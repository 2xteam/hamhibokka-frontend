import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface GoalSummarySectionProps {
  navigation: any;
}

const GoalSummarySection: React.FC<GoalSummarySectionProps> = ({ navigation }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>내 목표 현황</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
        <Text style={styles.seeAllText}>전체보기</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.goalSummaryContainer}>
      <View style={styles.goalSummaryCard}>
        <View style={styles.goalSummaryIcon}>
          <MaterialIcons name="flag" size={20} color="#4A90E2" />
        </View>
        <Text style={styles.goalSummaryNumber}>3</Text>
        <Text style={styles.goalSummaryLabel}>진행 중</Text>
      </View>
      <View style={styles.goalSummaryCard}>
        <View style={styles.goalSummaryIcon}>
          <MaterialIcons name="check-circle" size={20} color="#27AE60" />
        </View>
        <Text style={styles.goalSummaryNumber}>12</Text>
        <Text style={styles.goalSummaryLabel}>완료됨</Text>
      </View>
      <View style={styles.goalSummaryCard}>
        <View style={styles.goalSummaryIcon}>
          <MaterialIcons name="stars" size={20} color="#F39C12" />
        </View>
        <Text style={styles.goalSummaryNumber}>127</Text>
        <Text style={styles.goalSummaryLabel}>스티커</Text>
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
});

export default GoalSummarySection; 