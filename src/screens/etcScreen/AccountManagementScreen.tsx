import {useMutation} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import ProfileHeader from '../../components/ProfileHeader';
import {getUploadProfileImageUrl} from '../../config/api';
import {
  DELETE_USER,
  UPDATE_NICKNAME,
  UPDATE_PROFILE_IMAGE,
} from '../../queries/user';
import {colors} from '../../styles/colors';

interface UserLike {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface AccountManagementProps {
  user?: UserLike | null;
  onUpdateUser?: (updatedUser: UserLike) => void;
  onLogout?: () => void;
}

const AccountManagementScreen: React.FC<AccountManagementProps> = ({
  user: initialUser,
  onUpdateUser,
  onLogout,
}) => {
  const [user, setUser] = useState<UserLike | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (initialUser) {
        setUser(initialUser);
        return;
      }
      const userData = await AsyncStorage.getItem('@hamhibokka_user');
      if (userData) setUser(JSON.parse(userData));
    };
    load();
  }, []);

  const [updateProfileImage] = useMutation(UPDATE_PROFILE_IMAGE, {
    onCompleted: async data => {
      Alert.alert('😁', '프로필 이미지가 업데이트되었습니다!');
    },
    onError: error => {
      Alert.alert('😣', '프로필 이미지 업데이트에 실패했습니다.');
      console.error('Update profile image error:', error);
    },
  });

  const [updateNickname] = useMutation(UPDATE_NICKNAME, {
    onCompleted: async data => {
      const newNickname = data.updateNickname.nickname;
      if (user) {
        const updated = {...user, nickname: newNickname};
        await AsyncStorage.setItem('@hamhibokka_user', JSON.stringify(updated));
        setUser(updated);
        if (onUpdateUser) {
          onUpdateUser(updated);
        }
      }
      Alert.alert('😁', '닉네임이 성공적으로 변경되었습니다!');
    },
    onError: error => {
      console.error('Error updating nickname:', error);
      Alert.alert('😣', '닉네임 업데이트에 실패했습니다.');
    },
  });

  const [deleteUserMutation] = useMutation(DELETE_USER, {
    onCompleted: async () => {
      Alert.alert('👋', '계정이 삭제되었습니다. 이용해 주셔서 감사합니다.');
      await AsyncStorage.multiRemove(['@hamhibokka_token', '@hamhibokka_user']);
      if (onLogout) {
        onLogout();
      }
    },
    onError: error => {
      console.error('Delete user error:', error);
      Alert.alert(
        '😣',
        '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      );
    },
  });

  const handleNicknameUpdate = async (newNickname: string) => {
    try {
      await updateNickname({variables: {input: {nickname: newNickname}}});
    } catch (e) {}
  };

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
      if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
        Alert.alert('😣', '파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setUploading(true);

      const tokenData = await AsyncStorage.getItem('@hamhibokka_token');
      if (!tokenData) throw new Error('토큰을 찾을 수 없습니다.');

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'image/jpeg',
        name: file.fileName || 'profile-image.jpg',
      } as any);

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

      const resultJson = await response.json();
      if (user && resultJson.profileImage) {
        await updateProfileImage({
          variables: {
            id: user.id,
            input: {profileImage: resultJson.profileImage},
          },
        });

        const updated = {...user, profileImage: resultJson.profileImage};
        await AsyncStorage.setItem('@hamhibokka_user', JSON.stringify(updated));
        setUser(updated);
        if (onUpdateUser) {
          onUpdateUser(updated);
        }
      }
    } catch (error) {
      console.error('이미지 선택/업로드 실패:', error);
      Alert.alert('😣', '이미지 처리에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const confirmDeleteAccount = () => {
    if (!user) return;
    Alert.alert(
      '탈퇴🥲',
      '계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다. 정말 삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => deleteUserMutation({variables: {id: user.id}}),
        },
      ],
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileHeader
        nickname={user.nickname}
        email={user.email}
        profileImage={user.profileImage}
        showCameraButton={true}
        onCameraPress={handleImageUpload}
        uploading={uploading}
        isOwnProfile={true}
        onNicknameUpdate={handleNicknameUpdate}
      />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={confirmDeleteAccount}>
        <Text style={styles.deleteButtonText}>회원 탈퇴🥲</Text>
      </TouchableOpacity>

      <Text style={styles.helperText}>
        프로필 이미지를 탭하면 확대됩니다. 닉네임 영역을 탭해 편집할 수 있어요.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#C62828',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helperText: {
    marginTop: 12,
    textAlign: 'center',
    color: colors.medium,
  },
  loading: {
    marginTop: Platform.OS === 'android' ? 40 : 80,
    textAlign: 'center',
    color: colors.medium,
  },
});

export default AccountManagementScreen;
