import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  followStatus?: string;
}

interface UserListProps {
  users: User[];
  onPressUser?: (user: User) => void;
  emptyText?: string;
  contentContainerStyle?: any;
  showFollowStatus?: boolean;
  showApproveButton?: boolean;
  onApproveFollow?: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onPressUser,
  emptyText = '사용자가 없습니다.',
  contentContainerStyle,
  showFollowStatus = true,
  showApproveButton = false,
  onApproveFollow,
}) => {
  const renderItem = ({item}: {item: User}) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => onPressUser && onPressUser(item)}>
      <Image
        source={
          item.profileImage
            ? {uri: item.profileImage}
            : require('../../../assets/default-profile.jpg')
        }
        style={styles.userAvatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userNickname}>{item.nickname}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {showFollowStatus && item.followStatus && (
          <Text style={styles.followedText}>팔로우 중</Text>
        )}
        {/* 친구 관리 모달용 상태 표시 */}
        {showApproveButton && (item as any).showPendingStatus && (
          <Text style={styles.pendingText}>대기중</Text>
        )}
        {showApproveButton &&
          (item as any).status === 'pending' &&
          !(item as any).showPendingStatus && (
            <Text style={styles.requestText}>요청받음</Text>
          )}
        {showApproveButton && (item as any).status === 'approved' && (
          <Text style={styles.mutualFollowText}>맞팔중</Text>
        )}
        {/* 일반 팔로우 상태 표시 (친구 관리 모달이 아닌 경우) */}
        {!showApproveButton && showFollowStatus && item.followStatus && (
          <Text style={styles.followedText}>팔로우 중</Text>
        )}
      </View>
      {showApproveButton &&
        (item as any).showApproveButton &&
        onApproveFollow && (
          <TouchableOpacity
            style={styles.approveButton}
            onPress={() => onApproveFollow(item.userId)}>
            <Text style={styles.approveButtonText}>승인</Text>
          </TouchableOpacity>
        )}
    </TouchableOpacity>
  );

  if (!users || users.length === 0) {
    return <Text style={styles.emptyText}>{emptyText}</Text>;
  }

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0E6ED',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userNickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  userEmail: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 2,
  },
  followedText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
    marginTop: 2,
  },
  pendingText: {
    fontSize: 12,
    color: '#F39C12',
    fontWeight: '500',
    marginTop: 2,
  },
  requestText: {
    fontSize: 12,
    color: '#3498DB',
    fontWeight: '500',
    marginTop: 2,
  },
  friendText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
    marginTop: 2,
  },
  mutualFollowText: {
    fontSize: 12,
    color: '#27AE60',
    fontWeight: '500',
    marginTop: 2,
  },
  approveButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 12,
  },
  approveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default UserList;
