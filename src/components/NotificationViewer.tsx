import {useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GET_INVITATIONS} from '../queries/goal';
import {formatDate} from '../utils/dateUtils';

interface Invitation {
  id: string;
  invitationId: string;
  goalId: string;
  fromUserId: string;
  toUserId: string;
  type: string;
  status: string;
  message: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  goal: {
    id: string;
    goalId: string;
    title: string;
    description: string;
    stickerCount: number;
    mode: string;
    visibility: string;
    status: string;
    createdBy: string;
    creatorNickname: string;
    autoApprove: boolean;
    createdAt: string;
    updatedAt: string;
    isParticipant: boolean;
    participants: {
      userId: string;
      status: string;
      currentStickerCount: number;
      joinedAt: string;
    }[];
  };
  fromUser: {
    id: string;
    userId: string;
    email: string;
    nickname: string;
    profileImage?: string;
  };
  toUser: {
    id: string;
    userId: string;
    email: string;
    nickname: string;
    profileImage?: string;
  };
}

interface NotificationViewerProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationViewer: React.FC<NotificationViewerProps> = ({
  visible,
  onClose,
}) => {
  const navigation = useNavigation<any>();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [sentInvitations, setSentInvitations] = useState<Invitation[]>([]);
  const [receivedInvitations, setReceivedInvitations] = useState<Invitation[]>(
    [],
  );

  // 현재 사용자 ID 가져오기
  useEffect(() => {
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

    if (visible) {
      getCurrentUser();
    }
  }, [visible]);

  // 초대 요청 조회
  const {data, loading, error, refetch} = useQuery(GET_INVITATIONS, {
    fetchPolicy: 'no-cache',
    skip: !visible,
  });

  // 데이터 처리 - 보낸 요청과 받은 요청 분리
  useEffect(() => {
    if (data?.getInvitations && currentUserId) {
      const invitations = data.getInvitations || [];
      const sent = invitations.filter(
        (invitation: Invitation) => invitation?.fromUserId === currentUserId,
      );
      const received = invitations.filter(
        (invitation: Invitation) => invitation?.toUserId === currentUserId,
      );
      setSentInvitations(sent);
      setReceivedInvitations(received);
    }
  }, [data, currentUserId]);

  const handleInvitationPress = (invitation: Invitation) => {
    onClose(); // 뷰어 닫기
    if (invitation?.invitationId) {
      navigation.navigate('InvitationDetail', {
        id: invitation.invitationId,
      });
    }
  };

  const renderInvitation = ({item}: {item: Invitation}) => {
    const isSent = item.fromUserId === currentUserId;
    const isReceived = item.toUserId === currentUserId;

    const getStatusEmoji = (status: string) => {
      switch (status) {
        case 'pending':
          return '⏰';
        case 'accepted':
          return '✅';
        case 'rejected':
          return '❌';
        case 'unknown':
          return '❓';
        default:
          return '❓';
      }
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pending':
          return '기다리는 중이에요!';
        case 'accepted':
          return '목표에 참여했어요! 🎉';
        case 'rejected':
          return '아쉽지만 거절되었어요';
        case 'unknown':
          return '상태를 확인할 수 없어요';
        default:
          return '알 수 없어요';
      }
    };

    return (
      <TouchableOpacity
        style={styles.invitationItem}
        onPress={() => handleInvitationPress(item)}>
        <View style={styles.invitationHeader}>
          <View style={styles.titleContainer}>
            <View style={styles.titleWithProfile}>
              {isSent ? (
                // 보낸 요청인 경우: 받는 사람의 프로필 이미지와 닉네임
                <>
                  <Image
                    source={
                      item.toUser?.profileImage
                        ? {uri: item.toUser.profileImage}
                        : require('../../assets/default-profile.jpg')
                    }
                    style={styles.smallProfileImage}
                  />
                  <Text style={styles.invitationTitle}>
                    {item.toUser?.nickname || '알 수 없는 친구'}에게 보낸 참여
                    요청
                  </Text>
                </>
              ) : (
                // 받은 요청인 경우: 보낸 사람의 프로필 이미지와 닉네임
                <>
                  <Image
                    source={
                      item.fromUser?.profileImage
                        ? {uri: item.fromUser.profileImage}
                        : require('../../assets/default-profile.jpg')
                    }
                    style={styles.smallProfileImage}
                  />
                  <Text style={styles.invitationTitle}>
                    {item.fromUser?.nickname || '알 수 없는 친구'}로부터 온 참여
                    요청
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.goalContainer}>
          <Text style={styles.goalEmoji}>🏅</Text>
          <Text style={styles.goalTitle}>
            {item.goal?.title || '알 수 없는 목표'}
          </Text>
        </View>

        <Text style={styles.invitationMessage}>
          {item.message || '메시지가 없습니다.'}
        </Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusEmoji}>
              {getStatusEmoji(item.status || 'unknown')}
            </Text>
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === 'pending'
                      ? '#F39C12'
                      : item.status === 'accepted'
                      ? '#27AE60'
                      : '#E74C3C',
                },
              ]}>
              {getStatusText(item.status || 'unknown')}
            </Text>
          </View>
          <Text style={styles.invitationTime}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = (title: string, count: number) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionCount}>({count})</Text>
    </View>
  );

  const renderSection = (title: string, data: Invitation[]) => {
    return (
      <View style={styles.section}>
        {renderSectionHeader(title, data.length)}
        {data.length > 0 ? (
          data.map(item => (
            <View key={item.id}>{renderInvitation({item})}</View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>
              {title.includes('받은')
                ? '아직 참여 요청이 없어요!'
                : '아직 참여 요청을 보내지 않았어요!'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}>
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerEmoji}>📬</Text>
              <Text style={styles.headerTitle}>목표 참여 요청함</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#20B2AA" />
            </View>
          ) : (
            <FlatList
              data={[]}
              renderItem={() => null}
              ListHeaderComponent={
                <View>
                  {renderSection('📥 나에게 온 참여 요청', receivedInvitations)}
                  {renderSection('📤 내가 보낸 참여 요청', sentInvitations)}
                </View>
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  closeButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#20B2AA',
  },
  sectionCount: {
    fontSize: 14,
    color: '#20B2AA',
    marginLeft: 8,
  },
  invitationItem: {
    backgroundColor: '#F0FFFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E0F8F0',
    shadowColor: '#20B2AA',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  invitationHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWithProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallProfileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#20B2AA',
  },
  invitationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#20B2AA',
    flex: 1,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#20B2AA',
    flex: 1,
  },
  invitationMessage: {
    fontSize: 14,
    color: '#5A6C7D',
    lineHeight: 20,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0F8F0',
  },
  invitationTime: {
    fontSize: 12,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#20B2AA',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default NotificationViewer;
