// src/screens/home/HomeScreen.tsx
import React from 'react';
import {View, Text, ScrollView, RefreshControl} from 'react-native';
import {useQuery} from '@apollo/client';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';

import {Card} from '../../components/common/Card';
import {Avatar} from '../../components/common/Avatar';
import {Button} from '../../components/common/Button';
import {Colors, Spacing, Typography} from '../../theme';
import {MY_GOALS_QUERY, FOLLOWING_GOALS_QUERY} from '../../graphql/goals';
import {currentUserState} from '../../state/authState';
import {GoalCard} from '../goal/GoalCard';
import {StickerButton} from '@/components/sticker/StickerButton';
// import {GoalCard} from '../../components/goal/GoalCard';
// import {StickerButton} from '../../components/sticker/StickerButton';

const Container = styled(View)`
  flex: 1;
  background-color: ${Colors.surface};
`;

const Header = styled(View)`
  background-color: ${Colors.background};
  padding: ${Spacing.lg}px;
  padding-top: ${Spacing.xxl}px;
`;

const UserInfo = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${Spacing.md}px;
`;

const UserDetails = styled(View)`
  margin-left: ${Spacing.md}px;
  flex: 1;
`;

const UserName = styled(Text)`
  font-size: ${Typography.h3.fontSize}px;
  font-weight: ${Typography.h3.fontWeight};
  color: ${Colors.textPrimary};
`;

const UserStats = styled(Text)`
  font-size: ${Typography.bodySmall.fontSize}px;
  color: ${Colors.textSecondary};
  margin-top: ${Spacing.xs}px;
`;

const QuickActions = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

const SectionTitle = styled(Text)`
  font-size: ${Typography.h4.fontSize}px;
  font-weight: ${Typography.h4.fontWeight};
  color: ${Colors.textPrimary};
  margin: ${Spacing.lg}px ${Spacing.lg}px ${Spacing.md}px;
`;

const EmptyState = styled(View)`
  align-items: center;
  padding: ${Spacing.xl}px;
`;

const EmptyText = styled(Text)`
  font-size: ${Typography.bodyMedium.fontSize}px;
  color: ${Colors.textSecondary};
  text-align: center;
  margin-bottom: ${Spacing.md}px;
`;

export const HomeScreen: React.FC = ({navigation}: any) => {
  const currentUser = useRecoilValue(currentUserState);

  const {
    data: myGoalsData,
    loading: myGoalsLoading,
    refetch: refetchMyGoals,
  } = useQuery(MY_GOALS_QUERY, {
    variables: {status: 'ACTIVE'},
  });

  const {
    data: followingGoalsData,
    loading: followingGoalsLoading,
    refetch: refetchFollowingGoals,
  } = useQuery(FOLLOWING_GOALS_QUERY);

  const handleRefresh = () => {
    refetchMyGoals();
    refetchFollowingGoals();
  };

  const renderMyGoals = () => {
    if (myGoalsLoading) return null;

    const goals = myGoalsData?.myGoals || [];

    if (goals.length === 0) {
      return (
        <Card>
          <EmptyState>
            <EmptyText>아직 진행 중인 목표가 없습니다</EmptyText>
            <Button
              title="첫 목표 만들기"
              onPress={() =>
                navigation.navigate('Goals', {screen: 'CreateGoal'})
              }
              variant="outline"
            />
          </EmptyState>
        </Card>
      );
    }

    return goals.slice(0, 3).map((goal: any) => (
      <GoalCard
        key={goal.id}
        goal={goal}
        onPress={() =>
          navigation.navigate('Goals', {
            screen: 'GoalDetail',
            params: {goalId: goal.id},
          })
        }
      />
    ));
  };

  const renderFollowingGoals = () => {
    if (followingGoalsLoading) return null;

    const goals = followingGoalsData?.followingGoals || [];

    if (goals.length === 0) {
      return (
        <Card>
          <EmptyState>
            <EmptyText>팔로우하는 사용자의 목표가 없습니다</EmptyText>
            <Button
              title="사용자 찾기"
              onPress={() => navigation.navigate('Explore')}
              variant="outline"
            />
          </EmptyState>
        </Card>
      );
    }

    return goals.slice(0, 5).map((goal: any) => (
      <Card key={goal.id}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.md,
          }}>
          <Avatar
            size="small"
            imageUri={goal.createdBy.profileImage}
            name={goal.createdBy.nickname}
          />
          <View style={{marginLeft: Spacing.sm, flex: 1}}>
            <Text style={{fontWeight: '600', color: Colors.textPrimary}}>
              {goal.createdBy.nickname}
            </Text>
            <Text style={{fontSize: 12, color: Colors.textSecondary}}>
              {goal.title}
            </Text>
          </View>
          <StickerButton
            goalId={goal.id}
            recipientId={goal.createdBy.id}
            size="small"
          />
        </View>
      </Card>
    ));
  };

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={myGoalsLoading || followingGoalsLoading}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }>
        <Header>
          <UserInfo>
            <Avatar
              size="large"
              imageUri={currentUser?.profileImage}
              name={currentUser?.nickname}
            />
            <UserDetails>
              <UserName>{currentUser?.nickname}</UserName>
              <UserStats>
                팔로워 {currentUser?.followerCount} · 팔로잉{' '}
                {currentUser?.followingCount}
              </UserStats>
            </UserDetails>
          </UserInfo>

          <QuickActions>
            <Button
              title="목표 만들기"
              onPress={() =>
                navigation.navigate('Goals', {screen: 'CreateGoal'})
              }
              size="small"
              style={{flex: 1, marginRight: Spacing.sm}}
            />
            <Button
              title="챌린저 찾기"
              onPress={() => navigation.navigate('Explore')}
              variant="outline"
              size="small"
              style={{flex: 1, marginLeft: Spacing.sm}}
            />
          </QuickActions>
        </Header>

        <SectionTitle>내 목표</SectionTitle>
        {renderMyGoals()}

        <SectionTitle>팔로잉 피드</SectionTitle>
        {renderFollowingGoals()}
      </ScrollView>
    </Container>
  );
};
