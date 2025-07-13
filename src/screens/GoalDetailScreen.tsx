import {useMutation, useQuery} from '@apollo/client';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {CREATE_GOAL_JOIN_REQUEST, GET_GOAL} from '../queries/goal';

interface GoalDetailParams {
  id: string;
  from?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    '0',
  )}.${String(d.getDate()).padStart(2, '0')}`;
}

function getModeLabel(mode?: string) {
  if (mode === 'personal') return '개인';
  if (mode === 'group') return '그룹';
  return mode || '-';
}
function getStatusLabel(status?: string) {
  if (status === 'active') return '진행 중';
  if (status === 'completed') return '완료';
  if (status === 'archived') return '보관됨';
  return status || '-';
}

const GoalDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, GoalDetailParams>, string>>();
  const navigation = useNavigation<any>();
  const {id, from} = route.params || {};
  const {data, loading, error} = useQuery(GET_GOAL, {variables: {id}});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [createJoinRequest, {loading: joinLoading}] = useMutation(
    CREATE_GOAL_JOIN_REQUEST,
  );
  const [joinMessage, setJoinMessage] = useState('');
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (from === 'CreateGoal') {
        e.preventDefault();
        navigation.navigate('Main', {screen: 'Goals'});
      }
    });
    return unsubscribe;
  }, [navigation, from]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }
  if (error || !data?.getGoal) {
    return (
      <View style={styles.centered}>
        <Text>목표 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }
  const goal = data.getGoal;

  const handleParticipantPress = (participant: any) => {
    setSelectedParticipant(participant);
    setModalVisible(true);
  };

  const handleJoinRequest = () => {
    setJoinModalVisible(true);
  };

  const handleJoinConfirm = async () => {
    try {
      await createJoinRequest({
        variables: {
          input: {
            goalId: goal.goalId,
            message: joinMessage.trim() || '참가 요청해요!',
          },
        },
      });
      setJoinModalVisible(false);
      setJoinMessage('');
      Alert.alert('참여 요청이 완료되었습니다!');
    } catch (e: any) {
      // 에러 메시지 추출
      let msg = '참여 요청에 실패했습니다.';
      if (e?.graphQLErrors?.[0]?.message) {
        msg = e.graphQLErrors[0].message;
      } else if (e?.message) {
        msg = e.message;
      }
      Alert.alert('참여 요청 실패', msg, [
        {
          text: '확인',
          onPress: () => setJoinModalVisible(false),
        },
      ]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 제목/설명 */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.description}>
            {goal.description || '설명 없음'}
          </Text>
        </View>
        {/* 주요 정보 */}
        <View style={styles.cardSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>스티커 목표</Text>
            <Text style={styles.infoValue}>{goal.stickerCount}개</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>상태</Text>
            <Text style={styles.infoValue}>{getStatusLabel(goal.status)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>모드</Text>
            <Text style={styles.infoValue}>{getModeLabel(goal.mode)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>생성자</Text>
            <Text style={styles.infoValue}>{goal.creatorNickname || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>참가자 수</Text>
            <Text style={styles.infoValue}>
              {goal.participants?.length ?? 0}명
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>생성일</Text>
            <Text style={styles.infoValue}>{formatDate(goal.createdAt)}</Text>
          </View>
        </View>
        {/* 참가자 목록 */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>참가자 목록</Text>
          {goal.participants && goal.participants.length > 0 ? (
            goal.participants.map((p: any, idx: number) => (
              <TouchableOpacity
                key={p.id || p.nickname || idx}
                style={styles.participantItem}
                onPress={() => handleParticipantPress(p)}>
                <Text style={styles.participantName}>
                  {p.nickname || p.id || '이름없음'}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>참가자가 없습니다.</Text>
          )}
        </View>
        {/* 참가자 현황 모달 */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>참가자 현황</Text>
              {selectedParticipant ? (
                <>
                  <Text style={styles.modalLabel}>
                    닉네임: {selectedParticipant.nickname || '-'}
                  </Text>
                  <Text style={styles.modalLabel}>
                    ID: {selectedParticipant.id || '-'}
                  </Text>
                  {/* 추가 현황 정보가 있다면 여기에 표시 */}
                </>
              ) : null}
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* 목표 참여 요청 플로팅 버튼 */}
      <TouchableOpacity
        style={styles.fabJoin}
        onPress={handleJoinRequest}
        disabled={joinLoading}>
        <Text style={styles.fabJoinText}>
          {joinLoading ? '요청 중...' : '목표 참여 요청'}
        </Text>
      </TouchableOpacity>
      {/* 참여 메시지 입력 모달 */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>참여 요청 메시지</Text>
            <TextInput
              style={styles.input}
              placeholder="참여 메시지를 입력하세요 (선택)"
              value={joinMessage}
              onChangeText={setJoinMessage}
              maxLength={100}
            />
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <TouchableOpacity
                style={[
                  styles.modalCloseBtn,
                  {backgroundColor: '#BDC3C7', marginRight: 8},
                ]}
                onPress={() => setJoinModalVisible(false)}>
                <Text style={styles.modalCloseText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={handleJoinConfirm}
                disabled={joinLoading}>
                <Text style={styles.modalCloseText}>
                  {joinLoading ? '요청 중...' : '확인'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#95A5A6',
  },
  infoValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  participantItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  participantName: {
    fontSize: 15,
    color: '#2C3E50',
  },
  emptyText: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 15,
    marginBottom: 8,
  },
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fabJoin: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#F39C12',
    borderRadius: 28,
    width: 180,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F39C12',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabJoinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E6ED',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#F8F9FA',
    marginTop: 8,
  },
});

export default GoalDetailScreen;
