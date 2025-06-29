import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen: React.FC = () => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: 데이터 새로고침 로직
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>안녕하세요!</Text>
          <Text style={styles.userName}>{user?.nickname}님</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 내 목표 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>내 목표 현황</Text>
          <View style={styles.goalSummary}>
            <View style={styles.goalSummaryItem}>
              <Text style={styles.goalSummaryNumber}>3</Text>
              <Text style={styles.goalSummaryLabel}>진행중</Text>
            </View>
            <View style={styles.goalSummaryItem}>
              <Text style={styles.goalSummaryNumber}>12</Text>
              <Text style={styles.goalSummaryLabel}>완료됨</Text>
            </View>
            <View style={styles.goalSummaryItem}>
              <Text style={styles.goalSummaryNumber}>45</Text>
              <Text style={styles.goalSummaryLabel}>받은 스티커</Text>
            </View>
          </View>
        </View>

        {/* 팔로우 피드 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>팔로우 피드</Text>
          <View style={styles.feedItem}>
            <View style={styles.feedHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>김철수</Text>
                  <Text style={styles.goalTitle}>매일 1시간 독서하기</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.stickerButton}>
                <Ionicons name="star-outline" size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>
            <Text style={styles.feedContent}>
              오늘도 목표 달성! 📚 벌써 15일째 연속 독서 중입니다.
            </Text>
            <View style={styles.feedStats}>
              <Text style={styles.feedStatsText}>스티커 8/10</Text>
            </View>
          </View>

          <View style={styles.feedItem}>
            <View style={styles.feedHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>이영희</Text>
                  <Text style={styles.goalTitle}>주 3회 운동하기</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.stickerButton}>
                <Ionicons name="star-outline" size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>
            <Text style={styles.feedContent}>
              헬스장에서 운동 완료! 💪 땀 한 방울 한 방울이 성취감을 줍니다.
            </Text>
            <View style={styles.feedStats}>
              <Text style={styles.feedStatsText}>스티커 12/15</Text>
            </View>
          </View>
        </View>

        {/* 추천 챌린저 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추천 챌린저</Text>
          <TouchableOpacity style={styles.challengeItem}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>30일 물 2L 마시기</Text>
              <Text style={styles.challengeParticipants}>23명 참여</Text>
            </View>
            <Text style={styles.challengeDescription}>
              건강한 생활습관을 만들어가는 챌린지입니다. 함께 해요!
            </Text>
            <Text style={styles.challengePeriod}>
              기간: 2025.01.01 - 2025.01.30
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.challengeItem}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>매일 감사 일기 쓰기</Text>
              <Text style={styles.challengeParticipants}>45명 참여</Text>
            </View>
            <Text style={styles.challengeDescription}>
              하루의 감사한 일들을 기록하며 긍정적인 마음가짐을 기르는 챌린지
            </Text>
            <Text style={styles.challengePeriod}>
              기간: 2025.01.15 - 2025.02.14
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  greeting: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  goalSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  goalSummaryItem: {
    alignItems: "center",
  },
  goalSummaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  goalSummaryLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  feedItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 15,
    marginBottom: 15,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  goalTitle: {
    fontSize: 14,
    color: "#666",
  },
  stickerButton: {
    padding: 8,
  },
  feedContent: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 10,
  },
  feedStats: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  feedStatsText: {
    fontSize: 12,
    color: "#666",
  },
  challengeItem: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  challengeParticipants: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  challengeDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  challengePeriod: {
    fontSize: 12,
    color: "#999",
  },
});

export default HomeScreen;
