import {useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GET_INVITATIONS} from '../../queries/goal';

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
    autoApprove: boolean;
    createdAt: string;
    updatedAt: string;
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
    fetchPolicy: 'network-only',
    skip: !visible,
  });

  // 데이터 처리 - 보낸 요청과 받은 요청 분리
  useEffect(() => {
    if (data?.getInvitations && currentUserId) {
      const invitations = data.getInvitations;
      const sent = invitations.filter(
        (invitation: Invitation) => invitation.fromUserId === currentUserId,
      );
      const received = invitations.filter(
        (invitation: Invitation) => invitation.toUserId === currentUserId,
      );
      setSentInvitations(sent);
      setReceivedInvitations(received);
    }
  }, [data, currentUserId]);

  const handleInvitationPress = (invitation: Invitation) => {
    onClose(); // 뷰어 닫기
    navigation.navigate('InvitationDetail', {
      id: invitation.id, // invitationId가 아닌 id를 전달
    });
  };

  const renderInvitation = ({item}: {item: Invitation}) => {
    const isSent = item.fromUserId === currentUserId;
    const isReceived = item.toUserId === currentUserId;

    return (
      <TouchableOpacity
        style={styles.invitationItem}
        onPress={() => handleInvitationPress(item)}>
        <View style={styles.invitationHeader}>
          <Text style={styles.invitationTitle}>
            {isSent ? '보낸 요청' : '받은 요청'}
          </Text>
          <Text style={styles.invitationTime}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.goalTitle}>{item.goal.title}</Text>
        <Text style={styles.invitationMessage}>{item.message}</Text>
        <View style={styles.statusContainer}>
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
            {item.status === 'pending'
              ? '대기중'
              : item.status === 'accepted'
              ? '수락됨'
              : '거절됨'}
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

  const renderSection = (title: string, data: Invitation[]) => (
    <View style={styles.section}>
      {renderSectionHeader(title, data.length)}
      {data.map(item => (
        <View key={item.id}>{renderInvitation({item})}</View>
      ))}
    </View>
  );

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
            <Text style={styles.headerTitle}>초대 요청</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#2C3E50" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B9D" />
            </View>
          ) : (
            <FlatList
              data={[]}
              renderItem={() => null}
              ListHeaderComponent={
                <View>
                  {renderSection('받은 요청', receivedInvitations)}
                  {renderSection('보낸 요청', sentInvitations)}
                </View>
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>초대 요청이 없습니다.</Text>
                </View>
              }
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
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
    color: '#2C3E50',
  },
  sectionCount: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
  },
  invitationItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  invitationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invitationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B9D',
  },
  invitationTime: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  invitationMessage: {
    fontSize: 14,
    color: '#5A6C7D',
    lineHeight: 20,
    marginBottom: 8,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
  },
});

export default NotificationViewer;
