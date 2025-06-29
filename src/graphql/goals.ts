// src/graphql/goals.ts
import {gql} from '@apollo/client';

export const GOAL_FRAGMENT = gql`
  fragment GoalFields on Goal {
    id
    title
    description
    totalStickers
    startDate
    endDate
    mode
    visibility
    status
    createdBy {
      id
      userId
      nickname
      profileImage
    }
    participants {
      id
      user {
        id
        userId
        nickname
        profileImage
      }
      role
      status
      stickerCount
      joinedAt
    }
  }
`;

export const CREATE_GOAL_MUTATION = gql`
  mutation CreateGoal($input: CreateGoalInput!) {
    createGoal(input: $input) {
      ...GoalFields
    }
  }
  ${GOAL_FRAGMENT}
`;

export const MY_GOALS_QUERY = gql`
  query MyGoals($status: GoalStatus) {
    myGoals(status: $status) {
      ...GoalFields
    }
  }
  ${GOAL_FRAGMENT}
`;

export const FOLLOWING_GOALS_QUERY = gql`
  query FollowingGoals {
    followingGoals {
      ...GoalFields
    }
  }
  ${GOAL_FRAGMENT}
`;

export const GOAL_DETAIL_QUERY = gql`
  query GoalDetail($id: ID!) {
    goalById(id: $id) {
      ...GoalFields
      stickers {
        id
        recipientId
        grantedBy
        stickerImageId
        reason
        grantedAt
      }
    }
  }
  ${GOAL_FRAGMENT}
`;

export const JOIN_GOAL_MUTATION = gql`
  mutation JoinGoal($goalId: ID!) {
    joinGoal(goalId: $goalId) {
      ...GoalFields
    }
  }
  ${GOAL_FRAGMENT}
`;
