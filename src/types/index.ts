// src/types/index.ts
export interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
  followApprovalRequired: boolean;
  followerCount: number;
  followingCount: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  totalStickers: number;
  startDate?: Date;
  endDate?: Date;
  mode: 'personal' | 'competition' | 'challenger_recruitment';
  visibility: 'public' | 'followers' | 'private';
  status: 'active' | 'completed' | 'cancelled';
  createdBy: User;
  participants: GoalParticipation[];
  stickers?: Sticker[];
}

export interface GoalParticipation {
  id: string;
  user: User;
  role: 'creator' | 'participant';
  status: 'active' | 'completed' | 'withdrawn';
  stickerCount: number;
  joinedAt: Date;
}

export interface Sticker {
  id: string;
  goalId: string;
  recipientId: string;
  grantedBy: string;
  stickerImageId: string;
  reason?: string;
  status: 'earned' | 'requested' | 'rejected';
  grantedAt: Date;
}

export interface StickerImage {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  isDefault: boolean;
  category?: string;
  uploadedBy?: string;
}
