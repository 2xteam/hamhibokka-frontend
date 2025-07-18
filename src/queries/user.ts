import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        userId
        email
        nickname
        profileImage
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        userId
        email
        nickname
        profileImage
      }
    }
  }
`;

export const SEARCH_USERS_BY_NICKNAME = gql`
  query SearchUsersByNickname($nickname: String!) {
    searchUsersByNickname(nickname: $nickname) {
      id
      userId
      email
      nickname
      profileImage
      followStatus
    }
  }
`;

export const CREATE_FOLLOW = gql`
  mutation CreateFollow($input: FollowInput!) {
    createFollow(input: $input) {
      id
      followerId
      followingId
      status
    }
  }
`;

export const UPDATE_FOLLOW = gql`
  mutation UpdateFollow($id: String!, $input: FollowInput!) {
    updateFollow(id: $id, input: $input) {
      id
      followerId
      followingId
    }
  }
`;

export const DELETE_FOLLOW = gql`
  mutation DeleteFollow($id: String!) {
    deleteFollow(id: $id)
  }
`;

export const CHECK_FOLLOW_STATUS = gql`
  query CheckFollowStatus($followerId: String!, $followingId: String!) {
    checkFollowStatus(followerId: $followerId, followingId: $followingId) {
      followStatus
      followId
    }
  }
`;

export const GET_FOLLOWS = gql`
  query GetFollows($status: String) {
    getFollows(status: $status) {
      id
      followerId
      followingId
      followerNickname
      followingNickname
      followerEmail
      followerProfileImage
      followingEmail
      followingProfileImage
      status
      approvedAt
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

export const APPROVE_FOLLOW = gql`
  mutation ApproveFollow($followId: String!) {
    approveFollow(followId: $followId) {
      id
      followerId
      followingId
      status
      approvedAt
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

export const GET_FOLLOW_REQUESTS = gql`
  query GetFollowRequests {
    getFollowRequests {
      id
      followerId
      followingId
      followerNickname
      followingNickname
      status
      createdAt
    }
  }
`;
