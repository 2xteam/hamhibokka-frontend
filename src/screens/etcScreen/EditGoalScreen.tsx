import {useMutation, useQuery} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoalForm, {
  GoalFormData,
  GoalMode,
  Visibility,
} from '../../components/GoalForm';
import {ALERT_EMOJIS} from '../../constants/alerts';
import {GoalStatus} from '../../constants/goalStatus';
import {GET_GOAL, UPDATE_GOAL} from '../../queries/goal';

interface EditGoalParams {
  goalId: string;
}

const EditGoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {goalId} = route.params as EditGoalParams;
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(false);

  // 기존 목표 데이터 로드
  const {data: goalData, loading: loadingGoal} = useQuery(GET_GOAL, {
    variables: {id: goalId},
    onCompleted: data => {
      const goal = data.getGoal;
      if (goal) {
        // GoalForm에서 initialData를 통해 데이터를 설정할 예정
      }
    },
  });

  const [updateGoal] = useMutation(UPDATE_GOAL, {
    onCompleted: () => {
      Alert.alert(ALERT_EMOJIS.SUCCESS, '목표가 수정되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.goBack(),
        },
      ]);
    },
    onError: error => {
      Alert.alert(
        ALERT_EMOJIS.ERROR,
        error.message || '목표 수정에 실패했습니다.',
      );
    },
  });

  const handleSubmit = async (formData: GoalFormData) => {
    setLoading(true);
    try {
      await updateGoal({
        variables: {
          id: goalId,
          input: {
            title: formData.title,
            description: formData.description,
            stickerCount: Number(formData.stickerCount),
            goalImage: formData.goalImage,
            mode: formData.mode,
            visibility: formData.visibility,
            status: formData.status,
          },
        },
      });
    } catch (error) {
      console.error('Update goal error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingGoal) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loadingText}>목표 정보를 불러오는 중...</Text>
      </View>
    );
  }

  const goal = goalData?.getGoal;

  if (!goal) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>목표를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  // 초기 데이터 준비
  const initialData: GoalFormData = {
    title: goal.title || '',
    description: goal.description || '',
    stickerCount: goal.stickerCount?.toString() || '',
    goalImage: goal.goalImage,
    mode: (goal.mode as GoalMode) || GoalMode.PERSONAL,
    visibility: (goal.visibility as Visibility) || Visibility.PUBLIC,
    status: (goal.status as GoalStatus) || GoalStatus.ACTIVE,
  };

  return (
    <View style={styles.container}>
      <GoalForm
        initialData={initialData}
        onSubmit={handleSubmit}
        submitButtonText="수정 완료"
        loading={loading}
        disableMode={true}
        showStatus={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F8',
  },
  statusBarArea: {
    backgroundColor: '#F0F8F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8F8',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#4ECDC4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8F8',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
  },
});

export default EditGoalScreen;
