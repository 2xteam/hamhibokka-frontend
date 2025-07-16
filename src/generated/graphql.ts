import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  user: User;
};

export type CreateGoalInvitationInput = {
  goalId: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  toUserId: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type CreateGoalJoinRequestInput = {
  goalId: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};

export type Follow = {
  __typename?: 'Follow';
  approvedAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  followerEmail?: Maybe<Scalars['String']['output']>;
  followerId: Scalars['String']['output'];
  followerNickname?: Maybe<Scalars['String']['output']>;
  followerProfileImage?: Maybe<Scalars['String']['output']>;
  followingEmail?: Maybe<Scalars['String']['output']>;
  followingId: Scalars['String']['output'];
  followingNickname?: Maybe<Scalars['String']['output']>;
  followingProfileImage?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  status?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  updatedBy?: Maybe<Scalars['String']['output']>;
};

export type FollowInput = {
  followerId: Scalars['String']['input'];
  followingId: Scalars['String']['input'];
};

export type FollowStatus = {
  __typename?: 'FollowStatus';
  followId?: Maybe<Scalars['String']['output']>;
  isFollowed: Scalars['Boolean']['output'];
};

export type Goal = {
  __typename?: 'Goal';
  autoApprove?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  creatorNickname?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  goalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isParticipant?: Maybe<Scalars['Boolean']['output']>;
  mode?: Maybe<Scalars['String']['output']>;
  participants?: Maybe<Array<GoalParticipant>>;
  status?: Maybe<Scalars['String']['output']>;
  stickerCount: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  visibility?: Maybe<Scalars['String']['output']>;
};

export type GoalInput = {
  autoApprove?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  stickerCount: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type GoalInvitation = {
  __typename?: 'GoalInvitation';
  createdAt: Scalars['DateTime']['output'];
  fromUserId: Scalars['String']['output'];
  goal?: Maybe<Goal>;
  goalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invitationId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  status: Scalars['String']['output'];
  toUserId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GoalParticipant = {
  __typename?: 'GoalParticipant';
  currentStickerCount: Scalars['Float']['output'];
  joinedAt: Scalars['DateTime']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  stickerReceivedLogs?: Maybe<Array<StickerReceivedLog>>;
  userId: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  approveFollow: Follow;
  createFollow: Follow;
  createGoal: Goal;
  createGoalInvitation: GoalInvitation;
  createGoalJoinRequest: GoalInvitation;
  createSticker: Sticker;
  createUser: User;
  deleteFollow: Scalars['Boolean']['output'];
  deleteGoal: Scalars['Boolean']['output'];
  deleteGoalInvitation: Scalars['Boolean']['output'];
  deleteSticker: Scalars['Boolean']['output'];
  deleteStickerImage: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  login: AuthPayload;
  receiveSticker: Goal;
  register: AuthPayload;
  updateFollow: Follow;
  updateGoal: Goal;
  updateGoalInvitation: GoalInvitation;
  updateSticker: Sticker;
  updateUser: User;
};


export type MutationApproveFollowArgs = {
  followId: Scalars['String']['input'];
};


export type MutationCreateFollowArgs = {
  input: FollowInput;
};


export type MutationCreateGoalArgs = {
  input: GoalInput;
};


export type MutationCreateGoalInvitationArgs = {
  input: CreateGoalInvitationInput;
};


export type MutationCreateGoalJoinRequestArgs = {
  input: CreateGoalJoinRequestInput;
};


export type MutationCreateStickerArgs = {
  input: StickerInput;
};


export type MutationCreateUserArgs = {
  input: UserInput;
};


export type MutationDeleteFollowArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteGoalArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteGoalInvitationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteStickerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteStickerImageArgs = {
  stickerImageId: Scalars['String']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationReceiveStickerArgs = {
  input: ReceiveStickerInput;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationUpdateFollowArgs = {
  id: Scalars['String']['input'];
  input: FollowInput;
};


export type MutationUpdateGoalArgs = {
  id: Scalars['String']['input'];
  input: GoalInput;
};


export type MutationUpdateGoalInvitationArgs = {
  id: Scalars['String']['input'];
  input: UpdateGoalInvitationInput;
};


export type MutationUpdateStickerArgs = {
  id: Scalars['String']['input'];
  input: StickerInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UserInput;
};

export type Query = {
  __typename?: 'Query';
  checkFollowStatus: FollowStatus;
  defaultStickerImages: Array<StickerImage>;
  getFollow?: Maybe<Follow>;
  getFollows: Array<Follow>;
  getGoal?: Maybe<Goal>;
  getGoals: Array<Goal>;
  getInvitation?: Maybe<GoalInvitation>;
  getInvitationsByGoalId: Array<GoalInvitation>;
  getInvitationsByStatus: Array<GoalInvitation>;
  getMyInvitations: Array<GoalInvitation>;
  getReceivedInvitations: Array<GoalInvitation>;
  getReceivedInvites: Array<GoalInvitation>;
  getSentInvitations: Array<GoalInvitation>;
  getSentInvites: Array<GoalInvitation>;
  getSentRequests: Array<GoalInvitation>;
  getSticker?: Maybe<Sticker>;
  getStickers: Array<Sticker>;
  getUser?: Maybe<User>;
  getUsers: Array<User>;
  hello: Scalars['String']['output'];
  myStickerImages: Array<StickerImage>;
  searchGoalsByTitle: Array<Goal>;
  searchUsersByNickname: Array<User>;
};


export type QueryCheckFollowStatusArgs = {
  followerId: Scalars['String']['input'];
  followingId: Scalars['String']['input'];
};


export type QueryGetFollowArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetFollowsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetGoalArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetInvitationArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetInvitationsByGoalIdArgs = {
  goalId: Scalars['String']['input'];
};


export type QueryGetInvitationsByStatusArgs = {
  status: Scalars['String']['input'];
};


export type QueryGetStickerArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchGoalsByTitleArgs = {
  title: Scalars['String']['input'];
};


export type QuerySearchUsersByNicknameArgs = {
  nickname: Scalars['String']['input'];
};

export type ReceiveStickerInput = {
  goalId: Scalars['String']['input'];
  recipientId?: InputMaybe<Scalars['String']['input']>;
  stickerCount?: InputMaybe<Scalars['Float']['input']>;
  toUserId: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Sticker = {
  __typename?: 'Sticker';
  goalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  recipientId: Scalars['String']['output'];
  stickerImageId: Scalars['String']['output'];
};

export type StickerImage = {
  __typename?: 'StickerImage';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  imageUrl: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  stickerImageId: Scalars['String']['output'];
  thumbnailUrl: Scalars['String']['output'];
  uploadedBy?: Maybe<Scalars['String']['output']>;
};

export type StickerInput = {
  goalId: Scalars['String']['input'];
  recipientId: Scalars['String']['input'];
  stickerImageId: Scalars['String']['input'];
};

export type StickerReceivedLog = {
  __typename?: 'StickerReceivedLog';
  count: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
};

export type UpdateGoalInvitationInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isFollowed?: Maybe<Scalars['Boolean']['output']>;
  nickname: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type UserInput = {
  email: Scalars['String']['input'];
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  profileImage?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type GetGoalsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGoalsQuery = { __typename?: 'Query', getGoals: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type GetGoalQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetGoalQuery = { __typename?: 'Query', getGoal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } | null };

export type CreateGoalMutationVariables = Exact<{
  input: GoalInput;
}>;


export type CreateGoalMutation = { __typename?: 'Mutation', createGoal: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number } };

export type CreateGoalJoinRequestMutationVariables = Exact<{
  input: CreateGoalJoinRequestInput;
}>;


export type CreateGoalJoinRequestMutation = { __typename?: 'Mutation', createGoalJoinRequest: { __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any } };

export type GetMyInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyInvitationsQuery = { __typename?: 'Query', getMyInvitations: Array<{ __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any, goal?: { __typename?: 'Goal', title: string, description?: string | null, stickerCount: number } | null }> };

export type GetInvitationQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetInvitationQuery = { __typename?: 'Query', getInvitation?: { __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any, goal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } | null } | null };

export type UpdateGoalInvitationMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateGoalInvitationInput;
}>;


export type UpdateGoalInvitationMutation = { __typename?: 'Mutation', updateGoalInvitation: { __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any, goal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } | null } };

export type ReceiveStickerMutationVariables = Exact<{
  input: ReceiveStickerInput;
}>;


export type ReceiveStickerMutation = { __typename?: 'Mutation', receiveSticker: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } };

export type SearchGoalsByTitleQueryVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type SearchGoalsByTitleQuery = { __typename?: 'Query', searchGoalsByTitle: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type LoginUserMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginUserMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } } };

