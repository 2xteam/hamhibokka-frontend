import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GET_MY_INVITATIONS} from '../queries/goal';

const typeIconMap: Record<string, string> = {
  invite: 'person-add', // 초대
  request: 'send', // 요청
};
const statusIconMap: Record<string, {name: string; color: string}> = {
  pending: {name: 'hourglass-empty', color: '#F39C12'},
  accepted: {name: 'check-circle', color: '#27AE60'},
  rejected: {name: 'cancel', color: '#E74C3C'},
};

const InvitationListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {data, loading, error, refetch} = useQuery(GET_MY_INVITATIONS);

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('InvitationDetail', {id: item.id})}>
      <View style={styles.titleRow}>
        <MaterialIcons
          name={typeIconMap[item.type] || 'help-outline'}
          size={22}
          color="#4A90E2"
          style={{marginRight: 8}}
        />
        <Text style={styles.title}>{item.goal.title}</Text>
      </View>
      <Text style={styles.desc}>{item.goal.description || '설명 없음'}</Text>
      <Text style={styles.stickerCount}>
        스티커 목표: {item.goal.stickerCount ?? '-'}개
      </Text>
      <Text style={styles.message}>{item.message || '메시지 없음'}</Text>
      <View style={styles.dateRow}>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
        <MaterialIcons
          name={statusIconMap[item.status]?.name || 'help-outline'}
          size={20}
          color={statusIconMap[item.status]?.color || '#7F8C8D'}
          style={{marginLeft: 8}}
        />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>초대/요청을 불러올 수 없습니다.</Text>
      </View>
    );
  }
  const invitations = data?.getMyInvitations || [];

  return (
    <View style={styles.container}>
      {invitations.length === 0 ? (
        <Text style={styles.emptyText}>받은 초대/요청이 없습니다.</Text>
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8F9FA', padding: 20},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  listContainer: {paddingBottom: 40},
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {fontSize: 16, fontWeight: 'bold', color: '#2C3E50', marginBottom: 4},
  desc: {fontSize: 14, color: '#7F8C8D', marginBottom: 4},
  stickerCount: {
    fontSize: 13,
    color: '#F39C12',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {fontSize: 14, color: '#4A90E2', marginBottom: 4},
  date: {fontSize: 12, color: '#BDC3C7'},
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 0,
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default InvitationListScreen;
