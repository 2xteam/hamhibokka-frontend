import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GET_INVITATION, UPDATE_GOAL_INVITATION} from '../queries/goal';

const typeIconMap: Record<string, string> = {
  invite: 'person-add',
  request: 'send',
};
const statusIconMap: Record<string, {name: string; color: string}> = {
  pending: {name: 'hourglass-empty', color: '#F39C12'},
  accepted: {name: 'check-circle', color: '#27AE60'},
  rejected: {name: 'cancel', color: '#E74C3C'},
};

function statusColor(status?: string) {
  switch (status) {
    case 'active':
      return {backgroundColor: '#4A90E2'};
    case 'completed':
      return {backgroundColor: '#27AE60'};
    case 'archived':
      return {backgroundColor: '#BDC3C7'};
    case 'pending':
      return {backgroundColor: '#F39C12'};
    case 'accepted':
      return {backgroundColor: '#27AE60'};
    case 'rejected':
      return {backgroundColor: '#E74C3C'};
    default:
      return {backgroundColor: '#BDC3C7'};
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
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }
  if (error || !data?.getInvitation) {
    return (
      <View style={styles.centered}>
        <Text>상세 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }
  const inv = data.getInvitation;
  const goal = inv.goal || {};
  const canApprove =
    goal.createdBy && currentUserId && goal.createdBy === currentUserId;
  const isApproved = inv.status === 'accepted';

  return (
    <View style={styles.container}>
      {/* 목표 정보 카드 */}
      <View style={styles.cardSection}>
        <View style={styles.goalHeaderRow}>
          <MaterialIcons
            name="flag"
            size={28}
            color="#4A90E2"
            style={{marginRight: 8}}
          />
          <Text style={styles.goalTitle}>{goal.title || '-'}</Text>
        </View>
        <Text style={styles.goalDesc}>{goal.description || '설명 없음'}</Text>
        <View style={styles.goalInfoRow}>
          <Text style={styles.goalInfo}>
            <MaterialIcons name="emoji-events" size={18} color="#F39C12" />{' '}
            스티커 목표:{' '}
            <Text style={styles.goalInfoValue}>{goal.stickerCount ?? '-'}</Text>
            개
          </Text>
          <Text style={styles.goalInfo}>
            <MaterialIcons name="group" size={18} color="#27AE60" /> 모드:{' '}
            <Text style={styles.goalInfoValue}>
              {goal.mode === 'group' ? '그룹' : '개인'}
            </Text>
          </Text>
          <Text style={styles.goalInfo}>
            <MaterialIcons name="calendar-today" size={18} color="#4A90E2" />{' '}
            생성일:{' '}
            <Text style={styles.goalInfoValue}>
              {goal.createdAt
                ? new Date(goal.createdAt).toLocaleDateString()
                : '-'}
            </Text>
          </Text>
          <Text style={styles.goalInfo}>
            상태:{' '}
            <View
              style={[
                styles.statusBadge,
                statusColor(goal.status),
                {flexDirection: 'row', alignItems: 'center'},
              ]}>
              <MaterialIcons
                name={statusIconMap[goal.status]?.name || 'help-outline'}
                size={18}
                color="#fff"
                style={{marginRight: 4}}
              />
              <Text style={styles.statusBadgeText}>{goal.status || '-'}</Text>
            </View>
          </Text>
        </View>
      </View>
      {/* 초대/요청 정보 카드 */}
      <View style={styles.cardSection}>
        <View style={styles.invHeaderRow}>
          <MaterialIcons
            name={typeIconMap[inv.type] || 'help-outline'}
            size={24}
            color="#F39C12"
            style={{marginRight: 8}}
          />
          <Text style={styles.invTypeText}>
            {inv.type === 'invite' ? '초대' : '요청'}
          </Text>
          <View style={[styles.statusBadge, statusColor(inv.status)]}>
            <MaterialIcons
              name={statusIconMap[inv.status]?.name || 'help-outline'}
              size={18}
              color="#fff"
            />
            <Text style={styles.statusBadgeText}>{inv.status}</Text>
          </View>
        </View>
        <Text style={styles.invMessageLabel}>메시지</Text>
        <Text style={styles.invMessage}>{inv.message || '메시지 없음'}</Text>
        <Text style={styles.invInfo}>
          <MaterialIcons name="person" size={16} color="#4A90E2" /> 보낸 사람:{' '}
          <Text style={styles.invInfoValue}>{inv.fromUserId}</Text>
        </Text>
        <Text style={styles.invInfo}>
          <MaterialIcons name="person" size={16} color="#4A90E2" /> 받는 사람:{' '}
          <Text style={styles.invInfoValue}>{inv.toUserId}</Text>
        </Text>
        <Text style={styles.invInfo}>
          <MaterialIcons name="calendar-today" size={16} color="#4A90E2" />{' '}
          생성일:{' '}
          <Text style={styles.invInfoValue}>
            {new Date(inv.createdAt).toLocaleString()}
          </Text>
        </Text>
        <View style={styles.respondedRow}>
          <Text style={styles.invInfo}>
            <MaterialIcons name="calendar-today" size={16} color="#4A90E2" />{' '}
            응답일:{' '}
            <Text style={styles.invInfoValue}>
              {inv.respondedAt
                ? new Date(inv.respondedAt).toLocaleString()
                : '-'}
            </Text>
          </Text>
        </View>
      </View>
      {canApprove && (
        <View style={{marginTop: 16, alignItems: 'center'}}>
          <TouchableOpacity
            style={[styles.approveBtn, isApproved && styles.approveBtnDisabled]}
            onPress={async () => {
              try {
                await updateGoalInvitation({
                  variables: {id: inv.id, input: {status: 'accepted'}},
                });
                await refetch();
                Alert.alert('승인 완료', '요청이 승인되었습니다.');
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
                ? '승인 완료'
                : approveLoading
                ? '승인 중...'
                : '요청 승인'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  cardSection: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    marginBottom: 28,
    shadowColor: '#4A90E2',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  goalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 4,
  },
  goalDesc: {
    fontSize: 17,
    color: '#7F8C8D',
    marginBottom: 16,
    textAlign: 'center',
  },
  goalInfoRow: {
    marginTop: 12,
    gap: 2,
  },
  goalInfo: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInfoValue: {
    fontWeight: 'bold',
    color: '#2C3E50',
    fontSize: 16,
  },
  statusBadge: {
    backgroundColor: '#F39C12',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginLeft: 4,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  invHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  invTypeText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 10,
  },
  invMessageLabel: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 2,
    marginTop: 10,
  },
  invMessage: {
    color: '#2C3E50',
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 10,
    minHeight: 36,
  },
  invInfo: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  invInfoValue: {
    fontWeight: 'bold',
    color: '#2C3E50',
    fontSize: 16,
  },
  respondedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
    marginTop: 4,
  },
  approveBtn: {
    backgroundColor: '#27AE60',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#27AE60',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  approveBtnDisabled: {
    backgroundColor: '#BDC3C7',
  },
  approveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 1,
  },
});

export default InvitationDetailScreen;
