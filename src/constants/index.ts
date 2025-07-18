// ===== 목표 모드 (Goal Mode) =====
export const GOAL_MODES = {
  PERSONAL: 'personal',
  COMPETITION: 'competition',
  CHALLENGER_RECRUITMENT: 'challenger_recruitment',
} as const;

export type GoalMode = (typeof GOAL_MODES)[keyof typeof GOAL_MODES];

// ===== 목표 상태 (Goal Status) =====
export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

export type GoalStatus = (typeof GOAL_STATUS)[keyof typeof GOAL_STATUS];

// ===== 목표 공개 범위 (Goal Visibility) =====
export const GOAL_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  FOLLOWERS: 'followers',
} as const;

export type GoalVisibility =
  (typeof GOAL_VISIBILITY)[keyof typeof GOAL_VISIBILITY];

// ===== 팔로우 상태 (Follow Status) =====
export const FOLLOW_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  MUTUAL: 'mutual',
} as const;

export type FollowStatus = (typeof FOLLOW_STATUS)[keyof typeof FOLLOW_STATUS];

// ===== 초대 상태 (Invitation Status) =====
export const INVITATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type InvitationStatus =
  (typeof INVITATION_STATUS)[keyof typeof INVITATION_STATUS];

// ===== 기본값들 =====
export const DEFAULT_VALUES = {
  STICKER_COUNT: '1',
  EMPTY_STRING: '',
  FALSE: false,
  TRUE: true,
  ZERO: 0,
  ONE: 1,
} as const;

// ===== 탭 라벨 =====
export const TAB_LABELS = {
  HOME: '홈',
  GOALS: '목표 관리',
  EXPLORE: '탐색',
  PROFILE: '프로필',
} as const;

// ===== 목표 모드 라벨 =====
export const GOAL_MODE_LABELS = {
  [GOAL_MODES.PERSONAL]: '개인',
  [GOAL_MODES.COMPETITION]: '경쟁',
  [GOAL_MODES.CHALLENGER_RECRUITMENT]: '챌린저',
} as const;

// ===== 목표 상태 라벨 =====
export const GOAL_STATUS_LABELS = {
  [GOAL_STATUS.ACTIVE]: '진행 중',
  [GOAL_STATUS.COMPLETED]: '완료',
  [GOAL_STATUS.ARCHIVED]: '보관됨',
} as const;

// ===== 목표 공개 범위 라벨 =====
export const GOAL_VISIBILITY_LABELS = {
  [GOAL_VISIBILITY.PUBLIC]: '공개',
  [GOAL_VISIBILITY.PRIVATE]: '비공개',
  [GOAL_VISIBILITY.FOLLOWERS]: '팔로워만',
} as const;

// ===== 팔로우 상태 라벨 =====
export const FOLLOW_STATUS_LABELS = {
  [FOLLOW_STATUS.PENDING]: '대기중',
  [FOLLOW_STATUS.APPROVED]: '맞팔중',
  [FOLLOW_STATUS.MUTUAL]: '맞팔중',
} as const;

// ===== 초대 상태 라벨 =====
export const INVITATION_STATUS_LABELS = {
  [INVITATION_STATUS.PENDING]: '대기중',
  [INVITATION_STATUS.APPROVED]: '승인됨',
  [INVITATION_STATUS.REJECTED]: '거절됨',
} as const;

// ===== 버튼 텍스트 =====
export const BUTTON_TEXTS = {
  FOLLOW: '팔로우',
  FOLLOWING: '팔로우 중',
  PENDING: '대기중',
  MUTUAL_FOLLOW: '맞팔중',
  PROCESSING: '처리 중...',
  LOADING: '불러오는 중...',
  SAVE: '저장',
  CANCEL: '취소',
  CONFIRM: '확인',
  CLOSE: '닫기',
  JOIN: '참여하기',
  APPROVE: '승인',
  REJECT: '거절',
  VIEW_ALL: '전체보기',
} as const;

// ===== 에러 메시지 =====
export const ERROR_MESSAGES = {
  FAILED_TO_GET_USER_DATA: 'Failed to get user data',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  INVALID_INPUT: '올바르지 않은 입력입니다.',
} as const;