export type RegisterUserMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', accessToken: string, user: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } } };

export type SearchUsersByNicknameQueryVariables = Exact<{
  nickname: Scalars['String']['input'];
}>;


export type SearchUsersByNicknameQuery = { __typename?: 'Query', searchUsersByNickname: Array<{ __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null, isFollowed?: boolean | null }> };

export type CreateFollowMutationVariables = Exact<{
  input: FollowInput;
}>;


export type CreateFollowMutation = { __typename?: 'Mutation', createFollow: { __typename?: 'Follow', id: string, followerId: string, followingId: string } };

export type UpdateFollowMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: FollowInput;
}>;


export type UpdateFollowMutation = { __typename?: 'Mutation', updateFollow: { __typename?: 'Follow', id: string, followerId: string, followingId: string } };

export type DeleteFollowMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteFollowMutation = { __typename?: 'Mutation', deleteFollow: boolean };

export type CheckFollowStatusQueryVariables = Exact<{
  followerId: Scalars['String']['input'];
  followingId: Scalars['String']['input'];
}>;


export type CheckFollowStatusQuery = { __typename?: 'Query', checkFollowStatus: { __typename?: 'FollowStatus', isFollowed: boolean, followId?: string | null } };

export type GetFollowsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFollowsQuery = { __typename?: 'Query', getFollows: Array<{ __typename?: 'Follow', id: string, followerId: string, followingId: string, followerNickname?: string | null, followingNickname?: string | null, followerEmail?: string | null, followerProfileImage?: string | null, followingEmail?: string | null, followingProfileImage?: string | null, status?: string | null, approvedAt?: any | null, createdBy?: string | null, updatedBy?: string | null, createdAt?: any | null, updatedAt?: any | null }> };

