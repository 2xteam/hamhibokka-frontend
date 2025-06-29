// src/types/navigation.ts
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Explore: undefined;
  Profile: undefined;
};

export type GoalStackParamList = {
  GoalList: undefined;
  GoalDetail: {goalId: string};
  CreateGoal: undefined;
  EditGoal: {goalId: string};
};
