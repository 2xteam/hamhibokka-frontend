import {useMutation} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import GoalForm, {GoalFormData} from '../../components/GoalForm';
import {ALERT_EMOJIS} from '../../constants/alerts';
import {CREATE_GOAL} from '../../queries/goal';

const CreateGoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [createGoal] = useMutation(CREATE_GOAL);
  const insets = useSafeAreaInsets();

  const handleSubmit = async (formData: GoalFormData) => {
    setLoading(true);
    try {
      const {data} = await createGoal({
        variables: {
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
      if (data?.createGoal) {
        navigation.navigate('GoalDetail', {
          id: data.createGoal.id,
          from: 'CreateGoal',
        });
      }
    } catch (e) {
      Alert.alert(ALERT_EMOJIS.ERROR, '목표 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GoalForm
        onSubmit={handleSubmit}
        submitButtonText="목표 만들기"
        loading={loading}
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
});

export default CreateGoalScreen;
