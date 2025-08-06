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
  followStatus?: Maybe<Scalars['String']['output']>;
};

export type Goal = {
  __typename?: 'Goal';
  autoApprove?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  creatorNickname?: Maybe<Scalars['String']['output']>;
  creatorProfileImage?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  goalId: Scalars['String']['output'];
  goalImage?: Maybe<Scalars['String']['output']>;
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
  goalImage?: InputMaybe<Scalars['String']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  stickerCount: Scalars['Float']['input'];
  title: Scalars['String']['input'];
  visibility?: InputMaybe<Scalars['String']['input']>;
};

export type GoalInvitation = {
  __typename?: 'GoalInvitation';
  createdAt: Scalars['DateTime']['output'];
  fromUser?: Maybe<User>;
  fromUserId: Scalars['String']['output'];
  goal?: Maybe<Goal>;
  goalId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  invitationId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  respondedAt?: Maybe<Scalars['DateTime']['output']>;
  status: Scalars['String']['output'];
  toUser?: Maybe<User>;
  toUserId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GoalParticipant = {
  __typename?: 'GoalParticipant';
  currentStickerCount: Scalars['Float']['output'];
  joinedAt: Scalars['DateTime']['output'];
  nickname?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  stickerReceivedLogs?: Maybe<Array<StickerReceivedLog>>;
  userId: Scalars['String']['output'];
};

export type LeaveGoalInput = {
  goalId: Scalars['String']['input'];
  participantId: Scalars['String']['input'];
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
  createUser: User;
  deleteFollow: Scalars['Boolean']['output'];
  deleteGoal: Scalars['Boolean']['output'];
  deleteGoalInvitation: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  leaveGoal: Goal;
  login: AuthPayload;
  receiveSticker: Goal;
  register: AuthPayload;
  updateFollow: Follow;
  updateGoal: Goal;
  updateGoalImage: Goal;
  updateGoalInvitation: GoalInvitation;
  updateNickname: User;
  updateProfileImage: User;
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


export type MutationDeleteUserArgs = {
  id: Scalars['String']['input'];
};


export type MutationLeaveGoalArgs = {
  input: LeaveGoalInput;
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


export type MutationUpdateGoalImageArgs = {
  goalId: Scalars['String']['input'];
  input: UpdateGoalImageInput;
};


export type MutationUpdateGoalInvitationArgs = {
  id: Scalars['String']['input'];
  input: UpdateGoalInvitationInput;
};


export type MutationUpdateNicknameArgs = {
  input: UpdateNicknameInput;
};


export type MutationUpdateProfileImageArgs = {
  input: UpdateProfileImageInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UserInput;
};

export type Query = {
  __typename?: 'Query';
  checkFollowStatus: FollowStatus;
  getAllGoalsByUserId: Array<Goal>;
  getFollow?: Maybe<Follow>;
  getFollowRequests: Array<Follow>;
  getFollowedUsersGoals: Array<Goal>;
  getFollows: Array<Follow>;
  getGoal?: Maybe<Goal>;
  getGoals: Array<Goal>;
  getGoalsByUserId: Array<Goal>;
  getInvitation?: Maybe<GoalInvitation>;
  getInvitations: Array<GoalInvitation>;
  getMyParticipatedGoals: Array<Goal>;
  getMyProfileImage?: Maybe<Scalars['String']['output']>;
  getUser?: Maybe<User>;
  getUsers: Array<User>;
  hello: Scalars['String']['output'];
  searchGoalsByTitle: Array<Goal>;
  searchUsersByNickname: Array<User>;
};


export type QueryCheckFollowStatusArgs = {
  followerId: Scalars['String']['input'];
  followingId: Scalars['String']['input'];
};


export type QueryGetAllGoalsByUserIdArgs = {
  userId: Scalars['String']['input'];
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


export type QueryGetGoalsByUserIdArgs = {
  userId: Scalars['String']['input'];
};


export type QueryGetInvitationArgs = {
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
  participantId: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  nickname: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type StickerReceivedLog = {
  __typename?: 'StickerReceivedLog';
  count: Scalars['Float']['output'];
  date: Scalars['DateTime']['output'];
};

export type UpdateGoalImageInput = {
  goalImage: Scalars['String']['input'];
};

export type UpdateGoalInvitationInput = {
  message?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type UpdateNicknameInput = {
  nickname: Scalars['String']['input'];
};

export type UpdateProfileImageInput = {
  profileImage: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  followStatus?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
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


export type GetGoalsQuery = { __typename?: 'Query', getGoals: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type GetGoalQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetGoalQuery = { __typename?: 'Query', getGoal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } | null };

export type CreateGoalMutationVariables = Exact<{
  input: GoalInput;
}>;


export type CreateGoalMutation = { __typename?: 'Mutation', createGoal: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, visibility?: string | null } };

export type DeleteGoalMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteGoalMutation = { __typename?: 'Mutation', deleteGoal: boolean };

export type UpdateGoalMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: GoalInput;
}>;


export type UpdateGoalMutation = { __typename?: 'Mutation', updateGoal: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, autoApprove?: boolean | null, status?: string | null, createdBy?: string | null, createdAt?: any | null, updatedAt?: any | null } };

export type LeaveGoalMutationVariables = Exact<{
  input: LeaveGoalInput;
}>;


export type LeaveGoalMutation = { __typename?: 'Mutation', leaveGoal: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } };

export type CreateGoalJoinRequestMutationVariables = Exact<{
  input: CreateGoalJoinRequestInput;
}>;


export type CreateGoalJoinRequestMutation = { __typename?: 'Mutation', createGoalJoinRequest: { __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any } };

export type GetInvitationQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetInvitationQuery = { __typename?: 'Query', getInvitation?: { __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any, goal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, status: string, currentStickerCount: number, joinedAt: any }> | null } | null, fromUser?: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } | null, toUser?: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } | null } | null };

