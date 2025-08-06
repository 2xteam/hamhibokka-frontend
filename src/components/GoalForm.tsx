import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {getUploadGoalImageUrl} from '../config/api';
import {ALERT_EMOJIS} from '../constants/alerts';
import {GoalStatus} from '../constants/goalStatus';

// GoalMode enum 추가
export enum GoalMode {
  PERSONAL = 'personal',
  COMPETITION = 'competition',
  CHALLENGER_RECRUITMENT = 'challenger_recruitment',
}

// Visibility enum 추가
export enum Visibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FOLLOWERS = 'followers',
}

export interface GoalFormData {
  title: string;
  description: string;
  stickerCount: string;
  goalImage?: string;
  mode: GoalMode;
  visibility: Visibility;
  status: GoalStatus;
}

interface GoalFormProps {
  initialData?: GoalFormData;
  onSubmit: (data: GoalFormData) => Promise<void>;
  submitButtonText: string;
  loading?: boolean;
  disableMode?: boolean;
  showStatus?: boolean;
}

const GoalForm: React.FC<GoalFormProps> = ({
  initialData,
  onSubmit,
  submitButtonText,
  loading = false,
  disableMode = false,
  showStatus = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [stickerCount, setStickerCount] = useState(
    initialData?.stickerCount || '10',
  );
  const [mode, setMode] = useState<GoalMode>(
    initialData?.mode || GoalMode.PERSONAL,
  );
  const [visibility, setVisibility] = useState<Visibility>(
    initialData?.visibility || Visibility.PUBLIC,
  );
  const [status, setStatus] = useState<GoalStatus>(
    initialData?.status || GoalStatus.ACTIVE,
  );
  const [goalImage, setGoalImage] = useState<string | undefined>(
    initialData?.goalImage,
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadGoalImage = async (file: any): Promise<string> => {
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
        name: file.fileName || 'goal-image.jpg',
      } as any);

      // API 서버 경로 설정 (config 파일에서 가져오기)
      const uploadUrl = getUploadGoalImageUrl();

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
      return result.goalImage; // goalImage 필드로 응답 받음
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(
        `이미지 업로드에 실패했습니다: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`,
      );
    }
  };

  const handleImageUpload = async () => {
    try {
      setUploadingImage(true);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      });

      if (result.assets && result.assets[0]) {
        const imageUrl = await uploadGoalImage(result.assets[0]);
        setGoalImage(imageUrl);
        Alert.alert(ALERT_EMOJIS.SUCCESS, '이미지가 업로드되었습니다!');
      }
    } catch (error) {
      console.error('Image selection error:', error);
      Alert.alert(ALERT_EMOJIS.ERROR, '이미지 선택에 실패했습니다.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert(ALERT_EMOJIS.ERROR, '목표명을 입력해주세요.');
      return;
    }
    if (
      !stickerCount ||
      isNaN(Number(stickerCount)) ||
      Number(stickerCount) <= 0
    ) {
      Alert.alert(
        ALERT_EMOJIS.ERROR,
        '스티커 목표 개수를 올바르게 입력해주세요.',
      );
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        stickerCount,
        goalImage,
        mode,
        visibility,
        status,
      });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.titleSection}>
          <Text style={styles.titleLabel}>🎯 목표 이름</Text>
          <TextInput
            style={styles.input}
            placeholder="재미있는 목표를 만들어보세요!"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 두 번째 줄: 스티커 개수, 모드 선택, 이미지 업로드 */}
        <View style={styles.secondRow}>
          {/* 좌측: 스티커 개수와 모드 선택 */}
          <View style={styles.leftSection}>
            {/* 스티커 개수 조절 */}
            <View style={styles.stickerSection}>
              <Text style={styles.stickerLabel}>⭐ 스티커 목표 개수</Text>
              <View style={styles.stickerControl}>
                <TouchableOpacity
                  style={styles.stickerButton}
                  onPress={() => {
                    const current = parseInt(stickerCount) || 10;
                    if (current > 1) {
                      setStickerCount((current - 1).toString());
                    }
                  }}>
                  <Text style={styles.stickerButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stickerCount}>{stickerCount}</Text>
                <TouchableOpacity
                  style={styles.stickerButton}
                  onPress={() => {
                    const current = parseInt(stickerCount) || 10;
                    setStickerCount((current + 1).toString());
                  }}>
                  <Text style={styles.stickerButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 모드 선택 */}
            {!disableMode && (
              <View style={styles.modeSection}>
                <Text style={styles.modeLabel}>🎮 모드 선택</Text>
                <View style={styles.modeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      mode === GoalMode.PERSONAL && styles.modeButtonSelected,
                    ]}
                    onPress={() => setMode(GoalMode.PERSONAL)}>
                    <Text
                      style={
                        mode === GoalMode.PERSONAL
                          ? styles.modeButtonTextSelected
                          : styles.modeButtonText
                      }>
                      개인
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeButton,
                      mode === GoalMode.CHALLENGER_RECRUITMENT &&
                        styles.modeButtonSelected,
                    ]}
                    onPress={() => setMode(GoalMode.CHALLENGER_RECRUITMENT)}>
                    <Text
                      style={
                        mode === GoalMode.CHALLENGER_RECRUITMENT
                          ? styles.modeButtonTextSelected
                          : styles.modeButtonText
                      }>
                      챌린저
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* 우측: 이미지 업로드 */}
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>📸 목표 이미지</Text>
            <TouchableOpacity
              style={styles.largeImageUploadButton}
              onPress={handleImageUpload}
              disabled={uploadingImage}>
              {goalImage ? (
                <View style={styles.largeImagePreviewContainer}>
                  <Image
                    source={{uri: goalImage}}
                    style={styles.largeImagePreview}
                  />
                  <TouchableOpacity
                    style={styles.largeRemoveImageButton}
                    onPress={() => setGoalImage(undefined)}>
                    <Text style={styles.largeRemoveImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.largeUploadPlaceholder}>
                  <Text style={styles.largeUploadIcon}>📷</Text>
                  <Text style={styles.largeUploadText}>
                    {uploadingImage ? '업로드 중...' : '이미지 선택'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionLabel}>📝 목표 설명 (선택)</Text>
          <TextInput
            style={[styles.input, {height: 100}]}
            placeholder="목표에 대해 자세히 설명해보세요!"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* 공개 범위 선택 UI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 공개 범위</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                visibility === Visibility.PUBLIC && styles.modeButtonSelected,
              ]}
              onPress={() => setVisibility(Visibility.PUBLIC)}>
              <Text
                style={
                  visibility === Visibility.PUBLIC
                    ? styles.modeButtonTextSelected
                    : styles.modeButtonText
                }>
                공개
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                visibility === Visibility.FOLLOWERS &&
                  styles.modeButtonSelected,
              ]}
              onPress={() => setVisibility(Visibility.FOLLOWERS)}>
              <Text
                style={
                  visibility === Visibility.FOLLOWERS
                    ? styles.modeButtonTextSelected
                    : styles.modeButtonText
                }>
                팔로워
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                visibility === Visibility.PRIVATE && styles.modeButtonSelected,
              ]}
              onPress={() => setVisibility(Visibility.PRIVATE)}>
              <Text
                style={
                  visibility === Visibility.PRIVATE
                    ? styles.modeButtonTextSelected
                    : styles.modeButtonText
                }>
                비공개
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 목표 상태 선택 UI */}
        {showStatus && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 목표 상태</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  status === GoalStatus.ACTIVE && styles.modeButtonSelected,
                ]}
                onPress={() => setStatus(GoalStatus.ACTIVE)}>
                <Text
                  style={
                    status === GoalStatus.ACTIVE
                      ? styles.modeButtonTextSelected
                      : styles.modeButtonText
                  }>
                  🟢 진행 중
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  status === GoalStatus.COMPLETED && styles.modeButtonSelected,
                ]}
                onPress={() => setStatus(GoalStatus.COMPLETED)}>
                <Text
                  style={
                    status === GoalStatus.COMPLETED
                      ? styles.modeButtonTextSelected
                      : styles.modeButtonText
                  }>
                  ✅ 완료
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  status === GoalStatus.CANCELLED && styles.modeButtonSelected,
                ]}
                onPress={() => setStatus(GoalStatus.CANCELLED)}>
                <Text
                  style={
                    status === GoalStatus.CANCELLED
                      ? styles.modeButtonTextSelected
                      : styles.modeButtonText
                  }>
                  ❌ 취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}
          disabled={loading}>
          <Text style={styles.saveButtonText}>
            {loading ? '🔄 저장 중...' : `🚀 ${submitButtonText}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E8F8F5',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#4ECDC4',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  modeButtonSelected: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  modeButtonText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
  modeButtonTextSelected: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#3DB8B0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageUploadButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  uploadText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '600',
  },
  stickerImageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stickerContainer: {
    flex: 1,
    marginRight: 16,
  },
  stickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  stickerControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8F8F5',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  stickerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ECDC4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stickerCount: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  imageContainer: {
    width: '50%',
    marginLeft: 8,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  smallImageUploadButton: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F8F5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallImagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  smallImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  smallRemoveImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallRemoveImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  smallUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallUploadIcon: {
    fontSize: 24,
  },
  secondRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leftSection: {
    width: '50%',
    marginRight: 8,
  },
  stickerSection: {
    marginBottom: 12,
  },
  modeSection: {
    marginBottom: 0,
  },
  modeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  modeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largeImageUploadButton: {
    width: '90%',
    height: 140,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E8F8F5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeImagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  largeImagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  largeRemoveImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeRemoveImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  largeUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeUploadIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  largeUploadText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'center',
  },
  titleSection: {
    marginBottom: 16,
  },
  titleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  descriptionSection: {
    marginBottom: 16,
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
});

export default GoalForm;
