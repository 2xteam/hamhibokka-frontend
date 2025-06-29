import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "로그아웃", style: "destructive", onPress: logout },
    ]);
  };

  const menuItems = [
    {
      title: "팔로잉",
      subtitle: "125명",
      icon: "people-outline",
      onPress: () => console.log("팔로잉"),
    },
    {
      title: "팔로워",
      subtitle: "89명",
      icon: "heart-outline",
      onPress: () => console.log("팔로워"),
    },
    {
      title: "목표 히스토리",
      subtitle: "달성한 목표들",
      icon: "flag-outline",
      onPress: () => console.log("목표 히스토리"),
    },
    {
      title: "스티커 컬렉션",
      subtitle: "받은 스티커들",
      icon: "star-outline",
      onPress: () => console.log("스티커 컬렉션"),
    },
    {
      title: "알림 설정",
      subtitle: "푸시 알림 관리",
      icon: "notifications-outline",
      onPress: () => console.log("알림 설정"),
    },
    {
      title: "개인정보 설정",
      subtitle: "프로필 편집",
      icon: "person-outline",
      onPress: () => console.log("개인정보 설정"),
    },
    {
      title: "고객센터",
      subtitle: "문의 및 신고",
      icon: "help-circle-outline",
      onPress: () => console.log("고객센터"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 프로필 헤더 */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#666" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.nickname}>{user?.nickname}</Text>
              <Text style={styles.userId}>@{user?.userId}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 통계 */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>완료된 목표</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>진행 중인 목표</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>받은 스티커</Text>
          </View>
        </View>

        {/* 최근 성과 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>최근 성과</Text>
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>30일 연속 운동 달성!</Text>
              <Text style={styles.achievementDate}>2025년 1월 20일</Text>
            </View>
          </View>

          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <Ionicons name="star" size={24} color="#007AFF" />
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>독서 목표 완료</Text>
              <Text style={styles.achievementDate}>2025년 1월 15일</Text>
            </View>
          </View>
        </View>

        {/* 메뉴 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>메뉴</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color="#333" />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* 로그아웃 */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        {/* 앱 정보 */}
        <View style={styles.appInfoSection}>
          <Text style={styles.appInfo}>함히보까 v1.0.0</Text>
          <Text style={styles.appInfo}>
            © 2025 Hamhibokka. All rights reserved.
          </Text>
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
    backgroundColor: "#fff",
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  email: {
    fontSize: 12,
    color: "#999",
  },
  editButton: {
    padding: 8,
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: "#666",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    marginLeft: 15,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff3b30",
    fontWeight: "500",
  },
  appInfoSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appInfo: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
});

export default ProfileScreen;