export type ApproveFollowMutationVariables = Exact<{
  followId: Scalars['String']['input'];
}>;


export type ApproveFollowMutation = { __typename?: 'Mutation', approveFollow: { __typename?: 'Follow', id: string, followerId: string, followingId: string, status?: string | null, approvedAt?: any | null, createdBy?: string | null, updatedBy?: string | null, createdAt?: any | null, updatedAt?: any | null } };


export const GetGoalsDocument = gql`
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

/**
 * __useGetGoalsQuery__
 *
 * To run a query within a React component, call `useGetGoalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGoalsQuery(baseOptions?: Apollo.QueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
      }
export function useGetGoalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
        }
export function useGetGoalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
        }
export type GetGoalsQueryHookResult = ReturnType<typeof useGetGoalsQuery>;
export type GetGoalsLazyQueryHookResult = ReturnType<typeof useGetGoalsLazyQuery>;
export type GetGoalsSuspenseQueryHookResult = ReturnType<typeof useGetGoalsSuspenseQuery>;
export type GetGoalsQueryResult = Apollo.QueryResult<GetGoalsQuery, GetGoalsQueryVariables>;
export const GetGoalDocument = gql`
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

/**
 * __useGetGoalQuery__
 *
 * To run a query within a React component, call `useGetGoalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetGoalQuery(baseOptions: Apollo.QueryHookOptions<GetGoalQuery, GetGoalQueryVariables> & ({ variables: GetGoalQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalQuery, GetGoalQueryVariables>(GetGoalDocument, options);
      }
export function useGetGoalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalQuery, GetGoalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalQuery, GetGoalQueryVariables>(GetGoalDocument, options);
        }
export function useGetGoalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalQuery, GetGoalQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGoalQuery, GetGoalQueryVariables>(GetGoalDocument, options);
        }