// ===== 성공 메시지 =====
export const SUCCESS_MESSAGES = {
  GOAL_CREATED: '목표가 성공적으로 생성되었습니다.',
  GOAL_UPDATED: '목표가 성공적으로 수정되었습니다.',
  FOLLOW_REQUEST_SENT: '팔로우 요청을 보냈습니다.',
  INVITATION_SENT: '초대 요청을 보냈습니다.',
  INVITATION_APPROVED: '초대를 승인했습니다.',
  INVITATION_REJECTED: '초대를 거절했습니다.',
} as const;

// ===== 빈 상태 메시지 =====
export const EMPTY_MESSAGES = {
  NO_GOALS: '아직 만든 목표가 없어요! 🥺',
  NO_PARTICIPATED_GOALS: '아직 참여한 목표가 없어요! 🥺',
  NO_FOLLOWERS: '아직 팔로워가 없어요! 🥺',
  NO_FOLLOWING: '아직 팔로우한 사용자가 없어요! 🥺',
  NO_INVITATIONS: '아직 초대 요청이 없어요! 🥺',
  NO_SEARCH_RESULTS: '검색 결과가 없습니다',
} as const;

// ===== 로딩 메시지 =====
export const LOADING_MESSAGES = {
  LOADING_GOALS: '목표를 불러오는 중...',
  LOADING_PARTICIPATED_GOALS: '참여한 목표를 불러오는 중...',
  LOADING_CHALLENGERS: '챌린저를 불러오는 중...',
  LOADING_FOLLOWERS: '팔로워를 불러오는 중...',
  LOADING_INVITATIONS: '초대 요청을 불러오는 중...',
} as const;

// ===== 이모지 =====
export const EMOJIS = {
  GOAL: '🥇',
  PERSONAL: '💪',
  COMPETITION: '🏆',
  CHALLENGER: '👬',
  STICKER: '⭐',
  COMPLETED_STICKER: '🌟',
  TROPHY: '🏆',
  USER: '👷',
  GROUP: '👬',
  NOTIFICATION: '🔔',
  SEARCH: '🔍',
  HOME: '🏠',
  PROFILE: '👤',
  SETTINGS: '⚙️',
  ADD: '➕',
  EDIT: '✏️',
  DELETE: '🗑️',
  CHECK: '✅',
  CLOSE: '❌',
  WARNING: '⚠️',
  INFO: 'ℹ️',
  SUCCESS: '🎉',
  ERROR: '😢',
  WAVE: '👋',
  CHALLENGE: '🏆',
  FEED: '📰',
  CREATE: '➕',
  PARTICIPANT: '🏋️‍♂️',
} as const;

// ===== 색상 =====
export const COLORS = {
  PRIMARY: '#FF6B9D',
  PRIMARY_DARK: '#E91E63',
  PRIMARY_LIGHT: '#FF8FA3',
  SECONDARY: '#8E44AD',
  SUCCESS: '#27AE60',
  WARNING: '#F39C12',
  ERROR: '#E74C3C',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#BDC3C7',
  LIGHT_GRAY: '#F0F2F5',
} as const;

// ===== 숫자 상수 =====
export const NUMBERS = {
  MAX_STICKER_COUNT: 100,
  MAX_TITLE_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 100,
  DEFAULT_STICKER_COUNT: 1,
  MIN_STICKER_COUNT: 1,
  MAX_PARTICIPANTS_DISPLAY: 3,
  MAX_CHALLENGE_GOALS_DISPLAY: 2,
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
} as const;

// ===== 스토리지 키 =====
export const STORAGE_KEYS = {
  TOKEN: '@hamhibokka_token',
  USER: '@hamhibokka_user',
} as const;

// ===== 네비게이션 스크린 이름 =====
export const SCREEN_NAMES = {
  MAIN: 'Main',
  HOME: 'Home',
  GOALS: 'Goals',
  EXPLORE: 'Explore',
  PROFILE: 'Profile',
  CREATE_GOAL: 'CreateGoal',
  GOAL_DETAIL: 'GoalDetail',
  USER_PROFILE: 'UserProfile',
  INVITATION_DETAIL: 'InvitationDetail',
  FRIEND_SEARCH: 'FriendSearch',
  GOAL_SEARCH: 'GoalSearch',
} as const;
