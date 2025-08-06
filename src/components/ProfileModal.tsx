import {useMutation, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FOLLOW_BUTTON_TEXT,
  FOLLOW_STATUS,
  FOLLOW_STATUS_TEXT,
} from '../constants/followStatus';
import {GET_GOALS_BY_USER_ID} from '../queries/goal';
import {CREATE_FOLLOW} from '../queries/user';
import GoalList, {Goal} from './GoalList';

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  followStatus?: string; // 'pending', 'approved', 'mutual'
}

interface ProfileModalProps {
  visible: boolean;
  user: User | null;
  onClose: () => void;
  currentUserId: string; // 현재 로그인한 사용자 ID
  status?: string; // 초기 팔로우 상태
  onFollowStatusChange?: (userId: string, isFollowed: boolean) => void; // 팔로우 상태 변경 콜백
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  user,
  onClose,
  currentUserId,
  status,
  onFollowStatusChange,
}) => {
  const navigation = useNavigation<any>();
  const [followStatus, setFollowStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 팔로우 생성 뮤테이션
  const [createFollow] = useMutation(CREATE_FOLLOW, {
    onCompleted: data => {
      const status = data.createFollow.status;
      setFollowStatus(status);
      setIsLoading(false);

      // 부모 컴포넌트에 팔로우 상태 변경 알림
      if (onFollowStatusChange && user) {
        const isFollowed = status === 'approved' || status === 'pending';
        onFollowStatusChange(user.userId, isFollowed);
      }

      if (status === 'approved') {
        Alert.alert('😁', '맞팔로우가 되었습니다!');
      } else {
        Alert.alert('😁', '팔로우 요청을 보냈습니다.');
      }
    },
    onError: error => {
      setIsLoading(false);
      Alert.alert('😣', '팔로우 요청에 실패했습니다.');
      console.error('Create follow error:', error);
    },
  });

  // 사용자 데이터의 팔로우 상태로 초기화
  useEffect(() => {
    if (user) {
      // props로 전달된 status가 있으면 우선 사용
      if (status) {
        setFollowStatus(status);
      } else if (user.followStatus) {
        setFollowStatus(user.followStatus);
      } else if (user.followStatus) {
        setFollowStatus(user.followStatus);
      } else {
        setFollowStatus('');
      }
    }
  }, [user, status]);

  const handleFollowToggle = async () => {
    if (!user || !currentUserId || isLoading || followStatus) return;

    setIsLoading(true);

    // 팔로우만 가능 (취소 기능 비활성화)
    await createFollow({
      variables: {
        input: {
          followerId: currentUserId,
          followingId: user.userId,
        },
      },
    });
  };

  // 팔로우 상태에 따른 표시 텍스트
  const getFollowStatusText = () => {
    switch (followStatus) {
      case FOLLOW_STATUS.PENDING:
        return FOLLOW_STATUS_TEXT[FOLLOW_STATUS.PENDING];
      case FOLLOW_STATUS.APPROVED:
        return FOLLOW_STATUS_TEXT[FOLLOW_STATUS.APPROVED];
      default:
        return '팔로우 중';
    }
  };

  // 팔로우 상태에 따른 배경색
  const getFollowStatusStyle = () => {
    switch (followStatus) {
      case 'pending':
        return styles.pendingStatus;
      case 'approved':
        return styles.mutualFollowStatus;
      default:
        return styles.followedStatus;
    }
  };

  // 목표 클릭 핸들러
  const handleGoalPress = (goal: Goal) => {
    onClose(); // 프로필 모달 닫기
    navigation.navigate('GoalDetail', {
      id: goal.id,
      from: 'ProfileModal',
    });
  };

  // 자기 자신의 프로필인지 확인
  const isOwnProfile = user?.userId === currentUserId;

  // 사용자의 목표 조회
  const {data: goalsData, loading: goalsLoading} = useQuery(
    GET_GOALS_BY_USER_ID,
    {
      variables: {userId: user?.userId || ''},
      skip: !user?.userId,
    },
  );

  const goals: Goal[] = goalsData?.getGoalsByUserId || [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.profileSection}>
            <Image
              source={
                user?.profileImage
                  ? {uri: user.profileImage}
                  : require('../../../assets/default-profile.jpg')
              }
              style={styles.profileImage}
            />
            <Text style={styles.nickname}>{user?.nickname}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          {/* 팔로우 버튼 - 자기 자신이 아니고 팔로우하지 않은 경우에만 표시 */}
          {!isOwnProfile && !followStatus && (
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
          {!isOwnProfile && followStatus && (
            <View style={getFollowStatusStyle()}>
              <Text style={styles.followedStatusText}>
                {getFollowStatusText()}
              </Text>
            </View>
          )}

          {/* 목표 리스트 섹션 */}
          <View style={styles.goalsSection}>
            <Text style={styles.goalsSectionTitle}>
              {isOwnProfile ? '내 목표' : `${user?.nickname}의 목표`}
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

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E6ED',
    marginBottom: 16,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  infoSection: {
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '600',
  },
  followButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  unfollowButton: {
    backgroundColor: '#E74C3C',
  },
  disabledButton: {
    opacity: 0.6,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  unfollowButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#95A5A6',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  followedStatus: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  followedStatusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  goalsSection: {
    width: '100%',
    flex: 1,
    marginBottom: 24,
  },
  goalsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  goalsLoading: {
    marginTop: 10,
  },
  goalsList: {
    paddingHorizontal: 0,
  },
  pendingStatus: {
    backgroundColor: '#F39C12',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  mutualFollowStatus: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default ProfileModal;
