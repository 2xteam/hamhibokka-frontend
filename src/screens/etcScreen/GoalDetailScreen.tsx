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
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ImageModal from '../../components/ImageModal';
import {GOAL_STATUS_EMOJI, GOAL_STATUS_TEXT} from '../../constants/goalStatus';
import {
  CREATE_GOAL_JOIN_REQUEST,
  DELETE_GOAL,
  GET_GOAL,
  LEAVE_GOAL,
  RECEIVE_STICKER,
} from '../../queries/goal';
import {CHECK_FOLLOW_STATUS} from '../../queries/user';
import {colors} from '../../styles/colors';
import {formatDate} from '../../utils/dateUtils';

interface GoalDetailParams {
  id: string;
  from?: string;
}

function getModeLabel(mode?: string) {
  if (mode === 'personal') return '개인';
  if (mode === 'challenger_recruitment') return '챌린저 모집';
  return mode || '-';
}
function getStatusLabel(status?: string) {
  if (status === 'active')
    return `${GOAL_STATUS_EMOJI.active} ${GOAL_STATUS_TEXT.active}`;
  if (status === 'completed')
    return `${GOAL_STATUS_EMOJI.completed} ${GOAL_STATUS_TEXT.completed}`;
  if (status === 'cancelled')
    return `${GOAL_STATUS_EMOJI.cancelled} ${GOAL_STATUS_TEXT.cancelled}`;
  return status || '-';
}

const GoalDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<{GoalDetail: GoalDetailParams}>>();
  const navigation = useNavigation<any>();
  const {id, from} = route.params;
  const insets = useSafeAreaInsets();
  const {data, loading, error, refetch} = useQuery(GET_GOAL, {
    variables: {id},
    fetchPolicy: 'network-only', // 항상 네트워크에서 최신 데이터 가져오기
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [giveStickerCount, setGiveStickerCount] = useState('1');
  const [showAllStickerDates, setShowAllStickerDates] = useState(false);
  const [joinMessage, setJoinMessage] = useState('참가 요청해요!');
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedGoalImage, setSelectedGoalImage] = useState<string | null>(
    null,
  );
  const [createJoinRequest, {loading: joinLoading}] = useMutation(
    CREATE_GOAL_JOIN_REQUEST,
    {
      onCompleted: () => {
        // 목표 데이터 새로고침
        refetch();
      },
    },
  );
  const [receiveSticker, {loading: giveStickerLoading}] =
    useMutation(RECEIVE_STICKER);
  const [deleteGoal, {loading: deleteLoading}] = useMutation(DELETE_GOAL);
  const [leaveGoal, {loading: leaveLoading}] = useMutation(LEAVE_GOAL, {
    onCompleted: () => {
      // 목표 데이터 새로고침
      refetch();
    },
  });
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

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      // 목표 데이터 새로고침
      refetch();
      // 팔로우 상태 새로고침
      if (currentUserId && data?.getGoal?.createdBy) {
        refetchFollowStatus();
      }
    }, [refetch, currentUserId, data?.getGoal?.createdBy, refetchFollowStatus]),
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
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

  // 로그인한 사용자가 이미 참여하고 있는지 확인
  const isUserParticipating = goal.participants?.some(
    (participant: any) => participant.userId === currentUserId,
  );

  const handleParticipantPress = (participant: any) => {
    setSelectedParticipant(participant);
    setShowAllStickerDates(false);
    setModalVisible(true);
  };

  const handleJoinRequest = () => {
    // 자기 자신의 목표인지 확인
    if (goal.createdBy === currentUserId) {
      // 챌린저 모집 모드일 때는 바로 참여
      if (goal.mode === 'challenger_recruitment') {
        handleDirectJoin();
        return;
      }
      // 다른 모드일 때는 모달 띄우기
      setJoinModalVisible(true);
      return;
    }

    // 팔로우 상태 확인
    const followStatus = followData?.checkFollowStatus?.followStatus;
    const isFollowing =
      followStatus === 'approved' || followStatus === 'mutual';

    // 팔로우 상태가 아니면 친구 요청 안내
    if (!isFollowing) {
      Alert.alert('친구가 아니에요 😊', '먼저 친구 요청을 해보세요!', [
        {
          text: '취소',
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

  // 나의 목표일 때 바로 참여하는 함수
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
      Alert.alert('🎉', '목표에 참여했어요!');
      // 목표 상세 페이지 리로드
      if (typeof refetch === 'function') {
        await refetch();
      }
    } catch (e: any) {
      let msg = '참여에 실패했어요.';
      if (e?.graphQLErrors?.[0]?.message) {
        msg = e.graphQLErrors[0].message;
      } else if (e?.message) {
        msg = e.message;
      }
      Alert.alert('참여 실패', msg);
    }
  };

  // 나의 목표인지 확인
  const isMyGoal =
    goal.createdBy && currentUserId && goal.createdBy === currentUserId;

  // 목표 삭제 함수
  const handleDeleteGoal = () => {
    // 참여자 수 확인
    const participants = goal.participants || [];
    const otherParticipants = participants.filter(
      (participant: any) => participant.userId !== currentUserId,
    );

    // 다른 참여자가 있는 경우 삭제 불가
    if (otherParticipants.length > 0) {
      Alert.alert(
        '삭제 불가',
        '다른 참여자가 있어서 목표를 삭제할 수 없어요.\n모든 참여자가 나간 후에 삭제해주세요.',
        [
          {
            text: '확인',
            style: 'default',
          },
        ],
      );
      return;
    }

    // 본인만 참여한 경우 또는 참여자가 없는 경우 삭제 가능
    Alert.alert(
      '목표 삭제',
      '정말로 이 목표를 삭제하시겠어요?\n삭제하면 복구할 수 없어요.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGoal({
                variables: {
                  id: goal.id,
                },
              });
              Alert.alert('삭제 완료', '목표가 삭제되었어요.', [
                {
                  text: '확인',
                  onPress: () => {
                    // 목표 목록으로 돌아가기
                    navigation.navigate('Main', {screen: 'Goals'});
                  },
                },
              ]);
            } catch (e: any) {
              let msg = '목표 삭제에 실패했어요.';
              if (e?.graphQLErrors?.[0]?.message) {
                msg = e.graphQLErrors[0].message;
              } else if (e?.message) {
                msg = e.message;
              }
              Alert.alert('삭제 실패', msg);
            }
          },
        },
      ],
    );
  };

  // 목표 참여 취소 함수
  const handleLeaveGoal = () => {
    // 현재 사용자의 참여자 정보 찾기
    const currentParticipant = goal.participants?.find(
      (participant: any) => participant.userId === currentUserId,
    );

    if (!currentParticipant) {
      Alert.alert('😣', '참여자 정보를 찾을 수 없어요.');
      return;
    }

    Alert.alert(
      '목표 참여 취소',
      `"${goal.title}" 목표에서 나가시겠어요?\n나가면 다시 참여해야 해요.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '나가기',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveGoal({
                variables: {
                  input: {
                    goalId: goal.goalId,
                    participantId: currentUserId, // 현재 사용자 ID를 participantId로 사용
                  },
                },
              });
              Alert.alert('참여 취소 완료', '목표에서 나갔어요.', [
                {
                  text: '확인',
                  onPress: () => {
                    // 목표 목록으로 돌아가기
                    navigation.navigate('Main', {screen: 'Goals'});
                  },
                },
              ]);
            } catch (e: any) {
              let msg = '목표 참여 취소에 실패했어요.';
              if (e?.graphQLErrors?.[0]?.message) {
                msg = e.graphQLErrors[0].message;
              } else if (e?.message) {
                msg = e.message;
              }
              Alert.alert('참여 취소 실패', msg);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        {/* 제목/설명 */}
        <View style={styles.headerSection}>
          {/* 목표 이미지 */}
          {goal.goalImage && (
            <TouchableOpacity
              style={styles.goalImageContainer}
              onPress={() => {
                // 큰 화면 보기 모달 표시
                setSelectedGoalImage(goal.goalImage);
                setImageModalVisible(true);
              }}>
              <Image
                source={{uri: goal.goalImage}}
                style={styles.goalImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
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
            <Text style={styles.infoLabel}>👑 만든 사람</Text>
            <TouchableOpacity
              onPress={() => {
                if (goal.createdBy && goal.creatorNickname) {
                  // 본인의 프로필인지 확인
                  if (goal.createdBy === currentUserId) {
                    // 본인이면 Main 탭의 Profile로 이동
                    navigation.navigate('Main', {screen: 'Profile'});
                  } else {
                    // 타인이면 UserProfile로 이동
                    navigation.navigate('UserProfile', {
                      user: {
                        id: goal.createdBy,
                        userId: goal.createdBy,
                        nickname: goal.creatorNickname,
                        email: '',
                        profileImage: undefined,
                      },
                    });
                  }
                }
              }}>
              <Text style={[styles.infoValue, styles.clickableText]}>
                {goal.creatorNickname || '탈퇴한 회원'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🤝 참가자 수</Text>
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
          <Text style={styles.sectionTitle}>🤝 참가자 목록</Text>
          {goal.participants && goal.participants.length > 0 ? (
            goal.participants.map((p: any, idx: number) => (
              <TouchableOpacity
                key={p.id || p.nickname || idx}
                style={styles.participantItem}
                onPress={() => handleParticipantPress(p)}>
                <View style={styles.participantInfo}>
                  <Image
                    source={
                      p.profileImage
                        ? {uri: p.profileImage}
                        : require('../../../assets/default-profile.jpg')
                    }
                    style={styles.participantImage}
                  />
                  <Text style={styles.participantName}>
                    {p.nickname || '이름없음'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>아직 참가자가 없어요 😊</Text>
          )}

          {/* 목표 생성자일 때만 수정 버튼 표시 */}
          {goal.createdBy &&
            currentUserId &&
            goal.createdBy === currentUserId && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditGoal', {
                    goalId: goal.id,
                  })
                }>
                <Text style={styles.editButtonText}>✏️ 목표 수정</Text>
              </TouchableOpacity>
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
              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={true}
                contentContainerStyle={styles.modalScrollContent}>
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
                              : require('../../../assets/default-profile.jpg')
                          }
                          style={styles.avatarImage}
                        />
                      </View>
                      <Text style={styles.modalLabel}>
                        닉네임:{' '}
                        <Text
                          style={{color: colors.primary, fontWeight: 'bold'}}>
                          {selectedParticipant.nickname || '-'}
                        </Text>
                      </Text>
                    </TouchableOpacity>

                    {/* 스티커 부여 현황(한 줄에 최대 5개씩, 3줄이 넘으면 스크롤) */}
                    <View style={styles.stickerContainer}>
                      <Text style={styles.stickerTitle}>✨모은 스티커</Text>
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
                                    (selectedParticipant.currentStickerCount ??
                                      0)
                                      ? '🌟'
                                      : '⭐️'}
                                  </Text>
                                </View>
                              ),
                            )}
                          </View>
                        </ScrollView>
                      </View>

                      {/* 받은 스티커 날짜 히스토리 (간단 표시) */}
                      {Array.isArray(selectedParticipant.stickerReceivedLogs) &&
                        selectedParticipant.stickerReceivedLogs.length > 0 && (
                          <View style={styles.stickerHistoryBox}>
                            <Text style={styles.stickerHistoryTitle}>
                              📚 언제 받았지?
                            </Text>
                            {(showAllStickerDates
                              ? selectedParticipant.stickerReceivedLogs
                              : selectedParticipant.stickerReceivedLogs.slice(
                                  0,
                                  3,
                                )
                            ).map((log: any, idx: number) => (
                              <View
                                key={`sticker-log-${idx}`}
                                style={styles.stickerHistoryRow}>
                                <Text style={styles.stickerHistoryDate}>
                                  {formatDate(log.date, 'MM월 dd일')}
                                </Text>
                                <Text style={styles.stickerHistoryCount}>
                                  {log.count > 0 ? `+${log.count}` : log.count}
                                  개
                                </Text>
                              </View>
                            ))}
                            {selectedParticipant.stickerReceivedLogs.length >
                              3 && (
                              <TouchableOpacity
                                style={styles.stickerHistoryToggle}
                                onPress={() =>
                                  setShowAllStickerDates(prev => !prev)
                                }>
                                <Text style={styles.stickerHistoryToggleText}>
                                  {showAllStickerDates ? '접기' : '더보기'}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
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
                            🌟 스티커 붙이기
                          </Text>

                          {/* 스티커 카운트 조절 UI */}
                          <View style={styles.stickerControlContainer}>
                            <View style={styles.stickerControl}>
                              <TouchableOpacity
                                style={styles.stickerButton}
                                onPress={() => {
                                  const current =
                                    parseInt(giveStickerCount) || 1;
                                  if (current > 1) {
                                    setGiveStickerCount(
                                      (current - 1).toString(),
                                    );
                                  }
                                }}>
                                <Text style={styles.stickerButtonText}>-</Text>
                              </TouchableOpacity>
                              <Text style={styles.stickerCount}>
                                {giveStickerCount}
                              </Text>
                              <TouchableOpacity
                                style={styles.stickerButton}
                                onPress={() => {
                                  const current =
                                    parseInt(giveStickerCount) || 1;
                                  setGiveStickerCount((current + 1).toString());
                                }}>
                                <Text style={styles.stickerButtonText}>+</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {/* 스티커 부여/뺏기 버튼들 */}
                          <View style={styles.stickerActionRow}>
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
                                    `${giveStickerCount}개 스티커를 붙였어요!`,
                                  );
                                  setGiveStickerCount('1');
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
                                {giveStickerLoading ? '⭐️...' : '🌟'}
                              </Text>
                            </TouchableOpacity>

                            {/* 스티커 빼기 버튼 - 참여자의 스티커가 0보다 클 때만 표시 */}
                            {selectedParticipant.currentStickerCount > 0 && (
                              <TouchableOpacity
                                style={styles.removeStickerBtn}
                                onPress={async () => {
                                  const current =
                                    selectedParticipant.currentStickerCount ??
                                    0;
                                  const remove = Number(giveStickerCount) || 1;
                                  if (remove > current) {
                                    Alert.alert(
                                      '스티커 부족',
                                      '가지고 있는 스티커보다 많이 뺄 수 없어요!',
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
                                          stickerCount: -remove, // 음수 값으로 스티커 빼기
                                        },
                                      },
                                    });
                                    Alert.alert(
                                      '🗑️',
                                      `${giveStickerCount}개 스티커를 뺐어요!`,
                                    );
                                    setGiveStickerCount('1');
                                    setModalVisible(false);
                                    if (typeof refetch === 'function')
                                      await refetch();
                                  } catch (e: any) {
                                    let msg = '스티커 빼기에 실패했어요.';
                                    if (e?.graphQLErrors?.[0]?.message)
                                      msg = e.graphQLErrors[0].message;
                                    else if (e?.message) msg = e.message;
                                    Alert.alert('실패', msg);
                                  }
                                }}
                                disabled={giveStickerLoading}>
                                <Text style={styles.removeStickerBtnText}>
                                  🗑️
                                </Text>
                              </TouchableOpacity>
                            )}
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
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
      {/* 목표 참여/나가기 플로팅 버튼 - personal 모드가 아니고 완료되지 않은 경우만 표시 */}
      {goal.mode !== 'personal' && goal.status !== 'completed' && (
        <>
          {/* 참여하기 버튼 - 참여하지 않은 경우 */}
          {!goal.isParticipant && (
            <TouchableOpacity
              style={styles.fabJoin}
              onPress={handleJoinRequest}
              disabled={joinLoading}>
              <Text style={styles.fabJoinText}>
                {joinLoading ? '요청 중...' : '🥇 참여 하기'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 나가기 버튼 - 참여 중인 경우 (본인, 타인 상관없이) */}
          {goal.isParticipant && (
            <TouchableOpacity
              style={styles.fabLeave}
              onPress={handleLeaveGoal}
              disabled={leaveLoading}>
              <Text style={styles.fabLeaveText}>
                {leaveLoading ? '나가는 중...' : '🚪 나가기'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* 목표 삭제 버튼 - 본인이 생성한 목표일 때만 표시 */}
      {isMyGoal && (
        <TouchableOpacity
          style={styles.fabDelete}
          onPress={handleDeleteGoal}
          disabled={deleteLoading}>
          <Text style={styles.fabDeleteText}>
            {deleteLoading ? '삭제 중...' : '🗑️ 삭제'}
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
                  {
                    backgroundColor:
                      colors.components.goalDetail.modal.button.cancel,
                    marginRight: 8,
                  },
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

      {/* 목표 이미지 큰 화면 보기 모달 */}
      <ImageModal
        visible={imageModalVisible}
        imageUri={selectedGoalImage}
        onClose={() => setImageModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.components.goalDetail.background,
    paddingBottom: 60,
  },
  safeArea: {
    flex: 1,
  },
  statusBarArea: {
    backgroundColor: colors.components.goalDetail.background,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 3,
    borderBottomColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.components.goalDetail.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.primary,
    marginTop: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: colors.primary,
    textAlign: 'center',
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
    backgroundColor: colors.components.goalDetail.header.background,
    borderRadius: 20,
    padding: 20,
    shadowColor: colors.components.goalDetail.header.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.components.goalDetail.header.title,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.components.goalDetail.header.description,
    textAlign: 'center',
    lineHeight: 22,
  },
  cardSection: {
    backgroundColor: colors.components.goalDetail.card.background,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: colors.components.goalDetail.card.shadow,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.components.goalDetail.card.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.components.goalDetail.info.background,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.components.goalDetail.info.label,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    color: colors.components.goalDetail.info.value,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.components.goalDetail.section.title,
    marginBottom: 16,
  },
  participantItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.components.goalDetail.section.participant.border,
    backgroundColor:
      colors.components.goalDetail.section.participant.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: colors.primaryLight,
  },
  participantName: {
    fontSize: 16,
    color: colors.components.goalDetail.section.participant.text,
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
    backgroundColor: colors.components.goalDetail.modal.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.components.goalDetail.modal.background,
    borderRadius: 24,
    padding: 28,
    width: 320,
    alignItems: 'center',
    shadowColor: colors.components.goalDetail.modal.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: colors.components.goalDetail.modal.border,
  },
  modalContentChild: {
    backgroundColor: colors.components.goalDetail.modal.background,
    borderRadius: 28,
    padding: 32,
    width: 340,
    minHeight: '65%',
    alignItems: 'center',
    shadowColor: colors.components.goalDetail.modal.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 4,
    borderColor: colors.components.goalDetail.modal.border,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.components.goalDetail.modal.title,
  },
  modalLabel: {
    fontSize: 16,
    padding: 12,
    color: colors.components.goalDetail.info.label,
    fontWeight: '600',
  },
  modalCloseBtn: {
    marginTop: 24,
    backgroundColor: colors.components.goalDetail.modal.button.background,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    shadowColor: colors.components.goalDetail.modal.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  modalCloseText: {
    color: colors.components.goalDetail.modal.button.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  fabJoin: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: colors.components.goalDetail.modal.button.background,
    borderRadius: 32,
    width: 200,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.components.goalDetail.modal.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fabJoinText: {
    color: colors.components.goalDetail.modal.button.text,
    fontWeight: 'bold',
    fontSize: 18,
  },
  fabDelete: {
    position: 'absolute',
    left: 24,
    bottom: 24,
    backgroundColor: '#FF6B6B',
    borderRadius: 32,
    width: 120,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF5252',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fabDeleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fabLeave: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#FF9800',
    borderRadius: 32,
    width: 120,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F57C00',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  fabLeaveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderWidth: 3,
    borderColor: colors.components.goalDetail.input.border,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.components.goalDetail.input.background,
    marginTop: 12,
    color: colors.components.goalDetail.input.text,
  },
  stickerRow: {
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  stickerCountText: {
    fontSize: 18,
    color: colors.components.goalDetail.info.label,
    fontWeight: '600',
  },
  giveStickerBox: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.components.goalDetail.sticker.background,
    borderRadius: 16,
    padding: 16,
  },
  giveStickerLabel: {
    fontSize: 20,
    color: colors.components.goalDetail.sticker.title,
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
    borderColor: colors.components.goalDetail.input.border,
    borderRadius: 12,
    padding: 8,
    fontSize: 20,
    marginRight: 12,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: colors.components.goalDetail.input.text,
  },
  giveStickerBtn: {
    backgroundColor: colors.components.goalDetail.sticker.button.background,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.components.goalDetail.sticker.button.shadow,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginRight: 12,
  },
  giveStickerBtnText: {
    color: colors.components.goalDetail.sticker.button.text,
    fontWeight: 'bold',
    fontSize: 18,
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
    backgroundColor: colors.components.goalDetail.sticker.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.components.goalDetail.sticker.border,
  },
  stickerTitle: {
    fontSize: 20,
    color: colors.components.goalDetail.sticker.title,
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

  // 간단한 스티커 히스토리 영역
  stickerHistoryBox: {
    marginTop: 12,
    backgroundColor: colors.components.goalDetail.input.background,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.components.goalDetail.input.border,
  },
  stickerHistoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.components.goalDetail.info.label,
    marginBottom: 8,
  },
  stickerHistoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  stickerHistoryDate: {
    fontSize: 14,
    color: colors.components.goalDetail.info.value,
  },
  stickerHistoryCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  stickerHistoryToggle: {
    marginTop: 8,
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  stickerHistoryToggleText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },

  celebrateBox: {
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: colors.components.goalDetail.header.background,
    borderRadius: 20,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  celebrateEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  celebrateTitle: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  celebrateText: {
    fontSize: 16,
    color: colors.components.goalDetail.info.label,
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
    borderColor: colors.components.goalDetail.avatar.border,
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.components.goalDetail.avatar.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.components.goalDetail.avatar.border,
  },
  avatarEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  avatarText: {
    fontSize: 18,
    color: colors.components.goalDetail.avatar.text,
    fontWeight: 'bold',
  },
  profileClickable: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.components.goalDetail.input.background,
    borderWidth: 2,
    borderColor: colors.components.goalDetail.input.border,
    marginBottom: 16,
  },
  removeStickerBox: {
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    backgroundColor: colors.components.goalDetail.sticker.background,
    borderRadius: 16,
    padding: 16,
  },
  removeStickerLabel: {
    fontSize: 18,
    color: colors.components.goalDetail.sticker.title,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  removeStickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeStickerInput: {
    width: 56,
    height: 44,
    borderWidth: 3,
    borderColor: colors.components.goalDetail.input.border,
    borderRadius: 12,
    padding: 8,
    fontSize: 18,
    marginRight: 12,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    color: colors.components.goalDetail.input.text,
  },
  removeStickerBtn: {
    backgroundColor: '#F48FB1', // 연한 분홍색 배경
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F06292', // 연한 분홍색 그림자
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  removeStickerBtnText: {
    color: '#FFFFFF', // 흰색 텍스트
    fontWeight: 'bold',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  clickableText: {
    textDecorationLine: 'underline',
    color: colors.primary,
  },
  goalImageContainer: {
    width: 73,
    height: 73,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: colors.components.goalDetail.card.background,
    borderWidth: 2,
    borderColor: colors.components.goalDetail.card.border,
    shadowColor: colors.components.goalDetail.card.shadow,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  goalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  // 스티커 카운트 조절 UI 스타일
  stickerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stickerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  stickerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  stickerCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
  stickerActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 8,
  },
  stickerControlContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  stickerCountLabel: {
    fontSize: 14,
    color: colors.medium,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalScrollContainer: {
    flex: 1,
    width: '100%',
    minHeight: 300,
    maxHeight: 500,
  },
  modalScrollView: {
    flex: 1,
    width: '100%',
  },
  modalScrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default GoalDetailScreen;
