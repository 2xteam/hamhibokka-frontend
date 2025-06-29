// src/graphql/auth.ts
import {gql} from '@apollo/client';

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
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

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
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

export const ME_QUERY = gql`
  query Me {
    me {
      id
      userId
      email
      nickname
      profileImage
      followApprovalRequired
      followerCount
      followingCount
    }
  }
`;
