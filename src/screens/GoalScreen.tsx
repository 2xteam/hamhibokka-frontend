import {useQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GET_GOALS} from '../queries/goal';
import FloatingAddGoalButton from './components/FloatingAddGoalButton';

const GoalScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {data, loading, error, refetch} = useQuery(GET_GOALS);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => navigation.navigate('GoalDetail', {id: item.id})}>
      <Text style={styles.goalTitle}>{item.title}</Text>
      <Text style={styles.goalDesc}>{item.description || '설명 없음'}</Text>
      <Text style={styles.stickerCount}>
        스티커 목표: {item.stickerCount ?? '-'}개
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text>목표를 불러올 수 없습니다.</Text>
      </View>
    );
  }
  const goals = data?.getGoals || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>나의 목표</Text>
      {goals.length === 0 ? (
        <Text style={styles.emptyText}>아직 등록된 목표가 없습니다.</Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <FloatingAddGoalButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 24,
    alignSelf: 'center',
  },
  listContainer: {
    paddingBottom: 40,
  },
  goalItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  goalDesc: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  stickerCount: {
    fontSize: 13,
    color: '#F39C12',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default GoalScreen;
