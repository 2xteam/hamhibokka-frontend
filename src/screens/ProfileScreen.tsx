import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Loading} from '../components/common';
import {BUTTON_TEXTS, EMOJIS} from '../constants';
import {APPROVE_FOLLOW, GET_FOLLOWS} from '../queries/user';
import {colors} from '../styles/colors';
import UserList, {User} from './components/UserList';

interface ProfileUser {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  followerNickname?: string;
  followingNickname?: string;
  followerEmail?: string;
  followerProfileImage?: string;
  followingEmail?: string;
  followingProfileImage?: string;
  status: string;
  approvedAt?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileScreenProps {
  user: ProfileUser | null;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({user, onLogout}) => {
  const navigation = useNavigation<any>();
  const [followsList, setFollowsList] = useState<Follow[]>([]);
  const [actualCurrentUserId, setActualCurrentUserId] = useState<string>('');

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@hamhibokka_user');
        if (userData) {
          const user = JSON.parse(userData);
          setActualCurrentUserId(user.userId);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  // 모든 팔로우 데이터 조회
  const {
    data: followsData,
    loading: followsLoading,
    refetch: refetchFollows,
  } = useQuery(GET_FOLLOWS, {
    variables: {status: null},
    fetchPolicy: 'network-only',
  });

  // 화면 진입 시마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      refetchFollows();
    }, [refetchFollows]),
  );

  // 팔로우 승인 뮤테이션
  const [approveFollow] = useMutation(APPROVE_FOLLOW, {
    onCompleted: () => {
      Alert.alert('성공', '팔로우 요청을 승인했습니다.');
      refetchFollows();
    },
    onError: error => {
      Alert.alert('오류', '팔로우 승인에 실패했습니다.');
      console.error('Approve follow error:', error);
    },
  });

  // 데이터 처리 - 모든 팔로우 데이터
  useEffect(() => {
    if (followsData?.getFollows) {
      setFollowsList(followsData.getFollows);
    } else {
      setFollowsList([]);
    }
  }, [followsData]);

  // 팔로우 데이터를 사용자 형태로 변환
  const convertFollowsToUsers = (): User[] => {
    return followsList.map((follow: Follow) => {
      const isMyRequest = follow.followerId === actualCurrentUserId;
      const isPending = follow.status === 'pending';
      const isApproved = follow.status === 'approved';

      // 내가 보낸 요청인 경우 (followerId가 나인 경우)
      if (isMyRequest) {
        return {
          id: follow.id,
          userId: follow.followingId,
          email: follow.followingEmail || '',
          nickname: follow.followingNickname || follow.followingId,
          profileImage: follow.followingProfileImage,
          followStatus: follow.status,
          followData: follow,
          status: follow.status,
          isMyRequest,
          showApproveButton: false,
          showPendingStatus: isPending,
        } as User & {
          followData: Follow;
          status: string;
          isMyRequest: boolean;
          showApproveButton: boolean;
          showPendingStatus: boolean;
        };
      } else {
        // 내가 받은 요청인 경우 (followingId가 나인 경우)
        return {
          id: follow.id,
          userId: follow.followerId,
          email: follow.followerEmail || '',
          nickname: follow.followerNickname || follow.followerId,
          profileImage: follow.followerProfileImage,
          followStatus: follow.status,
          followData: follow,
          status: follow.status,
          isMyRequest,
          showApproveButton:
            follow.followingId === actualCurrentUserId && isPending,
          showPendingStatus: false,
        } as User & {
          followData: Follow;
          status: string;
          isMyRequest: boolean;
          showApproveButton: boolean;
          showPendingStatus: boolean;
        };
      }
    });
  };

  const handleUserPress = (user: User) => {
    // 사용자 클릭 시 UserProfileScreen으로 이동
    navigation.navigate('UserProfile', {user});
  };

  const handleApproveFollow = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user && (user as any).followData) {
      handleApproveFollowById((user as any).followData.id);
    }
  };

  const handleApproveFollowById = (followId: string) => {
    Alert.alert('팔로우 승인', '이 사용자의 팔로우 요청을 승인하시겠습니까?', [
      {text: BUTTON_TEXTS.CANCEL, style: 'cancel'},
      {
        text: BUTTON_TEXTS.APPROVE,
        onPress: () => {
          approveFollow({variables: {followId}});
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      {text: BUTTON_TEXTS.CANCEL, style: 'cancel'},
      {text: '로그아웃', style: 'destructive', onPress: onLogout},
    ]);
  };

  const users = convertFollowsToUsers();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>내 프로필</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 프로필 정보 */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                user?.profileImage
                  ? {uri: user.profileImage}
                  : require('../../assets/default-profile.jpg')
              }
              style={styles.profileImage}
            />
            <View style={styles.profileImageBorder} />
          </View>
          <Text style={styles.nickname}>
            {EMOJIS.SUCCESS} {user?.nickname}
          </Text>
          <Text style={styles.email}>
            {EMOJIS.USER} {user?.email}
          </Text>
        </View>

        {/* 친구 관리 섹션 */}
        <View style={styles.friendsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.friendsSectionTitle}>
              {EMOJIS.GROUP} 친구 관리
            </Text>
          </View>
          <Text style={styles.friendsSectionSubtitle}>
            {EMOJIS.SUCCESS} 총 {users.length}명의 친구가 있어요!
          </Text>

          {followsLoading ? (
            <Loading />
          ) : (
            <UserList
              users={users}
              onPressUser={handleUserPress}
              emptyText="아직 친구가 없어요! {EMOJIS.ERROR}"
              contentContainerStyle={styles.friendsList}
              showFollowStatus={false}
              showApproveButton={true}
              onApproveFollow={handleApproveFollow}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerSpacer: {
    width: 60,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: colors.primaryDark,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  logoutButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 28,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  profileImageBorder: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: colors.medium,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },

  friendsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendsSectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
  },
  sectionBadge: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 30,
    alignItems: 'center',
  },

  friendsSectionSubtitle: {
    fontSize: 14,
    color: colors.medium,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  friendsList: {
    paddingHorizontal: 0,
  },
});

export default ProfileScreen;
