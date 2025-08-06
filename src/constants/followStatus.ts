// 팔로우 상태 관련 상수 (백엔드 FollowStatus enum과 일치)
export const FOLLOW_STATUS = {
  PENDING: 'pending', // 대기 중
  APPROVED: 'approved', // 승인됨
  BLOCKED: 'blocked', // 차단됨
} as const;

// 팔로우 상태 표시 텍스트
export const FOLLOW_STATUS_TEXT = {
  [FOLLOW_STATUS.PENDING]: '대기중',
  [FOLLOW_STATUS.APPROVED]: '맞팔중',
  [FOLLOW_STATUS.BLOCKED]: '차단됨',
} as const;

// 팔로우 상태 이모지
export const FOLLOW_STATUS_EMOJI = {
  [FOLLOW_STATUS.PENDING]: '⏳',
  [FOLLOW_STATUS.APPROVED]: '🤝',
  [FOLLOW_STATUS.BLOCKED]: '🚫',
} as const;

// 팔로우 상태 전체 표시 텍스트 (이모지 + 텍스트)
export const FOLLOW_STATUS_DISPLAY = {
  [FOLLOW_STATUS.PENDING]: '⏳ 대기중',
  [FOLLOW_STATUS.APPROVED]: '🤝 맞팔중',
  [FOLLOW_STATUS.BLOCKED]: '🚫 차단됨',
} as const;

// 팔로우 상태 색상
export const FOLLOW_STATUS_COLOR = {
  [FOLLOW_STATUS.PENDING]: '#F39C12',
  [FOLLOW_STATUS.APPROVED]: '#27AE60',
  [FOLLOW_STATUS.BLOCKED]: '#E74C3C',
} as const;

// 팔로우 버튼 텍스트
export const FOLLOW_BUTTON_TEXT = {
  FOLLOW: '팔로우',
  FOLLOWING: '팔로우 중',
  APPROVED: '맞팔중',
  PENDING: '대기중',
  BLOCKED: '차단됨',
} as const;