export type GetGoalQueryHookResult = ReturnType<typeof useGetGoalQuery>;
export type GetGoalLazyQueryHookResult = ReturnType<typeof useGetGoalLazyQuery>;
export type GetGoalSuspenseQueryHookResult = ReturnType<typeof useGetGoalSuspenseQuery>;
export type GetGoalQueryResult = Apollo.QueryResult<GetGoalQuery, GetGoalQueryVariables>;
export const CreateGoalDocument = gql`
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
export type CreateGoalMutationFn = Apollo.MutationFunction<CreateGoalMutation, CreateGoalMutationVariables>;

/**
 * __useCreateGoalMutation__
 *
 * To run a mutation, you first call `useCreateGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGoalMutation, { data, loading, error }] = useCreateGoalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGoalMutation(baseOptions?: Apollo.MutationHookOptions<CreateGoalMutation, CreateGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGoalMutation, CreateGoalMutationVariables>(CreateGoalDocument, options);
      }
export type CreateGoalMutationHookResult = ReturnType<typeof useCreateGoalMutation>;
export type CreateGoalMutationResult = Apollo.MutationResult<CreateGoalMutation>;
export type CreateGoalMutationOptions = Apollo.BaseMutationOptions<CreateGoalMutation, CreateGoalMutationVariables>;
export const CreateGoalJoinRequestDocument = gql`
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
export type CreateGoalJoinRequestMutationFn = Apollo.MutationFunction<CreateGoalJoinRequestMutation, CreateGoalJoinRequestMutationVariables>;

/**
 * __useCreateGoalJoinRequestMutation__
 *
 * To run a mutation, you first call `useCreateGoalJoinRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGoalJoinRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGoalJoinRequestMutation, { data, loading, error }] = useCreateGoalJoinRequestMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGoalJoinRequestMutation(baseOptions?: Apollo.MutationHookOptions<CreateGoalJoinRequestMutation, CreateGoalJoinRequestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGoalJoinRequestMutation, CreateGoalJoinRequestMutationVariables>(CreateGoalJoinRequestDocument, options);
      }
export type CreateGoalJoinRequestMutationHookResult = ReturnType<typeof useCreateGoalJoinRequestMutation>;
export type CreateGoalJoinRequestMutationResult = Apollo.MutationResult<CreateGoalJoinRequestMutation>;
export type CreateGoalJoinRequestMutationOptions = Apollo.BaseMutationOptions<CreateGoalJoinRequestMutation, CreateGoalJoinRequestMutationVariables>;
export const GetMyInvitationsDocument = gql`
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

/**
 * __useGetMyInvitationsQuery__
 *
 * To run a query within a React component, call `useGetMyInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyInvitationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyInvitationsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>(GetMyInvitationsDocument, options);
      }
export function useGetMyInvitationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>(GetMyInvitationsDocument, options);
        }
export function useGetMyInvitationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>(GetMyInvitationsDocument, options);
        }
export type GetMyInvitationsQueryHookResult = ReturnType<typeof useGetMyInvitationsQuery>;
export type GetMyInvitationsLazyQueryHookResult = ReturnType<typeof useGetMyInvitationsLazyQuery>;
export type GetMyInvitationsSuspenseQueryHookResult = ReturnType<typeof useGetMyInvitationsSuspenseQuery>;
export type GetMyInvitationsQueryResult = Apollo.QueryResult<GetMyInvitationsQuery, GetMyInvitationsQueryVariables>;
export const GetInvitationDocument = gql`
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
    respondedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetInvitationQuery__
 *
 * To run a query within a React component, call `useGetInvitationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvitationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvitationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetInvitationQuery(baseOptions: Apollo.QueryHookOptions<GetInvitationQuery, GetInvitationQueryVariables> & ({ variables: GetInvitationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvitationQuery, GetInvitationQueryVariables>(GetInvitationDocument, options);
      }
export function useGetInvitationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvitationQuery, GetInvitationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvitationQuery, GetInvitationQueryVariables>(GetInvitationDocument, options);
        }
export function useGetInvitationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvitationQuery, GetInvitationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvitationQuery, GetInvitationQueryVariables>(GetInvitationDocument, options);
        }
export type GetInvitationQueryHookResult = ReturnType<typeof useGetInvitationQuery>;
export type GetInvitationLazyQueryHookResult = ReturnType<typeof useGetInvitationLazyQuery>;
export type GetInvitationSuspenseQueryHookResult = ReturnType<typeof useGetInvitationSuspenseQuery>;
export type GetInvitationQueryResult = Apollo.QueryResult<GetInvitationQuery, GetInvitationQueryVariables>;
export const UpdateGoalInvitationDocument = gql`
    mutation UpdateGoalInvitation($id: String!, $input: UpdateGoalInvitationInput!) {
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
}
    `;
