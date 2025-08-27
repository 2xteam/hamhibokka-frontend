import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ProfileHeader from '../../components/ProfileHeader';
import UserList, {User} from '../../components/UserList';
import {getUploadProfileImageUrl} from '../../config/api';
import {
  APPROVE_FOLLOW,
  GET_FOLLOWS,
  GET_MY_PROFILE_IMAGE,
  UPDATE_NICKNAME,
  UPDATE_PROFILE_IMAGE,
} from '../../queries/user';
import {colors} from '../../styles/colors';

interface ProfileUser {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  followerNickname?: string;
  followingNickname?: string;
  followerEmail?: string;
  followerProfileImage?: string;
  followingEmail?: string;
  followingProfileImage?: string;
  status: string;
  approvedAt?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileScreenProps {
  user: User | null;
  onLogout: () => void;
  onUpdateUser?: (updatedUser: User) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onLogout,
  onUpdateUser,
}) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [followsList, setFollowsList] = useState<Follow[]>([]);
  const [actualCurrentUserId, setActualCurrentUserId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [localProfileImage, setLocalProfileImage] = useState<
    string | undefined
  >(user?.profileImage);
  const [localNickname, setLocalNickname] = useState(user?.nickname || '');

  // AsyncStorage 프로필 이미지 업데이트 함수
  const updateAsyncStorageProfileImage = async (newProfileImage: string) => {
    try {
      const userData = await AsyncStorage.getItem('@hamhibokka_user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        const updatedUser = {
          ...currentUser,
          profileImage: newProfileImage,
        };
        await AsyncStorage.setItem(
          '@hamhibokka_user',
          JSON.stringify(updatedUser),
        );
      }
    } catch (error) {
      console.error('Failed to update AsyncStorage profile image:', error);
    }
  };

  const updateAsyncStorageNickname = async (newNickname: string) => {
    try {
      const userData = await AsyncStorage.getItem('@hamhibokka_user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        const updatedUser = {
          ...currentUser,
          nickname: newNickname,
        };
        await AsyncStorage.setItem(
          '@hamhibokka_user',
          JSON.stringify(updatedUser),
        );
      }
    } catch (error) {
      console.error('Failed to update AsyncStorage nickname:', error);
    }
  };

  // user prop이 변경될 때 localProfileImage와 localNickname 업데이트
  useEffect(() => {
    setLocalProfileImage(user?.profileImage);
    setLocalNickname(user?.nickname || '');
  }, [user?.profileImage, user?.nickname]);

  // StatusBar 설정
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor(colors.primary, true);
    }
  }, []);

  // 현재 사용자 ID 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@hamhibokka_user');
        if (userData) {
          const user = JSON.parse(userData);
          setActualCurrentUserId(user.userId);
        }
      } catch (error) {
        console.error('Failed to get current user:', error);
      }
    };

    getCurrentUser();
  }, []);

  // 모든 팔로우 데이터 조회
  const {
    data: followsData,
    loading: followsLoading,
    refetch: refetchFollows,
  } = useQuery(GET_FOLLOWS, {
    variables: {status: null},
    fetchPolicy: 'network-only',
  });

  // 내 프로필 이미지 조회
  const {
    data: profileImageData,
    loading: profileImageLoading,
    refetch: refetchProfileImage,
  } = useQuery(GET_MY_PROFILE_IMAGE, {
    fetchPolicy: 'network-only',
  });

  // 화면 진입 시마다 데이터 새로고침
  useFocusEffect(
    React.useCallback(() => {
      refetchFollows();
      refetchProfileImage();
    }, [refetchFollows, refetchProfileImage]),
  );

  // 프로필 이미지 데이터가 있을 때 로컬 상태 업데이트
  useEffect(() => {
    if (profileImageData?.getMyProfileImage) {
      setLocalProfileImage(profileImageData.getMyProfileImage);

      // AsyncStorage도 업데이트
      updateAsyncStorageProfileImage(profileImageData.getMyProfileImage);
    }
  }, [profileImageData?.getMyProfileImage]);

  // 팔로우 승인 뮤테이션
  const [approveFollow] = useMutation(APPROVE_FOLLOW, {
    onCompleted: () => {
      Alert.alert('😁', '팔로우 요청을 승인했습니다.');
      refetchFollows();
    },
    onError: error => {
      Alert.alert('😣', '팔로우 승인에 실패했습니다.');
      console.error('Approve follow error:', error);
    },
  });

  // 프로필 이미지 업데이트 뮤테이션
  const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMAGE, {
    onCompleted: data => {
      Alert.alert('😁', '프로필 이미지가 업데이트되었습니다!');
      // 사용자 정보 새로고침 로직이 필요하다면 여기에 추가
    },
    onError: error => {
      Alert.alert('😣', '프로필 이미지 업데이트에 실패했습니다.');
      console.error('Update profile image error:', error);
    },
  });

  const [updateNickname] = useMutation(UPDATE_NICKNAME, {
    onCompleted: async data => {
      const newNickname = data.updateNickname.nickname;
      setLocalNickname(newNickname);

      // AsyncStorage 업데이트
      await updateAsyncStorageNickname(newNickname);

      // App.tsx의 사용자 정보 업데이트
      if (onUpdateUser && user) {
        const updatedUser = {
          ...user,
          nickname: newNickname,
        };
        onUpdateUser(updatedUser);
      }

      Alert.alert('😁', '닉네임이 성공적으로 변경되었습니다!');
    },
    onError: error => {
      console.error('Error updating nickname:', error);
      Alert.alert('😣', '닉네임 업데이트에 실패했습니다.');
    },
  });

  // 로컬 사용자 상태 업데이트 함수
  const updateLocalUserProfileImage = async (newProfileImage: string) => {
    try {
      // 로컬 상태 즉시 업데이트
      setLocalProfileImage(newProfileImage);

      // AsyncStorage에서 현재 사용자 정보 가져오기
      const userData = await AsyncStorage.getItem('@hamhibokka_user');
      if (userData) {
        const currentUser = JSON.parse(userData);
        const updatedUser = {
          ...currentUser,
          profileImage: newProfileImage,
        };

        // AsyncStorage 업데이트
        await AsyncStorage.setItem(
          '@hamhibokka_user',
          JSON.stringify(updatedUser),
        );
      }
    } catch (error) {
      console.error('Failed to update local user profile image:', error);
    }
  };

  // 데이터 처리 - 모든 팔로우 데이터
  useEffect(() => {
    if (followsData?.getFollows) {
      setFollowsList(followsData.getFollows);
    } else {
      setFollowsList([]);
    }
  }, [followsData]);

  // 팔로우 데이터를 사용자 형태로 변환
  const convertFollowsToUsers = (): User[] => {
    return followsList.map((follow: Follow) => {
      const isMyRequest = follow.followerId === actualCurrentUserId;
      const isPending = follow.status === 'pending';
      const isApproved = follow.status === 'approved';

      // 내가 보낸 요청인 경우 (followerId가 나인 경우)
      if (isMyRequest) {
        return {
          id: follow.id,
          userId: follow.followingId,
          email: follow.followingEmail || '',
          nickname: follow.followingNickname || follow.followingId,
          profileImage: follow.followingProfileImage,
          followStatus: follow.status,
          followData: follow,
          status: follow.status,
          isMyRequest,
          showApproveButton: false,
          showPendingStatus: isPending,
        } as User & {
          followData: Follow;
          status: string;
          isMyRequest: boolean;
          showApproveButton: boolean;
          showPendingStatus: boolean;
        };
      } else {
        // 내가 받은 요청인 경우 (followingId가 나인 경우)
        return {
          id: follow.id,
          userId: follow.followerId,
          email: follow.followerEmail || '',
          nickname: follow.followerNickname || follow.followerId,
          profileImage: follow.followerProfileImage,
          followStatus: follow.status,
          followData: follow,
          status: follow.status,
          isMyRequest,
          showApproveButton:
            follow.followingId === actualCurrentUserId && isPending,
          showPendingStatus: false,
        } as User & {
          followData: Follow;
          status: string;
          isMyRequest: boolean;
          showApproveButton: boolean;
          showPendingStatus: boolean;
        };
      }
    });
  };

  const handleUserPress = (user: User) => {
    // 사용자 클릭 시 UserProfileScreen으로 이동
    navigation.navigate('UserProfile', {user});
  };

  const handleApproveFollow = (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (user && (user as any).followData) {
      handleApproveFollowById((user as any).followData.id);
    }
  };

  const handleApproveFollowById = (followId: string) => {
    Alert.alert('팔로우 승인', '이 사용자의 팔로우 요청을 승인하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '승인',
        onPress: () => {
          approveFollow({variables: {followId}});
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {text: '로그아웃', style: 'destructive', onPress: onLogout},
    ]);
  };

  const handleNicknameUpdate = async (newNickname: string) => {
    try {
      await updateNickname({
        variables: {
          input: {
            nickname: newNickname,
          },
        },
      });
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  };

  // 이미지 선택 및 업로드
  const handleImageUpload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1024,
        maxHeight: 1024,
      });

      if (result.didCancel || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];

      // 파일 크기 검증 (5MB)
      if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
        Alert.alert('😣', '파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setUploading(true);
      await uploadProfileImage(file);
    } catch (error) {
      console.error('이미지 선택 실패:', error);
      Alert.alert('😣', '이미지 선택에 실패했습니다.');
    }
  };

  // 프로필 이미지 업로드
  const uploadProfileImage = async (file: any) => {
    try {
      // 토큰 가져오기
      const tokenData = await AsyncStorage.getItem('@hamhibokka_token');
      if (!tokenData) {
        throw new Error('토큰을 찾을 수 없습니다.');
      }

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || 'profile-image.jpg',
      } as any);

      // API 서버 경로 설정 (config 파일에서 가져오기)
      const uploadUrl = getUploadProfileImageUrl();

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${tokenData}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '업로드에 실패했습니다.');
      }

      const result = await response.json();

      // GraphQL mutation으로 프로필 이미지 업데이트
      if (user && result.profileImage) {
        await updateProfileImage({
          variables: {
            id: user.id,
            input: {
              profileImage: result.profileImage,
            },
          },
        });

        // 로컬 사용자 정보 업데이트
        await updateLocalUserProfileImage(result.profileImage);

        // App.tsx의 사용자 정보 업데이트
        if (onUpdateUser && user) {
          const updatedUser = {
            ...user,
            profileImage: result.profileImage,
          };
          onUpdateUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('업로드 실패:', error);
      Alert.alert(
        '😣',
        `업로드 실패: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
      );
    } finally {
      setUploading(false);
    }
  };

  const users = convertFollowsToUsers();

  const renderHeader = () => (
    <View style={styles.contentContainer}>
      {/* 프로필 정보 */}
      {/* 프로필 정보 - 보기 전용 */}
      <ProfileHeader
        nickname={localNickname}
        email={user?.email || ''}
        profileImage={localProfileImage}
        showCameraButton={false}
        uploading={false}
        isOwnProfile={false}
      />

      {/* 계정 관리 이동 버튼 */}
      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => navigation.navigate('AccountManagement')}>
        <Text style={styles.manageButtonText}>계정 관리</Text>
      </TouchableOpacity>

      {/* 친구 관리 섹션 */}
      <View style={styles.friendsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.friendsSectionTitle}>👬 친구 관리</Text>
        </View>
        <Text style={styles.friendsSectionSubtitle}>
          💫 총 {users.length}명의 친구가 있어요!
        </Text>

        {followsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>친구 목록을 불러오는 중...</Text>
          </View>
        ) : (
          <UserList
            users={users}
            onPressUser={handleUserPress}
            emptyText="아직 친구가 없어요! 🥺"
            contentContainerStyle={styles.friendsList}
            showFollowStatus={false}
            showApproveButton={true}
            onApproveFollow={handleApproveFollow}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상태바 영역 */}
      <View
        style={[
          styles.statusBarArea,
          {
            height: insets.top,
          },
        ]}
      />

      {/* 메인 컨텐츠 영역 */}
      <SafeAreaView style={styles.safeArea}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>내 프로필</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBarArea: {
    backgroundColor: colors.primary,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    // paddingTop: 2,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerSpacer: {
    width: 90,
    height: 38,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: colors.primaryDark,
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
    marginTop: Platform.OS === 'android' ? 18 : -14,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    marginTop: Platform.OS === 'android' ? 18 : -14,
  },
  logoutButtonText: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: 28,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  profileImageBorder: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
  },
  nickname: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    color: colors.medium,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },

  friendsSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendsSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
  },
  sectionBadge: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 30,
    alignItems: 'center',
  },

  friendsSectionSubtitle: {
    fontSize: 16,
    color: colors.medium,
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: colors.primary,
    fontWeight: '600',
  },
  friendsList: {
    paddingHorizontal: 0,
  },
  manageButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  manageButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadHint: {
    fontSize: 14,
    color: colors.medium,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.primary,
  },
  noImageText: {
    fontSize: 32,
    marginBottom: 4,
  },
  noImageSubText: {
    fontSize: 12,
    color: colors.medium,
    textAlign: 'center',
  },
});

export default ProfileScreen;
