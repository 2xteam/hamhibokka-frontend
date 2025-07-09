// src/types/auth.types.ts
export interface User {
    id: string;
    userId: string;
    email: string;
    nickname: string;
    profileImage?: string;
  }
  
  export interface AuthPayload {
    accessToken: string;
    user: User;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface RegisterInput {
    email: string;
    password: string;
    nickname: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
  }