export type UpdateGoalInvitationMutationFn = Apollo.MutationFunction<UpdateGoalInvitationMutation, UpdateGoalInvitationMutationVariables>;

/**
 * __useUpdateGoalInvitationMutation__
 *
 * To run a mutation, you first call `useUpdateGoalInvitationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGoalInvitationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGoalInvitationMutation, { data, loading, error }] = useUpdateGoalInvitationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGoalInvitationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGoalInvitationMutation, UpdateGoalInvitationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGoalInvitationMutation, UpdateGoalInvitationMutationVariables>(UpdateGoalInvitationDocument, options);
      }
export type UpdateGoalInvitationMutationHookResult = ReturnType<typeof useUpdateGoalInvitationMutation>;
export type UpdateGoalInvitationMutationResult = Apollo.MutationResult<UpdateGoalInvitationMutation>;
export type UpdateGoalInvitationMutationOptions = Apollo.BaseMutationOptions<UpdateGoalInvitationMutation, UpdateGoalInvitationMutationVariables>;
export const ReceiveStickerDocument = gql`
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
export type ReceiveStickerMutationFn = Apollo.MutationFunction<ReceiveStickerMutation, ReceiveStickerMutationVariables>;

/**
 * __useReceiveStickerMutation__
 *
 * To run a mutation, you first call `useReceiveStickerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReceiveStickerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [receiveStickerMutation, { data, loading, error }] = useReceiveStickerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useReceiveStickerMutation(baseOptions?: Apollo.MutationHookOptions<ReceiveStickerMutation, ReceiveStickerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReceiveStickerMutation, ReceiveStickerMutationVariables>(ReceiveStickerDocument, options);
      }
export type ReceiveStickerMutationHookResult = ReturnType<typeof useReceiveStickerMutation>;
export type ReceiveStickerMutationResult = Apollo.MutationResult<ReceiveStickerMutation>;
export type ReceiveStickerMutationOptions = Apollo.BaseMutationOptions<ReceiveStickerMutation, ReceiveStickerMutationVariables>;
export const SearchGoalsByTitleDocument = gql`
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

/**
 * __useSearchGoalsByTitleQuery__
 *
 * To run a query within a React component, call `useSearchGoalsByTitleQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGoalsByTitleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGoalsByTitleQuery({
 *   variables: {
 *      title: // value for 'title'
 *   },
 * });
 */
export function useSearchGoalsByTitleQuery(baseOptions: Apollo.QueryHookOptions<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables> & ({ variables: SearchGoalsByTitleQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables>(SearchGoalsByTitleDocument, options);
      }
export function useSearchGoalsByTitleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables>(SearchGoalsByTitleDocument, options);
        }
export function useSearchGoalsByTitleSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables>(SearchGoalsByTitleDocument, options);
        }
export type SearchGoalsByTitleQueryHookResult = ReturnType<typeof useSearchGoalsByTitleQuery>;
export type SearchGoalsByTitleLazyQueryHookResult = ReturnType<typeof useSearchGoalsByTitleLazyQuery>;
export type SearchGoalsByTitleSuspenseQueryHookResult = ReturnType<typeof useSearchGoalsByTitleSuspenseQuery>;
export type SearchGoalsByTitleQueryResult = Apollo.QueryResult<SearchGoalsByTitleQuery, SearchGoalsByTitleQueryVariables>;
export const LoginUserDocument = gql`
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
export type LoginUserMutationFn = Apollo.MutationFunction<LoginUserMutation, LoginUserMutationVariables>;

/**
 * __useLoginUserMutation__
 *
 * To run a mutation, you first call `useLoginUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginUserMutation, { data, loading, error }] = useLoginUserMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginUserMutation(baseOptions?: Apollo.MutationHookOptions<LoginUserMutation, LoginUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginUserMutation, LoginUserMutationVariables>(LoginUserDocument, options);
      }
