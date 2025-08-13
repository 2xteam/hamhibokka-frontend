/**
 * 날짜를 'yyyy년 MM월 dd일' 형식으로 포맷팅하는 함수
 * @param dateStr - ISO 문자열 형태의 날짜
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(dateStr?: string, p0?: string): string {
  if (!dateStr) return '-';

  const date = new Date(dateStr);

  // 유효하지 않은 날짜인 경우
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜를 'yyyy년 MM월 dd일 HH:mm' 형식으로 포맷팅하는 함수
 * @param dateStr - ISO 문자열 형태의 날짜
 * @returns 포맷팅된 날짜시간 문자열
 */
export function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-';

  const date = new Date(dateStr);

  // 유효하지 않은 날짜인 경우
  if (isNaN(date.getTime())) return '-';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

/**
 * 현재 날짜로부터 경과된 일수를 계산하는 함수
 * @param dateStr - ISO 문자열 형태의 날짜
 * @returns 경과된 일수
 */
export function getDaysSince(dateStr?: string): number {
  if (!dateStr) return 0;

  const date = new Date(dateStr);

  // 유효하지 않은 날짜인 경우
  if (isNaN(date.getTime())) return 0;

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}
