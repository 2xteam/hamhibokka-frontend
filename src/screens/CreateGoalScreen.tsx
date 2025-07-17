import {useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {CREATE_GOAL} from '../queries/goal';

// GoalMode enum 추가
export enum GoalMode {
  PERSONAL = 'personal',
  COMPETITION = 'competition',
  CHALLENGER_RECRUITMENT = 'challenger_recruitment',
}

const CreateGoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stickerCount, setStickerCount] = useState('');
  // mode 상태 추가, 기본값은 PERSONAL
  const [mode, setMode] = useState<GoalMode>(GoalMode.PERSONAL);
  const [createGoal, {loading}] = useMutation(CREATE_GOAL);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('목표명을 입력해주세요.');
      return;
    }
    if (
      !stickerCount ||
      isNaN(Number(stickerCount)) ||
      Number(stickerCount) <= 0
    ) {
      Alert.alert('스티커 목표 개수를 올바르게 입력해주세요.');
      return;
    }
    try {
      const {data} = await createGoal({
        variables: {
          input: {
            title,
            description,
            stickerCount: Number(stickerCount),
            mode, // mode 추가
          },
        },
      });
      if (data?.createGoal) {
        navigation.navigate('GoalDetail', {
          id: data.createGoal.id,
          from: 'CreateGoal',
        });
      }
    } catch (e) {
      Alert.alert('목표 생성에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🥇 새 목표 만들기</Text>
      <TextInput
        style={styles.input}
        placeholder="목표명을 입력하세요"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="스티커 목표 개수"
        value={stickerCount}
        onChangeText={setStickerCount}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, {height: 100}]}
        placeholder="설명을 입력하세요 (선택)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      {/* mode 선택 UI */}
      <View style={{marginBottom: 16}}>
        <Text
          style={{
            marginBottom: 8,
            fontWeight: 'bold',
            fontSize: 16,
            color: '#FF6B9D',
          }}>
          모드 선택
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
          {/* <TouchableOpacity
            style={[
              styles.modeButton,
              mode === GoalMode.COMPETITION && styles.modeButtonSelected,
            ]}
            onPress={() => setMode(GoalMode.COMPETITION)}>
            <Text
              style={
                mode === GoalMode.COMPETITION
                  ? styles.modeButtonTextSelected
                  : styles.modeButtonText
              }>
              경쟁
            </Text>
          </TouchableOpacity> */}
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
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}>
        <Text style={styles.saveButtonText}>
          {loading ? '만드는 중...' : '만들기'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 32,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFE5F0',
    color: '#8E44AD',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // mode 버튼 스타일 추가
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE5F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#FF6B9D',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButtonSelected: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  modeButtonText: {
    color: '#8E44AD',
    fontWeight: 'bold',
  },
  modeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CreateGoalScreen;