export type LoginUserMutationHookResult = ReturnType<typeof useLoginUserMutation>;
export type LoginUserMutationResult = Apollo.MutationResult<LoginUserMutation>;
export type LoginUserMutationOptions = Apollo.BaseMutationOptions<LoginUserMutation, LoginUserMutationVariables>;
export const RegisterUserDocument = gql`
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
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const SearchUsersByNicknameDocument = gql`
    query SearchUsersByNickname($nickname: String!) {
  searchUsersByNickname(nickname: $nickname) {
    id
    userId
    email
    nickname
    profileImage
    isFollowed
  }
}
    `;

/**
 * __useSearchUsersByNicknameQuery__
 *
 * To run a query within a React component, call `useSearchUsersByNicknameQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersByNicknameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersByNicknameQuery({
 *   variables: {
 *      nickname: // value for 'nickname'
 *   },
 * });
 */
export function useSearchUsersByNicknameQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables> & ({ variables: SearchUsersByNicknameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables>(SearchUsersByNicknameDocument, options);
      }
export function useSearchUsersByNicknameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables>(SearchUsersByNicknameDocument, options);
        }
export function useSearchUsersByNicknameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables>(SearchUsersByNicknameDocument, options);
        }
export type SearchUsersByNicknameQueryHookResult = ReturnType<typeof useSearchUsersByNicknameQuery>;
export type SearchUsersByNicknameLazyQueryHookResult = ReturnType<typeof useSearchUsersByNicknameLazyQuery>;
export type SearchUsersByNicknameSuspenseQueryHookResult = ReturnType<typeof useSearchUsersByNicknameSuspenseQuery>;
export type SearchUsersByNicknameQueryResult = Apollo.QueryResult<SearchUsersByNicknameQuery, SearchUsersByNicknameQueryVariables>;
export const CreateFollowDocument = gql`
    mutation CreateFollow($input: FollowInput!) {
  createFollow(input: $input) {
    id
    followerId
    followingId
  }
}
    `;
export type CreateFollowMutationFn = Apollo.MutationFunction<CreateFollowMutation, CreateFollowMutationVariables>;

/**
 * __useCreateFollowMutation__
 *
 * To run a mutation, you first call `useCreateFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFollowMutation, { data, loading, error }] = useCreateFollowMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFollowMutation(baseOptions?: Apollo.MutationHookOptions<CreateFollowMutation, CreateFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFollowMutation, CreateFollowMutationVariables>(CreateFollowDocument, options);
      }
export type CreateFollowMutationHookResult = ReturnType<typeof useCreateFollowMutation>;
export type CreateFollowMutationResult = Apollo.MutationResult<CreateFollowMutation>;
export type CreateFollowMutationOptions = Apollo.BaseMutationOptions<CreateFollowMutation, CreateFollowMutationVariables>;
export const UpdateFollowDocument = gql`
    mutation UpdateFollow($id: String!, $input: FollowInput!) {
  updateFollow(id: $id, input: $input) {
    id
    followerId
    followingId
  }
}
    `;
export type UpdateFollowMutationFn = Apollo.MutationFunction<UpdateFollowMutation, UpdateFollowMutationVariables>;

/**
 * __useUpdateFollowMutation__
 *
 * To run a mutation, you first call `useUpdateFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFollowMutation, { data, loading, error }] = useUpdateFollowMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFollowMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFollowMutation, UpdateFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFollowMutation, UpdateFollowMutationVariables>(UpdateFollowDocument, options);
      }
export type UpdateFollowMutationHookResult = ReturnType<typeof useUpdateFollowMutation>;
export type UpdateFollowMutationResult = Apollo.MutationResult<UpdateFollowMutation>;
export type UpdateFollowMutationOptions = Apollo.BaseMutationOptions<UpdateFollowMutation, UpdateFollowMutationVariables>;
export const DeleteFollowDocument = gql`
    mutation DeleteFollow($id: String!) {
  deleteFollow(id: $id)
}
    `;
export type DeleteFollowMutationFn = Apollo.MutationFunction<DeleteFollowMutation, DeleteFollowMutationVariables>;

/**
 * __useDeleteFollowMutation__
 *
 * To run a mutation, you first call `useDeleteFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFollowMutation, { data, loading, error }] = useDeleteFollowMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFollowMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFollowMutation, DeleteFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFollowMutation, DeleteFollowMutationVariables>(DeleteFollowDocument, options);
      }
export type DeleteFollowMutationHookResult = ReturnType<typeof useDeleteFollowMutation>;
export type DeleteFollowMutationResult = Apollo.MutationResult<DeleteFollowMutation>;
export type DeleteFollowMutationOptions = Apollo.BaseMutationOptions<DeleteFollowMutation, DeleteFollowMutationVariables>;
export const CheckFollowStatusDocument = gql`
    query CheckFollowStatus($followerId: String!, $followingId: String!) {
  checkFollowStatus(followerId: $followerId, followingId: $followingId) {
    isFollowed
    followId
  }
}
    `;

/**
 * __useCheckFollowStatusQuery__
 *
 * To run a query within a React component, call `useCheckFollowStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckFollowStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckFollowStatusQuery({
 *   variables: {
 *      followerId: // value for 'followerId'
 *      followingId: // value for 'followingId'
 *   },
 * });
 */
