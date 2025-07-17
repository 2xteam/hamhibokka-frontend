import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CREATE_GOAL_JOIN_REQUEST,
  GET_GOAL,
  RECEIVE_STICKER,
} from '../queries/goal';

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
  if (mode === 'challenger_recruitment') return '챌린저 모집';
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
  const {data, loading, error, refetch} = useQuery(GET_GOAL, {variables: {id}});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [createJoinRequest, {loading: joinLoading}] = useMutation(
    CREATE_GOAL_JOIN_REQUEST,
  );
  const [joinMessage, setJoinMessage] = useState('');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [giveStickerCount, setGiveStickerCount] = useState('1');
  const [receiveSticker, {loading: giveStickerLoading}] =
    useMutation(RECEIVE_STICKER);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (from === 'CreateGoal') {
        e.preventDefault();
        navigation.navigate('Main', {screen: 'Goals'});
      }
    });
    return unsubscribe;
  }, [navigation, from]);

  React.useEffect(() => {
    (async () => {
      try {
        const userData = await AsyncStorage.getItem('@hamhibokka_user');
        if (userData) {
          const user = JSON.parse(userData);
          setCurrentUserId(user.userId);
        }
      } catch (e) {
        setCurrentUserId(null);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B9D" />
        <Text style={styles.loadingText}>
          목표 정보를 불러오는 중이에요! ✨
        </Text>
      </View>
    );
  }
  if (error || !data?.getGoal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>목표 정보를 불러올 수 없어요 😢</Text>
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
      Alert.alert('🎉', '참여 요청이 완료되었어요!');
    } catch (e: any) {
      // 에러 메시지 추출
      let msg = '참여 요청에 실패했어요.';
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
          <Text style={styles.title}>🥇 {goal.title}</Text>
          <Text style={styles.description}>
            {goal.description || '설명이 없어요 😊'}
          </Text>
        </View>
        {/* 주요 정보 */}
        <View style={styles.cardSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⭐ 스티커 목표</Text>
            <Text style={styles.infoValue}>{goal.stickerCount}개</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📊 상태</Text>
            <Text style={styles.infoValue}>{getStatusLabel(goal.status)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🕹️ 모드</Text>
            <Text style={styles.infoValue}>{getModeLabel(goal.mode)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>👑 생성자</Text>
            <Text style={styles.infoValue}>{goal.creatorNickname || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🤝 참가자 수</Text>
            <Text style={styles.infoValue}>
              {goal.participants?.length ?? 0}명
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 생성일</Text>
            <Text style={styles.infoValue}>{formatDate(goal.createdAt)}</Text>
          </View>
        </View>
        {/* 참가자 목록 */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>🤝 참가자 목록</Text>
          {goal.participants && goal.participants.length > 0 ? (
            goal.participants.map((p: any, idx: number) => (
              <TouchableOpacity
                key={p.id || p.nickname || idx}
                style={styles.participantItem}
                onPress={() => handleParticipantPress(p)}>
                <Text style={styles.participantName}>
                  👬 {p.nickname || p.id || '이름없음'}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>아직 참가자가 없어요 😊</Text>
          )}
        </View>
        {/* 참가자 현황 모달 */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentChild}>
              <Text style={styles.modalTitle}>👬 참가자 현황</Text>
              {selectedParticipant ? (
                <>
                  <View style={styles.avatarRow}>
                    <Image
                      source={
                        selectedParticipant.profileImage
                          ? {uri: selectedParticipant.profileImage}
                          : require('../../assets/default-profile.jpg')
                      }
                      style={styles.avatarImage}
                    />
                  </View>
                  <Text style={styles.modalLabel}>
                    닉네임:{' '}
                    <Text style={{color: '#FF6B9D', fontWeight: 'bold'}}>
                      {selectedParticipant.nickname || '-'}
                    </Text>
                  </Text>

                  <View style={styles.stickerRow}>
                    <Text style={styles.stickerCountText}>
                      현재 스티커:{' '}
                      <Text style={{color: '#FFD700', fontWeight: 'bold'}}>
                        {selectedParticipant.currentStickerCount ?? 0}개
                      </Text>
                    </Text>
                  </View>

                  {/* 스티커 부여 현황(동그란 아이콘으로 시각화) */}
                  <View style={styles.stickerIconRow}>
                    {Array.from({length: goal.stickerCount}).map((_, idx) => (
                      <Text
                        key={idx}
                        style={{
                          fontSize: 32,
                          marginHorizontal: 2,
                          opacity:
                            idx < (selectedParticipant.currentStickerCount ?? 0)
                              ? 1
                              : 0.3,
                        }}>
                        {idx < (selectedParticipant.currentStickerCount ?? 0)
                          ? '🌟'
                          : '⭐️'}
                      </Text>
                    ))}
                  </View>
                  {/* goal 생성자일 때만 스티커 부여 UI 노출, 단 목표 달성 시에는 노출 X */}
                  {goal.createdBy &&
                    currentUserId &&
                    goal.createdBy === currentUserId &&
                    selectedParticipant.currentStickerCount !== undefined &&
                    selectedParticipant.currentStickerCount <
                      goal.stickerCount && (
                      <View style={styles.giveStickerBox}>
                        <Text style={styles.giveStickerLabel}>
                          ⭐ 스티커 부여
                        </Text>
                        <View style={styles.giveStickerRow}>
                          <TextInput
                            style={styles.giveStickerInput}
                            value={giveStickerCount}
                            onChangeText={setGiveStickerCount}
                            keyboardType="numeric"
                            maxLength={2}
                          />
                          <TouchableOpacity
                            style={styles.giveStickerBtn}
                            onPress={async () => {
                              const current =
                                selectedParticipant.currentStickerCount ?? 0;
                              const give = Number(giveStickerCount) || 1;
                              if (current + give > goal.stickerCount) {
                                Alert.alert(
                                  '스티커 목표 초과',
                                  '스티커 목표 개수를 초과할 수 없어요!',
                                );
                                return;
                              }
                              try {
                                await receiveSticker({
                                  variables: {
                                    input: {
                                      goalId: goal.goalId,
                                      toUserId:
                                        selectedParticipant.userId ||
                                        selectedParticipant.id,
                                      stickerCount: give,
                                    },
                                  },
                                });
                                Alert.alert(
                                  '🎉',
                                  `${giveStickerCount}개 스티커를 부여했어요!`,
                                );
                                setGiveStickerCount('1');
                                setModalVisible(false);
                                if (typeof refetch === 'function')
                                  await refetch();
                              } catch (e: any) {
                                let msg = '스티커 부여에 실패했어요.';
                                if (e?.graphQLErrors?.[0]?.message)
                                  msg = e.graphQLErrors[0].message;
                                else if (e?.message) msg = e.message;
                                Alert.alert('실패', msg);
                              }
                            }}
                            disabled={giveStickerLoading}>
                            <Text style={styles.giveStickerBtnText}>
                              {giveStickerLoading ? '부여 중...' : '부여'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                  {/* 참여자가 본인이고 목표 달성 시 축하 UI 노출 */}
                  {selectedParticipant.userId === currentUserId &&
                    selectedParticipant.currentStickerCount ===
                      goal.stickerCount && (
                      <View style={styles.celebrateBox}>
                        <Text style={styles.celebrateEmoji}>🎉🎊</Text>
                        <Text style={styles.celebrateTitle}>목표 달성!</Text>
                        <Text style={styles.celebrateText}>
                          축하해요! 모든 스티커를 모았어요! 🥳
                        </Text>
                      </View>
                    )}
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
      {/* 목표 참여 요청 플로팅 버튼 - personal 모드가 아닐 때만 표시 */}
      {goal.mode !== 'personal' && (
        <TouchableOpacity
          style={styles.fabJoin}
          onPress={handleJoinRequest}
          disabled={joinLoading}>
          <Text style={styles.fabJoinText}>
            {joinLoading ? '요청 중...' : '🥇 참여 하기'}
          </Text>
        </TouchableOpacity>
      )}
      {/* 참여 메시지 입력 모달 */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💬 참여 요청 메시지</Text>
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
    backgroundColor: '#FFF5F7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F7',
  },
  loadingText: {
    fontSize: 18,
    color: '#FF6B9D',
    marginTop: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B9D',
    textAlign: 'center',
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: '#FFE5F0',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#8E44AD',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#FFE5F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF8FA',
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#8E44AD',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 16,
  },
  participantItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#FFE5F0',
    backgroundColor: '#FFF8FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  participantName: {
    fontSize: 16,
    color: '#8E44AD',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255,107,157,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: 320,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFE5F0',
  },
  modalContentChild: {
    backgroundColor: '#FFF8FA',
    borderRadius: 28,
    padding: 32,
    width: 340,
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#FFE5F0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6B9D',
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 12,
    color: '#8E44AD',
    fontWeight: '600',
  },
  modalCloseBtn: {
    marginTop: 24,
    backgroundColor: '#FF6B9D',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fabJoin: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#FF6B9D',
    borderRadius: 32,
    width: 200,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fabJoinText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    width: '100%',
    borderWidth: 3,
    borderColor: '#FFE5F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFF8FA',
    marginTop: 12,
    color: '#8E44AD',
  },
  stickerRow: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  stickerCountText: {
    fontSize: 16,
    color: '#8E44AD',
    fontWeight: '600',
  },
  giveStickerBox: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF8FA',
    borderRadius: 16,
    padding: 16,
  },
  giveStickerLabel: {
    fontSize: 18,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  giveStickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  giveStickerInput: {
    width: 56,
    height: 44,
    borderWidth: 3,
    borderColor: '#FFE5F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    marginRight: 12,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: '#8E44AD',
  },
  giveStickerBtn: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  giveStickerBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stickerIconRow: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  celebrateBox: {
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#FFE5F0',
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  celebrateEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrateTitle: {
    fontSize: 22,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  celebrateText: {
    fontSize: 16,
    color: '#8E44AD',
    fontWeight: '600',
  },
  avatarRow: {
    marginBottom: 8,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD1DC',
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE5F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD1DC',
  },
  avatarEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  avatarText: {
    fontSize: 18,
    color: '#FF6B9D',
    fontWeight: 'bold',
  },
});

export default GoalDetailScreen;
