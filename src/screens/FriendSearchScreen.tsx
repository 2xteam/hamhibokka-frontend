import {useLazyQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SEARCH_USERS_BY_NICKNAME} from '../queries/user';
import {colors} from '../styles/colors';

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  followStatus?: string;
}

const FriendSearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [nickname, setNickname] = useState('');
  const [search, {data, loading}] = useLazyQuery(SEARCH_USERS_BY_NICKNAME);
  const [touched, setTouched] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  // 현재 로그인한 사용자 정보 가져오기
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

    getCurrentUser();
  }, []);

  // 검색 결과 업데이트
  useEffect(() => {
    if (data?.searchUsersByNickname) {
      setUsers(data.searchUsersByNickname);
    }
  }, [data]);

  const handleSearch = () => {
    setTouched(true);
    if (nickname.trim()) {
      search({variables: {nickname: nickname.trim()}});
    }
  };

  const handleUserPress = (user: User) => {
    // 사용자 클릭 시 UserProfileScreen으로 이동
    navigation.navigate('UserProfile', {user});
  };

  // 팔로우 상태 변경 처리
  const handleFollowStatusChange = (userId: string, status: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userId === userId ? {...user, followStatus: status} : user,
      ),
    );
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 닉네임으로 친구 찾기"
          placeholderTextColor={colors.medium}
          value={nickname}
          onChangeText={setNickname}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔎 검색</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>친구를 찾는 중...</Text>
        </View>
      )}

      {!loading && !touched && (
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <Text style={styles.welcomeIconText}>👬</Text>
          </View>
          <Text style={styles.welcomeTitle}>친구 찾기</Text>
          <Text style={styles.welcomeSubtitle}>
            닉네임을 입력하여 새로운 친구를 찾아보세요! 🌟
          </Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 검색 팁</Text>
            <Text style={styles.tipText}>✨ 정확한 닉네임을 입력하세요</Text>
            <Text style={styles.tipText}>🔍 부분 검색도 가능합니다</Text>
            <Text style={styles.tipText}>
              🤝 찾은 친구를 팔로우할 수 있습니다
            </Text>
          </View>
        </View>
      )}

      {!loading && touched && users.length === 0 && (
        <View style={styles.noResultsSection}>
          <Text style={styles.noResultsIcon}>🔍</Text>
          <Text style={styles.noResultsTitle}>검색 결과가 없습니다</Text>
          <Text style={styles.noResultsSubtitle}>
            다른 닉네임으로 다시 검색해보세요! 🥺
          </Text>
        </View>
      )}

      {!loading && touched && users.length > 0 && (
        <FlatList
          data={users}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => handleUserPress(item)}>
              <Image
                source={
                  item.profileImage
                    ? {uri: item.profileImage}
                    : require('../../assets/default-profile.jpg')
                }
                style={styles.userAvatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userNickname}>🌟 {item.nickname}</Text>
                <Text style={styles.userEmail}>📧 {item.email}</Text>
                {item.followStatus && (
                  <View style={styles.statusContainer}>
                    <Text style={styles.followedText}>
                      {item.followStatus === 'pending'
                        ? '⏳ 대기중'
                        : item.followStatus === 'approved'
                        ? '🤝 맞팔중'
                        : '👬 팔로우 중'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          style={styles.userList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    marginRight: 12,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userNickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.medium,
    marginBottom: 6,
  },
  statusContainer: {
    alignSelf: 'flex-start',
  },
  followedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '600',
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 40,
    padding: 28,
    backgroundColor: colors.white,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  welcomeIconText: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  noResultsSection: {
    alignItems: 'center',
    marginTop: 40,
    padding: 28,
    backgroundColor: colors.white,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  noResultsIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  userList: {
    marginTop: 16,
  },
});

export default FriendSearchScreen;
