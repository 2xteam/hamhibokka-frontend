import { gql } from '@apollo/client';

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

export const VALIDATE_TOKEN_QUERY = gql`
  query ValidateToken {
    me {
      id
      userId
      email
      nickname
      profileImage
    }
  }
`;