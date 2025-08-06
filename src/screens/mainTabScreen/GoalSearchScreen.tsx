import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import GoalList, {Goal} from '../../components/GoalList';
import {SEARCH_GOALS_BY_TITLE} from '../../queries/goal';
import {colors} from '../../styles/colors';
import {searchScreenStyles} from '../../styles/searchScreenStyles';

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
    <View style={searchScreenStyles.tabContent}>
      <View style={searchScreenStyles.searchRow}>
        <TextInput
          style={searchScreenStyles.searchInput}
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
        <TouchableOpacity
          style={searchScreenStyles.searchButton}
          onPress={handleSearch}>
          <Text style={searchScreenStyles.searchButtonText}>🔎 검색</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={searchScreenStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={searchScreenStyles.loadingText}>목표를 찾는 중...</Text>
        </View>
      )}

      {!loading && !touched && (
        <View style={searchScreenStyles.welcomeSection}>
          <View style={searchScreenStyles.goalWelcomeIcon}>
            <Text style={searchScreenStyles.welcomeIconText}>🥇</Text>
          </View>
          <Text style={searchScreenStyles.welcomeTitle}>목표 찾기</Text>
          <Text style={searchScreenStyles.welcomeSubtitle}>
            목표 제목을 입력하여 참여할 목표를 찾아보세요! ⭐
          </Text>
          <View style={searchScreenStyles.tipsContainer}>
            <Text style={searchScreenStyles.tipsTitle}>💡 검색 팁</Text>
            <Text style={searchScreenStyles.tipText}>
              ✨ 정확한 목표 제목을 입력하세요
            </Text>
            <Text style={searchScreenStyles.tipText}>
              🔍 부분 검색도 가능합니다
            </Text>
            <Text style={searchScreenStyles.tipText}>
              🤝 찾은 목표에 참여할 수 있습니다
            </Text>
          </View>
        </View>
      )}

      {!loading && touched && goals.length === 0 && (
        <View style={searchScreenStyles.noResultsSection}>
          <Text style={searchScreenStyles.noResultsIcon}>🔍</Text>
          <Text style={searchScreenStyles.noResultsTitle}>
            검색 결과가 없습니다
          </Text>
          <Text style={searchScreenStyles.noResultsSubtitle}>
            다른 제목으로 다시 검색해보세요! 🥺
          </Text>
        </View>
      )}

      {!loading && touched && goals.length > 0 && (
        <GoalList
          goals={goals}
          onPressGoal={handleGoalPress}
          emptyText=""
          contentContainerStyle={searchScreenStyles.goalList}
        />
      )}
    </View>
  );
};

// 스타일은 searchScreenStyles에서 가져와서 사용

export default GoalSearchScreen;
