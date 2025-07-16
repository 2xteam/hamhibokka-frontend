import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {APPROVE_FOLLOW, GET_FOLLOWS} from '../../queries/user';
import ProfileModal from './ProfileModal';
import UserList, {User} from './UserList';

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

interface FollowModalProps {
  visible: boolean;
  onClose: () => void;
  currentUserId: string;
}

const FollowModal: React.FC<FollowModalProps> = ({
  visible,
  onClose,
  currentUserId,
}) => {
  const [followsList, setFollowsList] = useState<Follow[]>([]);
  const [actualCurrentUserId, setActualCurrentUserId] = useState<string>('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 모든 팔로우 데이터 조회
  const {
    data: followsData,
    loading: followsLoading,
    refetch: refetchFollows,
  } = useQuery(GET_FOLLOWS, {
    variables: {status: null},
    fetchPolicy: 'network-only', // 캐시 무시하고 항상 네트워크에서 새로 가져오기
  });

  // 현재 사용자 ID 가져오기 및 데이터 새로고침
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

    if (visible) {
      getCurrentUser();
      // 모달이 열릴 때마다 데이터 새로고침
      refetchFollows();
    }
  }, [visible, refetchFollows]);

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
          isFollowed: isApproved,
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
          isFollowed: isApproved,
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
    // 사용자 클릭 시 프로필 모달 띄우기
    setSelectedUser(user);
    setProfileModalVisible(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalVisible(false);
    setSelectedUser(null);
  };

  // 팔로우 상태 변경 처리
  const handleFollowStatusChange = (userId: string, isFollowed: boolean) => {
    // 팔로우 상태가 변경되면 리스트도 업데이트
    setFollowsList(prevFollows =>
      prevFollows.map(follow => {
        if (follow.followerId === userId || follow.followingId === userId) {
          return {
            ...follow,
            status: isFollowed ? 'approved' : 'pending',
          };
        }
        return follow;
      }),
    );
  };

  const handleApproveFollow = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user && (user as any).followData) {
      handleApproveFollowById((user as any).followData.id);
    }
  };

  const handleApproveFollowById = (followId: string) => {
    Alert.alert('팔로우 승인', '이 사용자의 팔로우 요청을 승인하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '승인',
        onPress: () => {
          approveFollow({variables: {followId}});
        },
      },
    ]);
  };

  const users = convertFollowsToUsers();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>친구 관리</Text>

          {/* 리스트 */}
          {followsLoading ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <View style={styles.listContainer}>
              {/* 디버깅 정보 */}
              <Text style={styles.debugInfo}>
                총 {users.length}개의 팔로우 데이터
              </Text>
              <UserList
                users={users}
                onPressUser={handleUserPress}
                emptyText="팔로우 데이터가 없습니다."
                contentContainerStyle={styles.listContent}
                showFollowStatus={false}
                showApproveButton={true}
                onApproveFollow={handleApproveFollow}
              />
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로필 모달 */}
      <ProfileModal
        visible={profileModalVisible}
        user={selectedUser}
        onClose={handleCloseProfileModal}
        currentUserId={actualCurrentUserId}
        onFollowStatusChange={handleFollowStatusChange}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    height: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
    minHeight: 200,
  },
  listContent: {
    paddingBottom: 20,
  },
  loading: {
    marginVertical: 40,
  },
  closeButton: {
    backgroundColor: '#95A5A6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  debugInfo: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default FollowModal;
