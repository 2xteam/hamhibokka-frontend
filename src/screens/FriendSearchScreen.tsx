import {useLazyQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SEARCH_USERS_BY_NICKNAME} from '../queries/user';
import {colors} from '../styles/colors';
import {searchScreenStyles} from '../styles/searchScreenStyles';

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
    <View style={searchScreenStyles.tabContent}>
      <View style={searchScreenStyles.searchRow}>
        <TextInput
          style={searchScreenStyles.searchInput}
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
        <TouchableOpacity
          style={searchScreenStyles.searchButton}
          onPress={handleSearch}>
          <Text style={searchScreenStyles.searchButtonText}>🔎 검색</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={searchScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={searchScreenStyles.loadingText}>친구를 찾는 중...</Text>
        </View>
      )}

      {!loading && !touched && (
        <View style={searchScreenStyles.welcomeSection}>
          <View style={searchScreenStyles.welcomeIcon}>
            <Text style={searchScreenStyles.welcomeIconText}>👬</Text>
          </View>
          <Text style={searchScreenStyles.welcomeTitle}>친구 찾기</Text>
          <Text style={searchScreenStyles.welcomeSubtitle}>
            닉네임을 입력하여 새로운 친구를 찾아보세요! 🌟
          </Text>
          <View style={searchScreenStyles.tipsContainer}>
            <Text style={searchScreenStyles.tipsTitle}>💡 검색 팁</Text>
            <Text style={searchScreenStyles.tipText}>
              ✨ 정확한 닉네임을 입력하세요
            </Text>
            <Text style={searchScreenStyles.tipText}>
              🔍 부분 검색도 가능합니다
            </Text>
            <Text style={searchScreenStyles.tipText}>
              🤝 찾은 친구를 팔로우할 수 있습니다
            </Text>
          </View>
        </View>
      )}

      {!loading && touched && users.length === 0 && (
        <View style={searchScreenStyles.noResultsSection}>
          <Text style={searchScreenStyles.noResultsIcon}>🔍</Text>
          <Text style={searchScreenStyles.noResultsTitle}>
            검색 결과가 없습니다
          </Text>
          <Text style={searchScreenStyles.noResultsSubtitle}>
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
              style={searchScreenStyles.userItem}
              onPress={() => handleUserPress(item)}>
              <Image
                source={
                  item.profileImage
                    ? {uri: item.profileImage}
                    : require('../../assets/default-profile.jpg')
                }
                style={searchScreenStyles.userAvatar}
              />
              <View style={searchScreenStyles.userInfo}>
                <Text style={searchScreenStyles.userNickname}>
                  🌟 {item.nickname}
                </Text>
                <Text style={searchScreenStyles.userEmail}>
                  📧 {item.email}
                </Text>
                {item.followStatus && (
                  <View style={searchScreenStyles.statusContainer}>
                    <Text style={searchScreenStyles.followedText}>
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
          style={searchScreenStyles.userList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

// 스타일은 searchScreenStyles에서 가져와서 사용

export default FriendSearchScreen;