export type UpdateGoalInvitationMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: UpdateGoalInvitationInput;
}>;


export type UpdateGoalInvitationMutation = { __typename?: 'Mutation', updateGoalInvitation: { __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any, goal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, status: string, currentStickerCount: number, joinedAt: any }> | null } | null, fromUser?: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } | null, toUser?: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } | null } };

export type ReceiveStickerMutationVariables = Exact<{
  input: ReceiveStickerInput;
}>;


export type ReceiveStickerMutation = { __typename?: 'Mutation', receiveSticker: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null } };

export type SearchGoalsByTitleQueryVariables = Exact<{
  title: Scalars['String']['input'];
}>;


export type SearchGoalsByTitleQuery = { __typename?: 'Query', searchGoalsByTitle: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type GetGoalsByUserIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetGoalsByUserIdQuery = { __typename?: 'Query', getGoalsByUserId: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type GetMyParticipatedGoalsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyParticipatedGoalsQuery = { __typename?: 'Query', getMyParticipatedGoals: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type GetFollowedUsersGoalsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFollowedUsersGoalsQuery = { __typename?: 'Query', getFollowedUsersGoals: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, profileImage?: string | null, status: string, currentStickerCount: number, joinedAt: any, stickerReceivedLogs?: Array<{ __typename?: 'StickerReceivedLog', date: any, count: number }> | null }> | null }> };

export type GetAllGoalsByUserIdQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetAllGoalsByUserIdQuery = { __typename?: 'Query', getAllGoalsByUserId: Array<{ __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, createdBy?: string | null, creatorNickname?: string | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, nickname?: string | null, status: string, currentStickerCount: number }> | null }> };

export type GetInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInvitationsQuery = { __typename?: 'Query', getInvitations: Array<{ __typename?: 'GoalInvitation', id: string, invitationId: string, goalId: string, fromUserId: string, toUserId: string, type: string, status: string, message?: string | null, respondedAt?: any | null, createdAt: any, updatedAt: any, goal?: { __typename?: 'Goal', id: string, goalId: string, title: string, description?: string | null, goalImage?: string | null, stickerCount: number, mode?: string | null, visibility?: string | null, status?: string | null, createdBy?: string | null, creatorNickname?: string | null, autoApprove?: boolean | null, createdAt?: any | null, updatedAt?: any | null, isParticipant?: boolean | null, participants?: Array<{ __typename?: 'GoalParticipant', userId: string, status: string, currentStickerCount: number, joinedAt: any }> | null } | null, fromUser?: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } | null, toUser?: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } | null }> };

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


export type SearchUsersByNicknameQuery = { __typename?: 'Query', searchUsersByNickname: Array<{ __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null, followStatus?: string | null }> };

export type CreateFollowMutationVariables = Exact<{
  input: FollowInput;
}>;


