// 알림 타이틀 관련 상수
export const ALERT_TITLES = {
  SUCCESS: '성공',
  ERROR: '오류',
  WARNING: '경고',
  INFO: '알림',
} as const;

// 알림 타이틀 이모티콘
export const ALERT_EMOJIS = {
  SUCCESS: '😁',
  ERROR: '😣',
  WARNING: '⚠️',
  INFO: 'ℹ️',
} as const;

// 알림 타이틀 (이모티콘 + 텍스트)
export const ALERT_TITLES_WITH_EMOJI = {
  SUCCESS: `${ALERT_EMOJIS.SUCCESS} ${ALERT_TITLES.SUCCESS}`,
  ERROR: `${ALERT_EMOJIS.ERROR} ${ALERT_TITLES.ERROR}`,
  WARNING: `${ALERT_EMOJIS.WARNING} ${ALERT_TITLES.WARNING}`,
  INFO: `${ALERT_EMOJIS.INFO} ${ALERT_TITLES.INFO}`,
} as const;
