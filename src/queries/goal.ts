import {gql} from '@apollo/client';

export const GET_GOALS = gql`
  query GetGoals {
    getGoals {
      id
      goalId
      title
      description
      stickerCount
      mode
      visibility
      status
      createdBy
      autoApprove
      createdAt
      participants {
        userId
        status
        currentStickerCount
        joinedAt
      }
    }
  }
`;

export const GET_GOAL = gql`
  query GetGoal($id: String!) {
    getGoal(id: $id) {
      id
      goalId
      title
      description
      stickerCount
      mode
      visibility
      status
      createdBy
      creatorNickname
      autoApprove
      createdAt
      updatedAt
      isParticipant
      participants {
        userId
        nickname
        status
        currentStickerCount
        joinedAt
      }
    }
  }
`;

export const CREATE_GOAL = gql`
  mutation CreateGoal($input: GoalInput!) {
    createGoal(input: $input) {
      id
      goalId
      title
      description
      stickerCount
    }
  }
`;

export const CREATE_GOAL_JOIN_REQUEST = gql`
  mutation CreateGoalJoinRequest($input: CreateGoalJoinRequestInput!) {
    createGoalJoinRequest(input: $input) {
      id
      invitationId
      goalId
      fromUserId
      toUserId
      type
      status
      message
      respondedAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_MY_INVITATIONS = gql`
  query GetMyInvitations {
    getMyInvitations {
      id
      invitationId
      goalId
      fromUserId
      toUserId
      type
      status
      message
      respondedAt
      createdAt
      updatedAt
      goal {
        title
        description
        stickerCount
      }
    }
  }
`;

export const GET_INVITATION = gql`
  query GetInvitation($id: String!) {
    getInvitation(id: $id) {
      id
      invitationId
      goalId
      fromUserId
      toUserId
      type
      status
      message
      goal {
        id
        goalId
        title
        description
        stickerCount
        mode
        visibility
        status
        createdBy
        autoApprove
        createdAt
        updatedAt
        participants {
          userId
          status
          currentStickerCount
          joinedAt
        }
      }
      respondedAt
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_GOAL_INVITATION = gql`
  mutation UpdateGoalInvitation(
    $id: String!
    $input: UpdateGoalInvitationInput!
  ) {
    updateGoalInvitation(id: $id, input: $input) {
      id
      invitationId
      goalId
      fromUserId
      toUserId
      type
      status
      message
      respondedAt
      createdAt
      updatedAt
      goal {
        id
        goalId
        title
        description
        stickerCount
        mode
        visibility
        status
        createdBy
        autoApprove
        createdAt
        updatedAt
        participants {
          userId
          status
          currentStickerCount
          joinedAt
        }
      }
    }
  }
`;
