import {useLazyQuery} from '@apollo/client';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SEARCH_GOALS_BY_TITLE} from '../queries/goal';
import GoalList, {Goal} from './components/GoalList';

const GoalSearchScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [search, {data, loading}] = useLazyQuery(SEARCH_GOALS_BY_TITLE);
  const [touched, setTouched] = useState(false);

  const handleSearch = () => {
    setTouched(true);
    if (title.trim()) {
      search({variables: {title: title.trim()}});
    }
  };

  const goals: Goal[] = data?.searchGoalsByTitle || [];

  return (
    <View style={styles.tabContent}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="목표 제목으로 찾기"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator style={{marginTop: 20}} />}
      <GoalList
        goals={goals}
        emptyText={
          touched && !loading && goals.length === 0
            ? '검색 결과가 없습니다.'
            : ''
        }
        contentContainerStyle={{marginTop: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  searchHint: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default GoalSearchScreen;
