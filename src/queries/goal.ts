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
        stickerReceivedLogs {
          date
          count
        }
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
        stickerReceivedLogs {
          date
          count
        }
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
      visibility
    }
  }
`;

export const DELETE_GOAL = gql`
  mutation DeleteGoal($id: String!) {
    deleteGoal(id: $id)
  }
`;

export const LEAVE_GOAL = gql`
  mutation LeaveGoal($input: LeaveGoalInput!) {
    leaveGoal(input: $input) {
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
        stickerReceivedLogs {
          date
          count
        }
      }
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
      respondedAt
      createdAt
      updatedAt

      # Goal 정보 (중첩된 객체)
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
        creatorNickname
        autoApprove
        createdAt
        updatedAt
        isParticipant

        # Goal의 참여자들
        participants {
          userId
          status
          currentStickerCount
          joinedAt
        }
      }

      # 보낸 사용자 정보
      fromUser {
        id
        userId
        email
        nickname
        profileImage
      }

      # 받는 사용자 정보
      toUser {
        id
        userId
        email
        nickname
        profileImage
      }
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

      # Goal 정보 (중첩된 객체)
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
        creatorNickname
        autoApprove
        createdAt
        updatedAt
        isParticipant

        # Goal의 참여자들
        participants {
          userId
          status
          currentStickerCount
          joinedAt
        }
      }

      # 보낸 사용자 정보
      fromUser {
        id
        userId
        email
        nickname
        profileImage
      }

      # 받는 사용자 정보
      toUser {
        id
        userId
        email
        nickname
        profileImage
      }
    }
  }
`;

export const RECEIVE_STICKER = gql`
  mutation ReceiveSticker($input: ReceiveStickerInput!) {
    receiveSticker(input: $input) {
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
        stickerReceivedLogs {
          date
          count
        }
      }
    }
  }
`;

export const SEARCH_GOALS_BY_TITLE = gql`
  query SearchGoalsByTitle($title: String!) {
    searchGoalsByTitle(title: $title) {
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
        stickerReceivedLogs {
          date
          count
        }
      }
    }
  }
`;

export const GET_GOALS_BY_USER_ID = gql`
  query GetGoalsByUserId($userId: String!) {
    getGoalsByUserId(userId: $userId) {
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
        stickerReceivedLogs {
          date
          count
        }
      }
    }
  }
`;

export const GET_MY_PARTICIPATED_GOALS = gql`
  query GetMyParticipatedGoals {
    getMyParticipatedGoals {
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
      participants {
        userId
        nickname
        status
        currentStickerCount
        joinedAt
        stickerReceivedLogs {
          date
          count
        }
      }
    }
  }
`;

export const GET_FOLLOWED_USERS_GOALS = gql`
  query GetFollowedUsersGoals {
    getFollowedUsersGoals {
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
        nickname
        status
        currentStickerCount
        joinedAt
        stickerReceivedLogs {
          date
          count
        }
      }
    }
  }
`;

export const GET_INVITATIONS = gql`
  query GetInvitations {
    getInvitations {
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

      # Goal 정보 (중첩된 객체)
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
        creatorNickname
        autoApprove
        createdAt
        updatedAt
        isParticipant

        # Goal의 참여자들
        participants {
          userId
          status
          currentStickerCount
          joinedAt
        }
      }

      # 보낸 사용자 정보
      fromUser {
        id
        userId
        email
        nickname
        profileImage
      }

      # 받는 사용자 정보
      toUser {
        id
        userId
        email
        nickname
        profileImage
      }
    }
  }
`;
