// API 서버 설정
export const API_CONFIG = {
  // 개발 환경
  DEV: {
    // BASE_URL: 'http://127.0.0.1:3000', // iOS 시뮬레이터용 local (IP 주소 사용)
    // BASE_URL: 'http://10.0.2.2:3000', // Android 에뮬레이터용 local
    BASE_URL: 'http://localhost:3000', // iOS 시뮬레이터용 local
    GRAPHQL_ENDPOINT: '/graphql',
    UPLOAD_PROFILE_IMAGE_ENDPOINT: '/upload/profile-image',
  },

  // 프로덕션 환경
  PROD: {
    BASE_URL:
      'https://hamhibokka-backend-gnbgh2gxabbea0fy.koreacentral-01.azurewebsites.net',
    GRAPHQL_ENDPOINT: '/graphql',
    UPLOAD_PROFILE_IMAGE_ENDPOINT: '/upload/profile-image',
  },
};

// 현재 환경 설정 (개발자가 여기서 변경 가능)
export const CURRENT_ENV = 'PROD'; // 'DEV' 또는 'PROD'

// 현재 환경의 API 설정 가져오기
export const getCurrentApiConfig = () => {
  return API_CONFIG[CURRENT_ENV as keyof typeof API_CONFIG];
};

// GraphQL URI 생성
export const getGraphQLUri = () => {
  const config = getCurrentApiConfig();
  return `${config.BASE_URL}${config.GRAPHQL_ENDPOINT}`;
};

// 이미지 업로드 URL 생성
export const getUploadProfileImageUrl = () => {
  const config = getCurrentApiConfig();
  return `${config.BASE_URL}${config.UPLOAD_PROFILE_IMAGE_ENDPOINT}`;
};