export type CreateFollowMutation = { __typename?: 'Mutation', createFollow: { __typename?: 'Follow', id: string, followerId: string, followingId: string, status?: string | null } };

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


export type CheckFollowStatusQuery = { __typename?: 'Query', checkFollowStatus: { __typename?: 'FollowStatus', followStatus?: string | null, followId?: string | null } };

export type GetFollowsQueryVariables = Exact<{
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFollowsQuery = { __typename?: 'Query', getFollows: Array<{ __typename?: 'Follow', id: string, followerId: string, followingId: string, followerNickname?: string | null, followingNickname?: string | null, followerEmail?: string | null, followerProfileImage?: string | null, followingEmail?: string | null, followingProfileImage?: string | null, status?: string | null, approvedAt?: any | null, createdBy?: string | null, updatedBy?: string | null, createdAt?: any | null, updatedAt?: any | null }> };

export type ApproveFollowMutationVariables = Exact<{
  followId: Scalars['String']['input'];
}>;


export type ApproveFollowMutation = { __typename?: 'Mutation', approveFollow: { __typename?: 'Follow', id: string, followerId: string, followingId: string, status?: string | null, approvedAt?: any | null, createdBy?: string | null, updatedBy?: string | null, createdAt?: any | null, updatedAt?: any | null } };

export type GetFollowRequestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFollowRequestsQuery = { __typename?: 'Query', getFollowRequests: Array<{ __typename?: 'Follow', id: string, followerId: string, followingId: string, followerNickname?: string | null, followingNickname?: string | null, status?: string | null, createdAt?: any | null }> };

export type UpdateProfileImageMutationVariables = Exact<{
  input: UpdateProfileImageInput;
}>;


export type UpdateProfileImageMutation = { __typename?: 'Mutation', updateProfileImage: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null, followStatus?: string | null } };

export type GetMyProfileImageQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileImageQuery = { __typename?: 'Query', getMyProfileImage?: string | null };

export type UpdateNicknameMutationVariables = Exact<{
  input: UpdateNicknameInput;
}>;


export type UpdateNicknameMutation = { __typename?: 'Mutation', updateNickname: { __typename?: 'User', id: string, userId: string, email: string, nickname: string, profileImage?: string | null } };


export const GetGoalsDocument = gql`
    query GetGoals {
  getGoals {
    id
    goalId
    title
    description
    goalImage
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
      profileImage
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
    goalImage
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
      profileImage
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
    goalImage
    stickerCount
    visibility
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
export const DeleteGoalDocument = gql`
    mutation DeleteGoal($id: String!) {
  deleteGoal(id: $id)
}
    `;
export type DeleteGoalMutationFn = Apollo.MutationFunction<DeleteGoalMutation, DeleteGoalMutationVariables>;

/**
 * __useDeleteGoalMutation__
 *
 * To run a mutation, you first call `useDeleteGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGoalMutation, { data, loading, error }] = useDeleteGoalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteGoalMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGoalMutation, DeleteGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGoalMutation, DeleteGoalMutationVariables>(DeleteGoalDocument, options);
      }
export type DeleteGoalMutationHookResult = ReturnType<typeof useDeleteGoalMutation>;
export type DeleteGoalMutationResult = Apollo.MutationResult<DeleteGoalMutation>;
export type DeleteGoalMutationOptions = Apollo.BaseMutationOptions<DeleteGoalMutation, DeleteGoalMutationVariables>;
export const UpdateGoalDocument = gql`
    mutation UpdateGoal($id: String!, $input: GoalInput!) {
  updateGoal(id: $id, input: $input) {
    id
    goalId
    title
    description
    goalImage
    stickerCount
    mode
    visibility
    autoApprove
    status
    createdBy
    createdAt
    updatedAt
  }
}
    `;
export type UpdateGoalMutationFn = Apollo.MutationFunction<UpdateGoalMutation, UpdateGoalMutationVariables>;

