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
import {Loading} from '../components/common';
import {
  BUTTON_TEXTS,
  COLORS,
  DEFAULT_VALUES,
  EMOJIS,
  FOLLOW_STATUS,
  GOAL_MODE_LABELS,
  GOAL_MODES,
  GOAL_STATUS,
  GOAL_STATUS_LABELS,
  NUMBERS,
} from '../constants';
import {
  CREATE_GOAL_JOIN_REQUEST,
  GET_GOAL,
  RECEIVE_STICKER,
} from '../queries/goal';
import {CHECK_FOLLOW_STATUS} from '../queries/user';

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
  if (mode === GOAL_MODES.PERSONAL)
    return GOAL_MODE_LABELS[GOAL_MODES.PERSONAL];
  if (mode === GOAL_MODES.CHALLENGER_RECRUITMENT)
    return GOAL_MODE_LABELS[GOAL_MODES.CHALLENGER_RECRUITMENT];
  return '목표';
}

function getStatusLabel(status?: string) {
  if (status === GOAL_STATUS.ACTIVE)
    return GOAL_STATUS_LABELS[GOAL_STATUS.ACTIVE];
  if (status === GOAL_STATUS.COMPLETED)
    return GOAL_STATUS_LABELS[GOAL_STATUS.COMPLETED];
  if (status === GOAL_STATUS.ARCHIVED)
    return GOAL_STATUS_LABELS[GOAL_STATUS.ARCHIVED];
  return '알 수 없음';
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
  const [giveStickerCount, setGiveStickerCount] = useState<string>(
    DEFAULT_VALUES.STICKER_COUNT,
  );
  const [receiveSticker, {loading: giveStickerLoading}] =
    useMutation(RECEIVE_STICKER);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 팔로우 상태 확인 쿼리 - 항상 호출 (조건부 렌더링 이전)
  const {data: followData, refetch: refetchFollowStatus} = useQuery(
    CHECK_FOLLOW_STATUS,
    {
      variables: {
        followerId: currentUserId || '',
        followingId: data?.getGoal?.createdBy || '',
      },
      skip: !currentUserId || !data?.getGoal?.createdBy,
    },
  );

  // 화면이 포커스될 때마다 팔로우 상태 새로고침
  useFocusEffect(
    React.useCallback(() => {
      if (currentUserId && data?.getGoal?.createdBy) {
        refetchFollowStatus();
      }
    }, [currentUserId, data?.getGoal?.createdBy, refetchFollowStatus]),
  );

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
      <Loading variant="fullscreen" message="목표 정보를 불러오는 중이에요!" />
    );
  }
  if (error || !data?.getGoal) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          목표 정보를 불러올 수 없어요 {EMOJIS.ERROR}
        </Text>
      </View>
    );
  }
  const goal = data.getGoal;

  // 로그인한 사용자가 이미 참여하고 있는지 확인
  const isUserParticipating = goal.participants?.some(
    (participant: any) => participant.userId === currentUserId,
  );

  const handleParticipantPress = (participant: any) => {
    setSelectedParticipant(participant);
    setModalVisible(true);
  };

  const handleJoinRequest = () => {
    // 자기 자신의 목표인지 확인
    if (goal.createdBy === currentUserId) {
      setJoinModalVisible(true);
      return;
    }

    // 팔로우 상태 확인
    const followStatus = followData?.checkFollowStatus?.followStatus;
    const isFollowing =
      followStatus === FOLLOW_STATUS.APPROVED ||
      followStatus === FOLLOW_STATUS.MUTUAL;

    // 팔로우 상태가 아니면 친구 요청 안내
    if (!isFollowing) {
      Alert.alert('친구가 아니에요 😊', '먼저 친구 요청을 해보세요!', [
        {
          text: BUTTON_TEXTS.CANCEL,
          style: 'cancel',
        },
        {
          text: '프로필 보기',
          onPress: () => {
            // 생성자 프로필로 이동
            navigation.navigate('UserProfile', {
              user: {
                id: goal.createdBy,
                userId: goal.createdBy,
                nickname: goal.creatorNickname || '알 수 없음',
              },
            });
          },
        },
      ]);
      return;
    }

    // 팔로우 상태이면 모달 띄우기
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
      Alert.alert(EMOJIS.SUCCESS, '참여 요청이 완료되었어요!');
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
          text: BUTTON_TEXTS.CONFIRM,
          onPress: () => setJoinModalVisible(false),
        },
      ]);
    }
  };

  // 내가 만든 목표일 때 바로 참여하는 함수
  const handleDirectJoin = async () => {
    try {
      await createJoinRequest({
        variables: {
          input: {
            goalId: goal.goalId,
            message: '', // 메시지 없이 참여
          },
        },
      });
      Alert.alert(EMOJIS.SUCCESS, '목표에 참여했어요!');
      // 목표 상세 페이지 리로드
      if (typeof refetch === 'function') {
        await refetch();
      }
    } catch (e: any) {
      let msg = '참여에 실패했어요.';
      if (e?.graphQLErrors?.[0]?.message) msg = e.graphQLErrors[0].message;
      else if (e?.message) msg = e.message;
      Alert.alert('참여 실패', msg);
    }
  };

  // 내가 만든 목표인지 확인
  const isMyGoal =
    goal.createdBy && currentUserId && goal.createdBy === currentUserId;

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 제목/설명 */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>
            {EMOJIS.GOAL} {goal.title}
          </Text>
          <Text style={styles.description}>
            {goal.description || '설명이 없어요 😊'}
          </Text>
        </View>
        {/* 주요 정보 */}
        <View style={styles.cardSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{EMOJIS.STICKER} 스티커 목표</Text>
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
            <Text style={styles.infoLabel}>{EMOJIS.USER} 만든 사람</Text>
            <Text style={styles.infoValue}>{goal.creatorNickname || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{EMOJIS.GROUP} 참가자 수</Text>
            <Text style={styles.infoValue}>
              {goal.participants?.length ?? 0}명
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 만든 날</Text>
            <Text style={styles.infoValue}>{formatDate(goal.createdAt)}</Text>
          </View>
        </View>
        {/* 참가자 목록 */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionTitle}>{EMOJIS.GROUP} 참가자 목록</Text>
          {goal.participants && goal.participants.length > 0 ? (
            goal.participants.map((p: any, idx: number) => (
              <TouchableOpacity
                key={p.id || p.nickname || idx}
                style={styles.participantItem}
                onPress={() => handleParticipantPress(p)}>
                <Text style={styles.participantName}>
                  {EMOJIS.PARTICIPANT} {p.nickname || p.id || '이름없음'}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>
              아직 참가자가 없어요 {EMOJIS.ERROR}
            </Text>
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
              <Text style={styles.modalTitle}>{EMOJIS.GROUP} 참가자 현황</Text>
              {selectedParticipant ? (
                <>
                  <TouchableOpacity
                    style={styles.profileClickable}
                    onPress={() => {
                      setModalVisible(false);
                      // 나의 계정인지 확인
                      if (selectedParticipant.userId === currentUserId) {
                        // 나의 계정이면 Main 탭의 Profile로 이동
                        navigation.navigate('Main', {screen: 'Profile'});
                      } else {
                        // 타인의 계정이면 UserProfile 스크린으로 이동
                        navigation.navigate('UserProfile', {
                          user: {
                            id: selectedParticipant.userId,
                            userId: selectedParticipant.userId,
                            nickname:
                              selectedParticipant.nickname || '알 수 없음',
                            email: selectedParticipant.email || '',
                            profileImage: selectedParticipant.profileImage,
                          },
                        });
                      }
                    }}>
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
                      <Text style={{color: COLORS.PRIMARY, fontWeight: 'bold'}}>
                        {selectedParticipant.nickname || '-'}
                      </Text>
                    </Text>
                  </TouchableOpacity>

                  {/* 스티커 부여 현황(한 줄에 최대 5개씩, 3줄이 넘으면 스크롤) */}
                  <View style={styles.stickerContainer}>
                    <Text style={styles.stickerTitle}>받은 스티커</Text>
                    <View style={styles.stickerScrollContainer}>
                      <ScrollView
                        style={styles.stickerScrollView}
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}
                        indicatorStyle="white">
                        <View style={styles.stickerGrid}>
                          {Array.from({length: goal.stickerCount}).map(
                            (_, idx) => (
                              <View key={idx} style={styles.stickerItem}>
                                <Text
                                  style={[
                                    styles.stickerIcon,
                                    {
                                      opacity:
                                        idx <
                                        (selectedParticipant.currentStickerCount ??
                                          0)
                                          ? 1
                                          : 0.3,
                                    },
                                  ]}>
                                  {idx <
                                  (selectedParticipant.currentStickerCount ?? 0)
                                    ? EMOJIS.COMPLETED_STICKER
                                    : EMOJIS.STICKER}
                                </Text>
                              </View>
                            ),
                          )}
                        </View>
                      </ScrollView>
                    </View>
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
                          {EMOJIS.STICKER} 스티커 붙이기
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
                                  EMOJIS.SUCCESS,
                                  `${giveStickerCount}개 스티커를 붙였어요!`,
                                );
                                setGiveStickerCount(
                                  DEFAULT_VALUES.STICKER_COUNT,
                                );
                                setModalVisible(false);
                                if (typeof refetch === 'function')
                                  await refetch();
                              } catch (e: any) {
                                let msg = '스티커 붙이기에 실패했어요.';
                                if (e?.graphQLErrors?.[0]?.message)
                                  msg = e.graphQLErrors[0].message;
                                else if (e?.message) msg = e.message;
                                Alert.alert('실패', msg);
                              }
                            }}
                            disabled={giveStickerLoading}>
                            <Text style={styles.giveStickerBtnText}>
                              {giveStickerLoading
                                ? '⭐️...'
                                : EMOJIS.COMPLETED_STICKER}
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
                <Text style={styles.modalCloseText}>{BUTTON_TEXTS.CLOSE}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* 목표 참여 요청 플로팅 버튼 - personal 모드가 아닐 때만 표시 */}
      {goal.mode !== GOAL_MODES.PERSONAL && !isUserParticipating && (
        <TouchableOpacity
          style={styles.fabJoin}
          onPress={isMyGoal ? handleDirectJoin : handleJoinRequest}
          disabled={joinLoading}>
          <Text style={styles.fabJoinText}>
            {joinLoading
              ? '요청 중...'
              : isMyGoal
              ? '🥇 바로 참여'
              : '🥇 참여 하기'}
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
              maxLength={NUMBERS.MAX_MESSAGE_LENGTH}
            />
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <TouchableOpacity
                style={[
                  styles.modalCloseBtn,
                  {backgroundColor: '#BDC3C7', marginRight: 8},
                ]}
                onPress={() => setJoinModalVisible(false)}>
                <Text style={styles.modalCloseText}>{BUTTON_TEXTS.CANCEL}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={handleJoinConfirm}
                disabled={joinLoading}>
                <Text style={styles.modalCloseText}>
                  {joinLoading ? '요청 중...' : BUTTON_TEXTS.CONFIRM}
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
    padding: 12,
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
    padding: 8,
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
  stickerContainer: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#FFF8FA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#FFE5F0',
  },
  stickerTitle: {
    fontSize: 16,
    color: '#FF6B9D',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  stickerScrollView: {
    maxHeight: 150,
  },
  stickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickerItem: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  stickerIcon: {
    fontSize: 28,
  },
  stickerScrollContainer: {
    position: 'relative',
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
  profileClickable: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF8FA',
    borderWidth: 2,
    borderColor: '#FFE5F0',
    marginBottom: 16,
  },
});

export default GoalDetailScreen;
