import {ApolloClient, InMemoryCache, createHttpLink} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getGraphQLUri} from '../config/api';

// HTTP 링크 설정 (백엔드 서버 주소)
const httpLink = createHttpLink({
  uri: getGraphQLUri(),
  // iOS에서 네트워크 요청을 위한 추가 설정
  fetchOptions: {
    mode: 'cors',
  },
  // iOS 시뮬레이터에서 네트워크 요청을 위한 헤더 설정
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 인증 헤더 설정
const authLink = setContext(async (_, {headers}) => {
  try {
    const token = await AsyncStorage.getItem('@hamhibokka_token');

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
  }
});

// Apollo Client 인스턴스 생성
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 캐시 정책 설정 (필요시)
          myGoals: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          followingGoals: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          getInvitations: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      GoalInvitation: {
        keyFields: ['invitationId'], // invitationId를 고유 키로 사용
      },
      User: {
        keyFields: ['userId'], // userId를 고유 키로 사용
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// 디버깅을 위한 로깅 추가
console.log('Apollo Client initialized with URI:', getGraphQLUri());

export default apolloClient;