export function useCheckFollowStatusQuery(baseOptions: Apollo.QueryHookOptions<CheckFollowStatusQuery, CheckFollowStatusQueryVariables> & ({ variables: CheckFollowStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckFollowStatusQuery, CheckFollowStatusQueryVariables>(CheckFollowStatusDocument, options);
      }
export function useCheckFollowStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckFollowStatusQuery, CheckFollowStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckFollowStatusQuery, CheckFollowStatusQueryVariables>(CheckFollowStatusDocument, options);
        }
export function useCheckFollowStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckFollowStatusQuery, CheckFollowStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckFollowStatusQuery, CheckFollowStatusQueryVariables>(CheckFollowStatusDocument, options);
        }
export type CheckFollowStatusQueryHookResult = ReturnType<typeof useCheckFollowStatusQuery>;
export type CheckFollowStatusLazyQueryHookResult = ReturnType<typeof useCheckFollowStatusLazyQuery>;
export type CheckFollowStatusSuspenseQueryHookResult = ReturnType<typeof useCheckFollowStatusSuspenseQuery>;
export type CheckFollowStatusQueryResult = Apollo.QueryResult<CheckFollowStatusQuery, CheckFollowStatusQueryVariables>;
export const GetFollowsDocument = gql`
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

/**
 * __useGetFollowsQuery__
 *
 * To run a query within a React component, call `useGetFollowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowsQuery({
 *   variables: {
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetFollowsQuery(baseOptions?: Apollo.QueryHookOptions<GetFollowsQuery, GetFollowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowsQuery, GetFollowsQueryVariables>(GetFollowsDocument, options);
      }
export function useGetFollowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowsQuery, GetFollowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowsQuery, GetFollowsQueryVariables>(GetFollowsDocument, options);
        }
export function useGetFollowsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowsQuery, GetFollowsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowsQuery, GetFollowsQueryVariables>(GetFollowsDocument, options);
        }
export type GetFollowsQueryHookResult = ReturnType<typeof useGetFollowsQuery>;
export type GetFollowsLazyQueryHookResult = ReturnType<typeof useGetFollowsLazyQuery>;
export type GetFollowsSuspenseQueryHookResult = ReturnType<typeof useGetFollowsSuspenseQuery>;
export type GetFollowsQueryResult = Apollo.QueryResult<GetFollowsQuery, GetFollowsQueryVariables>;
export const ApproveFollowDocument = gql`
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
export type ApproveFollowMutationFn = Apollo.MutationFunction<ApproveFollowMutation, ApproveFollowMutationVariables>;

/**
 * __useApproveFollowMutation__
 *
 * To run a mutation, you first call `useApproveFollowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveFollowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveFollowMutation, { data, loading, error }] = useApproveFollowMutation({
 *   variables: {
 *      followId: // value for 'followId'
 *   },
 * });
 */
export function useApproveFollowMutation(baseOptions?: Apollo.MutationHookOptions<ApproveFollowMutation, ApproveFollowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ApproveFollowMutation, ApproveFollowMutationVariables>(ApproveFollowDocument, options);
      }
export type ApproveFollowMutationHookResult = ReturnType<typeof useApproveFollowMutation>;
export type ApproveFollowMutationResult = Apollo.MutationResult<ApproveFollowMutation>;
export type ApproveFollowMutationOptions = Apollo.BaseMutationOptions<ApproveFollowMutation, ApproveFollowMutationVariables>;