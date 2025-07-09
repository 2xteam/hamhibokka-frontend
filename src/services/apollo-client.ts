
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// HTTP 링크 설정 (백엔드 서버 주소)
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', // 개발환경
  // uri: 'https://your-production-api.com/graphql', // 프로덕션환경
});

// 인증 헤더 설정
const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await AsyncStorage.getItem('@hamhibokka_token');
    
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
    return {
      headers,
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
        },
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

export default apolloClient;