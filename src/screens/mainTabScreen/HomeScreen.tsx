import {useQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChallengeSection from '../../components/ChallengeSection';
import FloatingAddGoalButton from '../../components/FloatingAddGoalButton';
import FollowFeedSection from '../../components/FollowFeedSection';
import MyCreatedGoalsSection from '../../components/GoalSummarySection';
import NotificationViewer from '../../components/NotificationViewer';
import {GET_INVITATIONS} from '../../queries/goal';
import {colors} from '../../styles/colors';

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

const HomeScreen: React.FC<HomeScreenProps> = ({user}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [notificationViewerVisible, setNotificationViewerVisible] =
    useState(false);
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  // StatusBar 설정
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle('light-content', true);
  }, []);

  // 초대 요청 조회
  const {data: invitationsData, refetch: refetchInvitations} = useQuery(
    GET_INVITATIONS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  // 화면이 포커스될 때마다 초대 요청 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      refetchInvitations();
    }, [refetchInvitations]),
  );

  // pending 상태의 초대 요청 개수 계산
  const pendingCount =
    invitationsData?.getInvitations?.filter(
      (invitation: any) => invitation.status === 'pending',
    )?.length || 0;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // 모든 데이터 새로고침
      await Promise.all([refetchInvitations()]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleNotificationPress = () => {
    setNotificationViewerVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* 상태바 영역 */}
      <View
        style={[
          styles.statusBarArea,
          {
            height: insets.top,
          },
        ]}
      />

      {/* 메인 컨텐츠 영역 */}
      <SafeAreaView style={styles.safeArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View>
              <Text style={styles.userName}>{user?.nickname}님</Text>
              <Text style={styles.greeting}>안녕하세요! 👋</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}>
            <MaterialIcons
              name="notifications"
              size={24}
              color={colors.primary}
            />
            {pendingCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          <MyCreatedGoalsSection navigation={navigation} />
          <FollowFeedSection navigation={navigation} />
          <ChallengeSection navigation={navigation} />
        </ScrollView>

        {/* 플로팅 액션 버튼 */}
        <FloatingAddGoalButton />

        {/* 알림 뷰어 */}
        <NotificationViewer
          visible={notificationViewerVisible}
          onClose={() => setNotificationViewerVisible(false)}
        />
      </SafeAreaView>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBarArea: {
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? -6 : -15,
    paddingBottom: 4,
    backgroundColor: colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  greeting: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '600',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 2,
    textShadowColor: colors.primaryDark,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.error,
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  notificationCount: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
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
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  seeAllText: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: '600',
  },
  goalSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFE5F0',
  },
});

export default HomeScreen;
