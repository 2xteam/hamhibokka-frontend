import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GET_GOALS_BY_USER_ID} from '../queries/goal';
import {CREATE_FOLLOW} from '../queries/user';
import GoalList, {Goal} from './components/GoalList';

interface UserProfileParams {
  user: {
    id: string;
    userId: string;
    email: string;
    nickname: string;
    profileImage?: string;
    isFollowed?: boolean;
  };
}

const UserProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<Record<string, UserProfileParams>, string>>();
  const {user} = route.params;

  const [isFollowed, setIsFollowed] = useState(user.isFollowed || false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  // 현재 사용자 ID 가져오기
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

  // 사용자의 목표 조회
  const {data: goalsData, loading: goalsLoading} = useQuery(
    GET_GOALS_BY_USER_ID,
    {
      variables: {userId: user.userId},
    },
  );

  // 팔로우 생성 뮤테이션
  const [createFollow] = useMutation(CREATE_FOLLOW, {
    onCompleted: data => {
      setIsFollowed(true);
      setIsLoading(false);
      Alert.alert('성공', '팔로우 요청을 보냈습니다.');
    },
    onError: error => {
      setIsLoading(false);
      Alert.alert('오류', '팔로우 요청에 실패했습니다.');
      console.error('Create follow error:', error);
    },
  });

  const handleFollowToggle = async () => {
    if (!user || !currentUserId || isLoading || isFollowed) return;

    setIsLoading(true);

    // 팔로우만 가능 (취소 기능 비활성화)
    await createFollow({
      variables: {
        input: {
          followerId: currentUserId,
          followingId: user.userId,
        },
      },
    });
  };

  // 자기 자신의 프로필인지 확인
  const isOwnProfile = user.userId === currentUserId;

  const goals: Goal[] = goalsData?.getGoalsByUserId || [];

  // 목표 클릭 핸들러
  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {
      id: goal.id,
      from: 'UserProfile',
    });
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content}>
        {/* 프로필 정보 */}
        <View style={styles.profileSection}>
          <Image
            source={
              user.profileImage
                ? {uri: user.profileImage}
                : require('../../assets/default-profile.jpg')
            }
            style={styles.profileImage}
          />
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* 팔로우 버튼 - 자기 자신이 아니고 팔로우하지 않은 경우에만 표시 */}
        {!isOwnProfile && !isFollowed && (
          <TouchableOpacity
            style={[styles.followButton, isLoading && styles.disabledButton]}
            onPress={handleFollowToggle}
            disabled={isLoading}>
            <Text style={styles.followButtonText}>
              {isLoading ? '처리 중...' : '팔로우'}
            </Text>
          </TouchableOpacity>
        )}

        {/* 팔로우 중인 경우 상태 표시 */}
        {!isOwnProfile && isFollowed && (
          <View style={styles.followedStatus}>
            <Text style={styles.followedStatusText}>팔로우 중</Text>
          </View>
        )}

        {/* 목표 리스트 섹션 */}
        <View style={styles.goalsSection}>
          <Text style={styles.goalsSectionTitle}>
            {isOwnProfile ? '내 목표' : `${user.nickname}의 목표`}
          </Text>
          {goalsLoading ? (
            <ActivityIndicator style={styles.goalsLoading} />
          ) : (
            <GoalList
              goals={goals}
              onPressGoal={handleGoalPress}
              emptyText="등록된 목표가 없습니다."
              contentContainerStyle={styles.goalsList}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E6ED',
    marginBottom: 16,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  followButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  followedStatus: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  followedStatusText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  goalsSection: {
    flex: 1,
  },
  goalsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 12,
  },
  goalsLoading: {
    marginTop: 10,
  },
  goalsList: {
    paddingHorizontal: 0,
  },
});

export default UserProfileScreen;
