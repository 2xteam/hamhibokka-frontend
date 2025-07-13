import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation } from '@apollo/client';
import { CREATE_GOAL } from '../queries/goal';

const CreateGoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stickerCount, setStickerCount] = useState('');
  const [createGoal, { loading }] = useMutation(CREATE_GOAL);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('목표명을 입력해주세요.');
      return;
    }
    if (!stickerCount || isNaN(Number(stickerCount)) || Number(stickerCount) <= 0) {
      Alert.alert('스티커 목표 개수를 올바르게 입력해주세요.');
      return;
    }
    try {
      const { data } = await createGoal({
        variables: {
          input: {
            title,
            description,
            stickerCount: Number(stickerCount),
          },
        },
      });
      if (data?.createGoal) {
        navigation.navigate('GoalDetail', {
          id: data.createGoal.id,
          from: 'CreateGoal'
        });
      }
    } catch (e) {
      Alert.alert('목표 생성에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>새 목표 만들기</Text>
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
        style={[styles.input, { height: 100 }]}
        placeholder="설명을 입력하세요 (선택)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? '저장 중...' : '저장'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 32,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateGoalScreen; 