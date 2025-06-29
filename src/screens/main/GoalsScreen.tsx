import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type TabType = "active" | "completed" | "participating";

const GoalsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  const tabs = [
    { key: "active", label: "진행중", icon: "play-circle-outline" },
    { key: "completed", label: "완료됨", icon: "checkmark-circle-outline" },
    { key: "participating", label: "참여중", icon: "people-outline" },
  ];

  const renderGoalItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.goalItem}>
      <View style={styles.goalHeader}>
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          <Text style={styles.goalMode}>{item.mode}</Text>
        </View>
        <View style={styles.goalStatus}>
          <Text style={styles.stickerCount}>
            {item.currentStickers}/{item.totalStickers}
          </Text>
          <Ionicons name="star" size={16} color="#FFD700" />
        </View>
      </View>

      <Text style={styles.goalDescription}>{item.description}</Text>

      <View style={styles.goalProgress}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(item.currentStickers / item.totalStickers) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((item.currentStickers / item.totalStickers) * 100)}%
        </Text>
      </View>

      <View style={styles.goalFooter}>
        <Text style={styles.goalDate}>{item.endDate}</Text>
        <View style={styles.goalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.actionText}>스티커 추가</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getGoalsData = () => {
    switch (activeTab) {
      case "active":
        return [
          {
            id: "1",
            title: "매일 30분 운동하기",
            description: "건강한 몸을 위해 꾸준히 운동합니다.",
            mode: "개인 목표",
            currentStickers: 8,
            totalStickers: 30,
            endDate: "2025.01.31까지",
          },
          {
            id: "2",
            title: "주 3회 독서하기",
            description: "지식 향상을 위한 꾸준한 독서 습관",
            mode: "개인 목표",
            currentStickers: 12,
            totalStickers: 24,
            endDate: "2025.02.28까지",
          },
        ];
      case "completed":
        return [
          {
            id: "3",
            title: "물 하루 2L 마시기",
            description: "건강을 위한 충분한 수분 섭취",
            mode: "경쟁 목표",
            currentStickers: 30,
            totalStickers: 30,
            endDate: "2024.12.31 완료",
          },
        ];
      case "participating":
        return [
          {
            id: "4",
            title: "30일 영어 단어 암기",
            description: "영어 실력 향상을 위한 단어 암기 챌린지",
            mode: "챌린저 모집",
            currentStickers: 15,
            totalStickers: 30,
            endDate: "2025.02.15까지",
          },
        ];
      default:
        return [];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>내 목표</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <Ionicons
              name={tab.icon as any}
              size={18}
              color={activeTab === tab.key ? "#007AFF" : "#666"}
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

      <FlatList
        data={getGoalsData()}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.goalsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>
              {activeTab === "active" && "진행 중인 목표가 없습니다."}
              {activeTab === "completed" && "완료된 목표가 없습니다."}
              {activeTab === "participating" && "참여 중인 목표가 없습니다."}
            </Text>
            <TouchableOpacity style={styles.createGoalButton}>
              <Text style={styles.createGoalButtonText}>첫 목표 만들기</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    gap: 5,
  },
  activeTab: {
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  goalsList: {
    padding: 20,
  },
  goalItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  goalMode: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  goalStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stickerCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  goalDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 15,
  },
  goalProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  goalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalDate: {
    fontSize: 12,
    color: "#999",
  },
  goalActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  createGoalButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createGoalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default GoalsScreen;
