import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
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
import {colors} from '../styles/colors';
import GoalList, {Goal} from './components/GoalList';

const GoalSearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [title, setTitle] = useState('');
  const [search, {data, loading}] = useLazyQuery(SEARCH_GOALS_BY_TITLE);
  const [touched, setTouched] = useState(false);

  const handleSearch = () => {
    setTouched(true);
    if (title.trim()) {
      search({variables: {title: title.trim()}});
    }
  };

  const handleGoalPress = (goal: Goal) => {
    navigation.navigate('GoalDetail', {id: goal.id});
  };

  const goals: Goal[] = data?.searchGoalsByTitle || [];

  return (
    <View style={styles.tabContent}>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="🥇 목표 제목으로 찾기"
          placeholderTextColor={colors.medium}
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔎 검색</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>목표를 찾는 중...</Text>
        </View>
      )}

      {!loading && !touched && (
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <Text style={styles.welcomeIconText}>🥇</Text>
          </View>
          <Text style={styles.welcomeTitle}>목표 찾기</Text>
          <Text style={styles.welcomeSubtitle}>
            목표 제목을 입력하여 참여할 목표를 찾아보세요! ⭐
          </Text>
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>💡 검색 팁</Text>
            <Text style={styles.tipText}>✨ 정확한 목표 제목을 입력하세요</Text>
            <Text style={styles.tipText}>🔍 부분 검색도 가능합니다</Text>
            <Text style={styles.tipText}>
              🤝 찾은 목표에 참여할 수 있습니다
            </Text>
          </View>
        </View>
      )}

      {!loading && touched && goals.length === 0 && (
        <View style={styles.noResultsSection}>
          <Text style={styles.noResultsIcon}>🔍</Text>
          <Text style={styles.noResultsTitle}>검색 결과가 없습니다</Text>
          <Text style={styles.noResultsSubtitle}>
            다른 제목으로 다시 검색해보세요! 🥺
          </Text>
        </View>
      )}

      {!loading && touched && goals.length > 0 && (
        <GoalList
          goals={goals}
          onPressGoal={handleGoalPress}
          emptyText=""
          contentContainerStyle={styles.goalList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    marginRight: 12,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  welcomeSection: {
    alignItems: 'center',
    marginTop: 20,
    padding: 28,
    backgroundColor: colors.white,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  welcomeIconText: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '600',
  },
  tipsContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: 12,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 14,
    color: colors.dark,
    marginBottom: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  noResultsSection: {
    alignItems: 'center',
    marginTop: 20,
    padding: 28,
    backgroundColor: colors.white,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  noResultsIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: 16,
    color: colors.dark,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
  },
  goalList: {
    marginTop: 16,
  },
});

export default GoalSearchScreen;
