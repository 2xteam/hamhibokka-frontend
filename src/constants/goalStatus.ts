// 목표 상태 관련 상수
export enum GoalStatus {
  ACTIVE = 'active', // 활성 상태
  COMPLETED = 'completed', // 완료 상태
  CANCELLED = 'cancelled', // 취소 상태
}

// 목표 상태 표시 텍스트
export const GOAL_STATUS_TEXT = {
  [GoalStatus.ACTIVE]: '진행 중',
  [GoalStatus.COMPLETED]: '완료',
  [GoalStatus.CANCELLED]: '취소됨',
} as const;

// 목표 상태 이모지
export const GOAL_STATUS_EMOJI = {
  [GoalStatus.ACTIVE]: '🟢',
  [GoalStatus.COMPLETED]: '✅',
  [GoalStatus.CANCELLED]: '❌',
} as const;

// 목표 상태 색상
export const GOAL_STATUS_COLOR = {
  [GoalStatus.ACTIVE]: '#27AE60',
  [GoalStatus.COMPLETED]: '#2ECC71',
  [GoalStatus.CANCELLED]: '#E74C3C',
} as const;
