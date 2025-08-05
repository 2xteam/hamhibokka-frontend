import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../styles/colors';

interface ProfileHeaderProps {
  nickname: string;
  email: string;
  profileImage?: string;
  showCameraButton?: boolean;
  onCameraPress?: () => void;
  uploading?: boolean;
  isOwnProfile?: boolean;
  onNicknameUpdate?: (newNickname: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  nickname,
  email,
  profileImage,
  showCameraButton = false,
  onCameraPress,
  uploading = false,
  isOwnProfile = false,
  onNicknameUpdate,
}) => {
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editingNickname, setEditingNickname] = useState(nickname);

  return (
    <>
      <View style={styles.profileSection}>
        <View style={styles.profileImageWrapper}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => {
              if (profileImage) {
                setImageModalVisible(true);
              }
            }}
            disabled={uploading}>
            <Image
              source={
                profileImage
                  ? {uri: profileImage}
                  : require('../../assets/default-profile.jpg')
              }
              style={styles.profileImage}
            />
            <View style={styles.profileImageBorder} />
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="small" color={colors.white} />
              </View>
            )}
          </TouchableOpacity>

          {/* 카메라 아이콘 버튼 - 내 프로필일 때만 표시 */}
          {showCameraButton && isOwnProfile && (
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={onCameraPress}
              disabled={uploading}>
              <Text style={styles.cameraIcon}>📷</Text>
            </TouchableOpacity>
          )}
        </View>
        {isEditingNickname ? (
          <View style={styles.nicknameEditContainer}>
            <TextInput
              style={styles.nicknameInput}
              value={editingNickname}
              onChangeText={text => {
                if (text.length <= 12) {
                  setEditingNickname(text);
                }
              }}
              placeholder="닉네임을 입력하세요."
              placeholderTextColor={colors.medium}
              maxLength={12}
              autoFocus
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  if (onNicknameUpdate && editingNickname.trim()) {
                    onNicknameUpdate(editingNickname.trim());
                    setIsEditingNickname(false);
                  }
                }}>
                <Text style={styles.editButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.editButton, styles.cancelButton]}
                onPress={() => {
                  setEditingNickname(nickname);
                  setIsEditingNickname(false);
                }}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.nicknameContainer}
            onPress={() => {
              if (isOwnProfile && onNicknameUpdate) {
                setIsEditingNickname(true);
              }
            }}
            disabled={!isOwnProfile || !onNicknameUpdate}>
            <Text style={styles.nickname}>🌟 {nickname}</Text>
            {isOwnProfile && onNicknameUpdate && (
              <Text style={styles.editIcon}>✏️</Text>
            )}
          </TouchableOpacity>
        )}
        <Text style={styles.email}>📧 {email}</Text>
      </View>

      {/* 이미지 확대 모달 */}
      <Modal
        visible={imageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setImageModalVisible(false)}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={() => {}}>
              <Image
                source={{uri: profileImage}}
                style={styles.expandedImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setImageModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#4ECDC4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImageContainer: {
    marginBottom: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  profileImageBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.primary,
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
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: -5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraIcon: {
    fontSize: 16,
    color: colors.white,
  },
  nicknameEditContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  nicknameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    minWidth: 200,
  },
  editButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: colors.medium,
  },
  cancelButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  nicknameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nickname: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  editIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  email: {
    fontSize: 16,
    color: colors.medium,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedImage: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileHeader;
