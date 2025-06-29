import {useQuery, useMutation} from '@apollo/client';
import {useRecoilState} from 'recoil';

import {myGoalsState, followingGoalsState} from '../state/goalState';
import {
  MY_GOALS_QUERY,
  FOLLOWING_GOALS_QUERY,
  CREATE_GOAL_MUTATION,
  JOIN_GOAL_MUTATION,
} from '../graphql/goals';

export const useGoals = () => {
  const [myGoals, setMyGoals] = useRecoilState(myGoalsState);
  const [followingGoals, setFollowingGoals] =
    useRecoilState(followingGoalsState);

  const {
    data: myGoalsData,
    loading: myGoalsLoading,
    refetch: refetchMyGoals,
  } = useQuery(MY_GOALS_QUERY, {
    onCompleted: data => {
      setMyGoals(data.myGoals);
    },
  });

  const {
    data: followingGoalsData,
    loading: followingGoalsLoading,
    refetch: refetchFollowingGoals,
  } = useQuery(FOLLOWING_GOALS_QUERY, {
    onCompleted: data => {
      setFollowingGoals(data.followingGoals);
    },
  });

  const [createGoalMutation, {loading: createGoalLoading}] = useMutation(
    CREATE_GOAL_MUTATION,
    {
      refetchQueries: [{query: MY_GOALS_QUERY}],
    },
  );

  const [joinGoalMutation, {loading: joinGoalLoading}] = useMutation(
    JOIN_GOAL_MUTATION,
    {
      refetchQueries: [{query: FOLLOWING_GOALS_QUERY}],
    },
  );

  const createGoal = async (goalInput: any) => {
    try {
      const {data} = await createGoalMutation({
        variables: {input: goalInput},
      });
      return {success: true, goal: data.createGoal};
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        errorMessage = String((error as any).message);
      }
      return {success: false, error: errorMessage};
    }
  };

  const joinGoal = async (goalId: string) => {
    try {
      const {data} = await joinGoalMutation({
        variables: {goalId},
      });
      return {success: true, participation: data.joinGoal};
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        errorMessage = String((error as any).message);
      }
      return {success: false, error: errorMessage};
    }
  };

  const refreshGoals = () => {
    refetchMyGoals();
    refetchFollowingGoals();
  };

  return {
    myGoals,
    followingGoals,
    myGoalsLoading,
    followingGoalsLoading,
    createGoal,
    createGoalLoading,
    joinGoal,
    joinGoalLoading,
    refreshGoals,
  };
};
