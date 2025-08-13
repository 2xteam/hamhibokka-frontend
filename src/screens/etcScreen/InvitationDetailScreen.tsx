import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GET_INVITATION, UPDATE_GOAL_INVITATION} from '../../queries/goal';
import {colors} from '../../styles/colors';
import {formatDate, formatDateTime} from '../../utils/dateUtils';

const typeIconMap: Record<string, string> = {
  invite: 'person-add',
  request: 'send',
};
const statusIconMap: Record<string, {name: string; color: string}> = {
  pending: {name: 'hourglass-empty', color: colors.warning},
  accepted: {name: 'check-circle', color: colors.success},
  rejected: {name: 'cancel', color: colors.error},
};

function statusColor(status?: string) {
  switch (status) {
    case 'active':
      return {backgroundColor: colors.primary};
    case 'completed':
      return {backgroundColor: colors.success};
    case 'archived':
      return {backgroundColor: colors.lighter};
    case 'pending':
      return {backgroundColor: colors.warning};
    case 'accepted':
      return {backgroundColor: colors.success};
    case 'rejected':
      return {backgroundColor: colors.error};
    default:
      return {backgroundColor: colors.lighter};
  }
}

function getStatusText(status?: string) {
  switch (status) {
    case 'active':
      return '진행중';
    case 'completed':
      return '완료';
    case 'archived':
      return '보관됨';
    case 'pending':
      return '대기중';
    case 'accepted':
      return '승인됨';
    case 'rejected':
      return '거절됨';
    default:
      return '알 수 없음';
  }
}

const InvitationDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const {id} = route.params || {};
  const {data, loading, error, refetch} = useQuery(GET_INVITATION, {
    variables: {id},
  });
  const [updateGoalInvitation, {loading: approveLoading}] = useMutation(
    UPDATE_GOAL_INVITATION,
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
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
        <Text style={styles.loadingText}>정보를 불러오는 중...</Text>
      </View>
    );
  }
  if (error || !data?.getInvitation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>📄 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }
  const inv = data.getInvitation;
  const goal = inv.goal || {};
  const canApprove =
    goal.createdBy && currentUserId && goal.createdBy === currentUserId;

  const isApproved = inv.status === 'accepted';
  const getModeEmoji = (mode?: string) => {
    switch (mode) {
      case 'personal':
        return '💪';
      case 'competition':
        return '🏆';
      case 'challenger_recruitment':
        return '👬';
      default:
        return '🥇';
    }
  };
  function getModeLabel(mode?: string): string {
    switch (mode) {
      case 'personal':
        return '개인';
      case 'competition':
        return '경쟁';
      case 'challenger_recruitment':
        return '챌린저';
      default:
        return '개인';
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 목표 정보 카드 */}
        <View style={styles.cardSection}>
          <View style={styles.goalHeaderRow}>
            <Text style={styles.goalIcon}>🥇</Text>
            <Text style={styles.goalTitle}>{goal.title || '-'}</Text>
          </View>
          <Text style={styles.goalDesc}>{goal.description || '설명 없음'}</Text>
          <View style={styles.goalInfoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🏆</Text>
              <Text style={styles.goalInfo}>
                스티커 목표:{' '}
                <Text style={styles.goalInfoValue}>
                  {goal.stickerCount ?? '-'}
                </Text>
                개
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>🕹️</Text>
              <Text style={styles.goalInfo}>
                모드:{' '}
                <Text style={styles.goalInfoValue}>
                  {getModeEmoji(goal.mode)} {getModeLabel(goal.mode)}
                </Text>
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.goalInfo}>
                만든 날:{' '}
                <Text style={styles.goalInfoValue}>
                  {formatDate(goal.createdAt)}
                </Text>
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📊</Text>
              <Text style={styles.goalInfo}>
                상태:{' '}
                <View
                  style={[
                    styles.statusBadge,
                    statusColor(goal.status),
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <Text style={styles.statusBadgeText}>
                    {getStatusText(goal.status)}
                  </Text>
                </View>
              </Text>
            </View>
          </View>
        </View>
        {/* 초대/요청 정보 카드 */}
        <View style={styles.cardSection}>
          <View style={styles.invHeaderRow}>
            <Text style={styles.invIcon}>
              {inv.type === 'invite' ? '📨' : '📤'}
            </Text>
            <Text style={styles.invTypeText}>
              {inv.type === 'invite' ? '초대' : '요청'}
            </Text>
            <View style={[styles.statusBadge, statusColor(inv.status)]}>
              <Text style={styles.statusBadgeText}>
                {getStatusText(inv.status)}
              </Text>
            </View>
          </View>

          {/* 발신자/수신자 정보 */}
          <View style={styles.userInfoSection}>
            {currentUserId === inv.fromUserId ? (
              // 보낸 요청인 경우
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>👥 받는 사람:</Text>
                <Text style={styles.userInfoValue}>
                  {inv.toUser?.nickname || '알 수 없음'}
                </Text>
              </View>
            ) : (
              // 받은 요청인 경우
              <View style={styles.userInfoRow}>
                <Text style={styles.userInfoLabel}>👤 보낸 사람:</Text>
                <Text style={styles.userInfoValue}>
                  {inv.fromUser?.nickname || '알 수 없음'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.invMessageLabel}>💬 메시지</Text>
          <Text style={styles.invMessage}>{inv.message || '메시지 없음'}</Text>
          <View style={styles.invInfoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={styles.invInfo}>
                요청한 날:{' '}
                <Text style={styles.invInfoValue}>
                  {formatDateTime(inv.createdAt)}
                </Text>
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.invInfo}>
                응답한 날:{' '}
                <Text style={styles.invInfoValue}>
                  {inv.respondedAt ? formatDateTime(inv.respondedAt) : '-'}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        {canApprove && (
          <View style={styles.approveContainer}>
            <TouchableOpacity
              style={[
                styles.approveBtn,
                isApproved && styles.approveBtnDisabled,
              ]}
              onPress={async () => {
                try {
                  await updateGoalInvitation({
                    variables: {
                      id: inv.invitationId,
                      input: {status: 'accepted'},
                    },
                  });
                  await refetch();
                  Alert.alert('승인 완료', '✅ 요청이 승인되었습니다!');
                } catch (e: any) {
                  let msg = '승인에 실패했습니다.';
                  if (e?.graphQLErrors?.[0]?.message)
                    msg = e.graphQLErrors[0].message;
                  else if (e?.message) msg = e.message;
                  Alert.alert('승인 실패', msg);
                }
              }}
              disabled={approveLoading || isApproved}>
              <Text style={styles.approveBtnText}>
                {isApproved
                  ? '✅ 승인 완료'
                  : approveLoading
                  ? '⏳ 승인 중...'
                  : '👍 요청 승인'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardSection: {
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 28,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  goalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  goalDesc: {
    fontSize: 18,
    color: colors.medium,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  goalInfoRow: {
    marginTop: 16,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  goalInfo: {
    fontSize: 16,
    color: colors.medium,
    flex: 1,
    fontWeight: '500',
  },
  goalInfoValue: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: colors.warning,
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 8,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  invHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
  },
  invIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  invTypeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 16,
  },
  invMessageLabel: {
    fontSize: 18,
    color: colors.medium,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  invMessage: {
    color: colors.dark,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 15,
    padding: 16,
    minHeight: 40,
    lineHeight: 22,
    fontWeight: '500',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  invInfoContainer: {
    marginTop: 8,
  },
  invInfo: {
    fontSize: 16,
    color: colors.medium,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    fontWeight: '500',
  },
  invInfoValue: {
    fontWeight: 'bold',
    color: colors.dark,
    fontSize: 16,
  },
  userInfoSection: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoLabel: {
    fontSize: 16,
    color: colors.medium,
    fontWeight: '600',
    marginRight: 12,
    minWidth: 80,
  },
  userInfoValue: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    flex: 1,
  },
  approveContainer: {
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: colors.success,
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: 'center',
    shadowColor: colors.success,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.successLight,
  },
  approveBtnDisabled: {
    backgroundColor: colors.lighter,
    borderColor: colors.light,
  },
  approveBtnText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    letterSpacing: 1,
  },
});

export default InvitationDetailScreen;