/**
 * __useUpdateGoalMutation__
 *
 * To run a mutation, you first call `useUpdateGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGoalMutation, { data, loading, error }] = useUpdateGoalMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGoalMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGoalMutation, UpdateGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateGoalMutation, UpdateGoalMutationVariables>(UpdateGoalDocument, options);
      }
export type UpdateGoalMutationHookResult = ReturnType<typeof useUpdateGoalMutation>;
export type UpdateGoalMutationResult = Apollo.MutationResult<UpdateGoalMutation>;
export type UpdateGoalMutationOptions = Apollo.BaseMutationOptions<UpdateGoalMutation, UpdateGoalMutationVariables>;
export const LeaveGoalDocument = gql`
    mutation LeaveGoal($input: LeaveGoalInput!) {
  leaveGoal(input: $input) {
    id
    goalId
    title
    description
    goalImage
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
      profileImage
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
export type LeaveGoalMutationFn = Apollo.MutationFunction<LeaveGoalMutation, LeaveGoalMutationVariables>;

/**
 * __useLeaveGoalMutation__
 *
 * To run a mutation, you first call `useLeaveGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveGoalMutation, { data, loading, error }] = useLeaveGoalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLeaveGoalMutation(baseOptions?: Apollo.MutationHookOptions<LeaveGoalMutation, LeaveGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveGoalMutation, LeaveGoalMutationVariables>(LeaveGoalDocument, options);
      }
export type LeaveGoalMutationHookResult = ReturnType<typeof useLeaveGoalMutation>;
export type LeaveGoalMutationResult = Apollo.MutationResult<LeaveGoalMutation>;
export type LeaveGoalMutationOptions = Apollo.BaseMutationOptions<LeaveGoalMutation, LeaveGoalMutationVariables>;
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
    respondedAt
    createdAt
    updatedAt
    goal {
      id
      goalId
      title
      description
      goalImage
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
        status
        currentStickerCount
        joinedAt
      }
    }
    fromUser {
      id
      userId
      email
      nickname
      profileImage
    }
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
      goalImage
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
        status
        currentStickerCount
        joinedAt
      }
    }
    fromUser {
      id
      userId
      email
      nickname
      profileImage
    }
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
    goalImage
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
      profileImage
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
    goalImage
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
      profileImage
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
export const GetGoalsByUserIdDocument = gql`
    query GetGoalsByUserId($userId: String!) {
  getGoalsByUserId(userId: $userId) {
    id
    goalId
    title
    description
    goalImage
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
      profileImage
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
 * __useGetGoalsByUserIdQuery__
 *
 * To run a query within a React component, call `useGetGoalsByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalsByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalsByUserIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetGoalsByUserIdQuery(baseOptions: Apollo.QueryHookOptions<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables> & ({ variables: GetGoalsByUserIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables>(GetGoalsByUserIdDocument, options);
      }
export function useGetGoalsByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables>(GetGoalsByUserIdDocument, options);
        }
export function useGetGoalsByUserIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables>(GetGoalsByUserIdDocument, options);
        }
export type GetGoalsByUserIdQueryHookResult = ReturnType<typeof useGetGoalsByUserIdQuery>;
export type GetGoalsByUserIdLazyQueryHookResult = ReturnType<typeof useGetGoalsByUserIdLazyQuery>;
export type GetGoalsByUserIdSuspenseQueryHookResult = ReturnType<typeof useGetGoalsByUserIdSuspenseQuery>;
export type GetGoalsByUserIdQueryResult = Apollo.QueryResult<GetGoalsByUserIdQuery, GetGoalsByUserIdQueryVariables>;
export const GetMyParticipatedGoalsDocument = gql`
    query GetMyParticipatedGoals {
  getMyParticipatedGoals {
    id
    goalId
    title
    description
    goalImage
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
      profileImage
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
 * __useGetMyParticipatedGoalsQuery__
 *
 * To run a query within a React component, call `useGetMyParticipatedGoalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyParticipatedGoalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyParticipatedGoalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyParticipatedGoalsQuery(baseOptions?: Apollo.QueryHookOptions<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>(GetMyParticipatedGoalsDocument, options);
      }
export function useGetMyParticipatedGoalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>(GetMyParticipatedGoalsDocument, options);
        }
export function useGetMyParticipatedGoalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>(GetMyParticipatedGoalsDocument, options);
        }
export type GetMyParticipatedGoalsQueryHookResult = ReturnType<typeof useGetMyParticipatedGoalsQuery>;
export type GetMyParticipatedGoalsLazyQueryHookResult = ReturnType<typeof useGetMyParticipatedGoalsLazyQuery>;
export type GetMyParticipatedGoalsSuspenseQueryHookResult = ReturnType<typeof useGetMyParticipatedGoalsSuspenseQuery>;
export type GetMyParticipatedGoalsQueryResult = Apollo.QueryResult<GetMyParticipatedGoalsQuery, GetMyParticipatedGoalsQueryVariables>;
export const GetFollowedUsersGoalsDocument = gql`
    query GetFollowedUsersGoals {
  getFollowedUsersGoals {
    id
    goalId
    title
    description
    goalImage
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
      profileImage
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
 * __useGetFollowedUsersGoalsQuery__
 *
 * To run a query within a React component, call `useGetFollowedUsersGoalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowedUsersGoalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowedUsersGoalsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFollowedUsersGoalsQuery(baseOptions?: Apollo.QueryHookOptions<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>(GetFollowedUsersGoalsDocument, options);
      }
export function useGetFollowedUsersGoalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>(GetFollowedUsersGoalsDocument, options);
        }
export function useGetFollowedUsersGoalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>(GetFollowedUsersGoalsDocument, options);
        }
export type GetFollowedUsersGoalsQueryHookResult = ReturnType<typeof useGetFollowedUsersGoalsQuery>;
export type GetFollowedUsersGoalsLazyQueryHookResult = ReturnType<typeof useGetFollowedUsersGoalsLazyQuery>;
export type GetFollowedUsersGoalsSuspenseQueryHookResult = ReturnType<typeof useGetFollowedUsersGoalsSuspenseQuery>;
export type GetFollowedUsersGoalsQueryResult = Apollo.QueryResult<GetFollowedUsersGoalsQuery, GetFollowedUsersGoalsQueryVariables>;
export const GetAllGoalsByUserIdDocument = gql`
    query GetAllGoalsByUserId($userId: String!) {
  getAllGoalsByUserId(userId: $userId) {
    id
    goalId
    title
    description
    goalImage
    createdBy
    creatorNickname
    participants {
      userId
      nickname
      status
      currentStickerCount
    }
  }
}
    `;

/**
 * __useGetAllGoalsByUserIdQuery__
 *
 * To run a query within a React component, call `useGetAllGoalsByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllGoalsByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllGoalsByUserIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetAllGoalsByUserIdQuery(baseOptions: Apollo.QueryHookOptions<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables> & ({ variables: GetAllGoalsByUserIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables>(GetAllGoalsByUserIdDocument, options);
      }
export function useGetAllGoalsByUserIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables>(GetAllGoalsByUserIdDocument, options);
        }
export function useGetAllGoalsByUserIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables>(GetAllGoalsByUserIdDocument, options);
        }
export type GetAllGoalsByUserIdQueryHookResult = ReturnType<typeof useGetAllGoalsByUserIdQuery>;
export type GetAllGoalsByUserIdLazyQueryHookResult = ReturnType<typeof useGetAllGoalsByUserIdLazyQuery>;
export type GetAllGoalsByUserIdSuspenseQueryHookResult = ReturnType<typeof useGetAllGoalsByUserIdSuspenseQuery>;
export type GetAllGoalsByUserIdQueryResult = Apollo.QueryResult<GetAllGoalsByUserIdQuery, GetAllGoalsByUserIdQueryVariables>;
export const GetInvitationsDocument = gql`
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
    goal {
      id
      goalId
      title
      description
      goalImage
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
        status
        currentStickerCount
        joinedAt
      }
    }
    fromUser {
      id
      userId
      email
      nickname
      profileImage
    }
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

/**
 * __useGetInvitationsQuery__
 *
 * To run a query within a React component, call `useGetInvitationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInvitationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInvitationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetInvitationsQuery(baseOptions?: Apollo.QueryHookOptions<GetInvitationsQuery, GetInvitationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetInvitationsQuery, GetInvitationsQueryVariables>(GetInvitationsDocument, options);
      }
export function useGetInvitationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInvitationsQuery, GetInvitationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetInvitationsQuery, GetInvitationsQueryVariables>(GetInvitationsDocument, options);
        }
export function useGetInvitationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetInvitationsQuery, GetInvitationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetInvitationsQuery, GetInvitationsQueryVariables>(GetInvitationsDocument, options);
        }
export type GetInvitationsQueryHookResult = ReturnType<typeof useGetInvitationsQuery>;
export type GetInvitationsLazyQueryHookResult = ReturnType<typeof useGetInvitationsLazyQuery>;
export type GetInvitationsSuspenseQueryHookResult = ReturnType<typeof useGetInvitationsSuspenseQuery>;
export type GetInvitationsQueryResult = Apollo.QueryResult<GetInvitationsQuery, GetInvitationsQueryVariables>;
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
    followStatus
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
    status
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
    followStatus
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
export const GetFollowRequestsDocument = gql`
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

/**
 * __useGetFollowRequestsQuery__
 *
 * To run a query within a React component, call `useGetFollowRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFollowRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFollowRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFollowRequestsQuery(baseOptions?: Apollo.QueryHookOptions<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>(GetFollowRequestsDocument, options);
      }
export function useGetFollowRequestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>(GetFollowRequestsDocument, options);
        }
export function useGetFollowRequestsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>(GetFollowRequestsDocument, options);
        }
export type GetFollowRequestsQueryHookResult = ReturnType<typeof useGetFollowRequestsQuery>;
export type GetFollowRequestsLazyQueryHookResult = ReturnType<typeof useGetFollowRequestsLazyQuery>;
export type GetFollowRequestsSuspenseQueryHookResult = ReturnType<typeof useGetFollowRequestsSuspenseQuery>;
export type GetFollowRequestsQueryResult = Apollo.QueryResult<GetFollowRequestsQuery, GetFollowRequestsQueryVariables>;
export const UpdateProfileImageDocument = gql`
    mutation UpdateProfileImage($input: UpdateProfileImageInput!) {
  updateProfileImage(input: $input) {
    id
    userId
    email
    nickname
    profileImage
    followStatus
  }
}
    `;
export type UpdateProfileImageMutationFn = Apollo.MutationFunction<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>;

/**
 * __useUpdateProfileImageMutation__
 *
 * To run a mutation, you first call `useUpdateProfileImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileImageMutation, { data, loading, error }] = useUpdateProfileImageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileImageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>(UpdateProfileImageDocument, options);
      }
export type UpdateProfileImageMutationHookResult = ReturnType<typeof useUpdateProfileImageMutation>;
export type UpdateProfileImageMutationResult = Apollo.MutationResult<UpdateProfileImageMutation>;
export type UpdateProfileImageMutationOptions = Apollo.BaseMutationOptions<UpdateProfileImageMutation, UpdateProfileImageMutationVariables>;
export const GetMyProfileImageDocument = gql`
    query GetMyProfileImage {
  getMyProfileImage
}
    `;

/**
 * __useGetMyProfileImageQuery__
 *
 * To run a query within a React component, call `useGetMyProfileImageQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyProfileImageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyProfileImageQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyProfileImageQuery(baseOptions?: Apollo.QueryHookOptions<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>(GetMyProfileImageDocument, options);
      }
export function useGetMyProfileImageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>(GetMyProfileImageDocument, options);
        }
export function useGetMyProfileImageSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>(GetMyProfileImageDocument, options);
        }
export type GetMyProfileImageQueryHookResult = ReturnType<typeof useGetMyProfileImageQuery>;
export type GetMyProfileImageLazyQueryHookResult = ReturnType<typeof useGetMyProfileImageLazyQuery>;
export type GetMyProfileImageSuspenseQueryHookResult = ReturnType<typeof useGetMyProfileImageSuspenseQuery>;
export type GetMyProfileImageQueryResult = Apollo.QueryResult<GetMyProfileImageQuery, GetMyProfileImageQueryVariables>;
export const UpdateNicknameDocument = gql`
    mutation UpdateNickname($input: UpdateNicknameInput!) {
  updateNickname(input: $input) {
    id
    userId
    email
    nickname
    profileImage
  }
}
    `;
export type UpdateNicknameMutationFn = Apollo.MutationFunction<UpdateNicknameMutation, UpdateNicknameMutationVariables>;

/**
 * __useUpdateNicknameMutation__
 *
 * To run a mutation, you first call `useUpdateNicknameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNicknameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNicknameMutation, { data, loading, error }] = useUpdateNicknameMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNicknameMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNicknameMutation, UpdateNicknameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNicknameMutation, UpdateNicknameMutationVariables>(UpdateNicknameDocument, options);
      }
export type UpdateNicknameMutationHookResult = ReturnType<typeof useUpdateNicknameMutation>;
export type UpdateNicknameMutationResult = Apollo.MutationResult<UpdateNicknameMutation>;
export type UpdateNicknameMutationOptions = Apollo.BaseMutationOptions<UpdateNicknameMutation, UpdateNicknameMutationVariables>;