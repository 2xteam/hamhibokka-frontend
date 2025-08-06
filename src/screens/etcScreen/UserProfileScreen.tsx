import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GoalList, {Goal} from '../../components/GoalList';
import ProfileHeader from '../../components/ProfileHeader';
import {
  FOLLOW_BUTTON_TEXT,
  FOLLOW_STATUS,
  FOLLOW_STATUS_TEXT,
} from '../../constants/followStatus';
import {GET_ALL_GOALS_BY_USER_ID} from '../../queries/goal';
import {
  CHECK_FOLLOW_STATUS,
  CREATE_FOLLOW,
  GET_FOLLOW_REQUESTS,
} from '../../queries/user';

interface UserProfileParams {
  user: {
    id: string;
    userId: string;
    email: string;
    nickname: string;
    profileImage?: string;
    followStatus?: string;
  };
}

const UserProfileScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<Record<string, UserProfileParams>, string>>();
  const navigation = useNavigation<any>();
  const {user} = route.params;

  const [followStatus, setFollowStatus] = useState(user.followStatus || '');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [imageModalVisible, setImageModalVisible] = useState(false);

  // 현재 사용자 ID 가져오기
  React.useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@hamhibokka_user');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUserId(user.userId);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  // 팔로우 요청 상태 조회
  const {data: followRequestsData, refetch: refetchFollowRequests} = useQuery(
    GET_FOLLOW_REQUESTS,
    {
      skip: !currentUserId,
    },
  );

  // 친구 상태 확인 쿼리
  const {data: followStatusData, refetch: refetchFollowStatus} = useQuery(
    CHECK_FOLLOW_STATUS,
    {
      variables: {
        followerId: currentUserId || '',
        followingId: user.userId || '',
      },
      skip: !currentUserId || !user.userId || currentUserId === user.userId,
    },
  );

  // 화면이 포커스될 때마다 팔로우 요청 상태와 친구 상태 새로고침
  useFocusEffect(
    React.useCallback(() => {
      if (currentUserId) {
        refetchFollowRequests();
        if (user.userId && currentUserId !== user.userId) {
          refetchFollowStatus();
        }
      }
    }, [
      currentUserId,
      user.userId,
      refetchFollowRequests,
      refetchFollowStatus,
    ]),
  );

  // 사용자의 목표 조회
  const {data: goalsData, loading: goalsLoading} = useQuery(
    GET_ALL_GOALS_BY_USER_ID,
    {
      variables: {userId: user.userId},
    },
  );

  // 팔로우 생성 뮤테이션
  const [createFollow] = useMutation(CREATE_FOLLOW, {
    onCompleted: data => {
      setFollowStatus(FOLLOW_STATUS.PENDING); // 대기중 상태로 설정
      setIsLoading(false);
      // 팔로우 요청 상태 새로고침
      refetchFollowRequests();
      Alert.alert('😁', '팔로우 요청을 보냈습니다.');
    },
    onError: error => {
      setIsLoading(false);
      Alert.alert('😣', '팔로우 요청에 실패했습니다.');
      console.error('Create follow error:', error);
    },
  });

  const handleFollowToggle = async () => {
    if (!user || !currentUserId || isLoading || followStatus) return;
    setIsLoading(true);
    await createFollow({
      variables: {
        input: {
          followerId: currentUserId,
          followingId: user.userId,
        },
      },
    });
  };

  // 자기 자신의 프로필인지 확인
  const isOwnProfile = user.userId === currentUserId;

  // 팔로우 요청 상태 확인
  const pendingRequest = followRequestsData?.getFollowRequests?.find(
    (request: any) =>
      request.followerId === currentUserId &&
      request.followingId === user.userId &&
      request.status === FOLLOW_STATUS.PENDING,
  );

  // 실제 친구 상태 확인
  const actualFollowStatus = followStatusData?.checkFollowStatus?.followStatus;

  // 팔로우 상태 결정 (요청이 pending이면 대기중, 아니면 실제 친구 상태)
  const displayFollowStatus = pendingRequest
    ? FOLLOW_STATUS.PENDING
    : actualFollowStatus;

  const goals: Goal[] = goalsData?.getAllGoalsByUserId || [];

  // 목표 클릭 핸들러
  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {
      id: goal.id,
      from: 'UserProfile',
    });
  };

  // 헤더 컴포넌트 렌더링
  const renderHeader = () => (
    <View style={styles.contentContainer}>
      {/* 프로필 정보 */}
      <ProfileHeader
        nickname={user.nickname}
        email={user.email}
        profileImage={user.profileImage}
        showCameraButton={false}
        isOwnProfile={false}
      />

      {/* 팔로우 버튼 - 자기 자신이 아니고 팔로우 상태가 없을 때만 표시 */}
      {!isOwnProfile && !displayFollowStatus && !followStatus && (
        <TouchableOpacity
          style={[styles.followButton, isLoading && styles.disabledButton]}
          onPress={handleFollowToggle}
          disabled={isLoading}>
          <Text style={styles.followButtonText}>
            {isLoading ? '처리 중...' : FOLLOW_BUTTON_TEXT.FOLLOW}
          </Text>
        </TouchableOpacity>
      )}

      {/* 팔로우 상태 표시 */}
      {!isOwnProfile && (displayFollowStatus || followStatus) && (
        <View
          style={[
            styles.followedStatus,
            (displayFollowStatus === FOLLOW_STATUS.PENDING ||
              followStatus === FOLLOW_STATUS.PENDING) &&
              styles.pendingStatus,
          ]}>
          <Text style={styles.followedStatusText}>
            {displayFollowStatus === FOLLOW_STATUS.PENDING ||
            followStatus === FOLLOW_STATUS.PENDING
              ? FOLLOW_STATUS_TEXT[FOLLOW_STATUS.PENDING]
              : displayFollowStatus === FOLLOW_STATUS.APPROVED
              ? FOLLOW_STATUS_TEXT[FOLLOW_STATUS.APPROVED]
              : displayFollowStatus === FOLLOW_STATUS.BLOCKED
              ? FOLLOW_STATUS_TEXT[FOLLOW_STATUS.BLOCKED]
              : '팔로우 중'}
          </Text>
        </View>
      )}

      {/* 목표 리스트 섹션 */}
      <View style={styles.goalsSection}>
        <Text style={styles.goalsSectionTitle}>
          {isOwnProfile ? '내 목표' : `${user.nickname}의 목표`}
        </Text>
        {goalsLoading ? (
          <ActivityIndicator style={styles.goalsLoading} />
        ) : (
          <GoalList
            goals={goals}
            onPressGoal={handleGoalPress}
            emptyText="등록된 목표가 없습니다."
            contentContainerStyle={styles.goalsList}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* 이미지 확대 모달 */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => {}}>
              <Image
                source={{uri: user.profileImage}}
                style={styles.expandedImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImageModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F8', // 민트 계열 배경
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#4ECDC4', // 민트 계열 그림자
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#B2DFDB', // 민트 계열 테두리
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#B2DFDB', // 민트 계열 배경
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4ECDC4', // 민트 계열 테두리
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4ECDC4', // 민트 계열 제목
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#2C3E50', // 진한 회색 텍스트
    fontWeight: '500',
  },
  followButton: {
    backgroundColor: '#4ECDC4', // 민트 계열 버튼
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#26A69A', // 민트 계열 그림자
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  followedStatus: {
    backgroundColor: '#27AE60', // 초록색 유지 (팔로우 상태)
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#27AE60',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  followedStatusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  pendingStatus: {
    backgroundColor: '#FF9800', // 대기중 상태일 때 다른 색상 적용
  },
  goalsSection: {
    flex: 1,
  },
  goalsSectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4ECDC4', // 민트 계열 제목
    marginBottom: 12,
  },
  goalsLoading: {
    marginTop: 10,
  },
  goalsList: {
    paddingBottom: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },
  profileImageContainer: {
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default UserProfileScreen;
