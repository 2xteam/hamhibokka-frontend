import { gql } from '@apollo/client';

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