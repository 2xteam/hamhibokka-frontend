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

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  isFollowed?: boolean;
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
  const handleFollowStatusChange = (userId: string, isFollowed: boolean) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.userId === userId ? {...user, isFollowed} : user,
      ),
    );
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="닉네임으로 친구 찾기"
          value={nickname}
          onChangeText={setNickname}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{marginTop: 20}} />}
      {!loading && touched && users.length === 0 && (
        <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
      )}
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
            <View style={{marginLeft: 12}}>
              <Text style={styles.userNickname}>{item.nickname}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              {item.isFollowed && (
                <Text style={styles.followedText}>팔로우 중</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        style={{marginTop: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
  },
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
});

export default FriendSearchScreen;
