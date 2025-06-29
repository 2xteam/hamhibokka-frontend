import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';

// HTTP 연결 설정
const httpLink = createHttpLink({
  // uri: "http://localhost:3000/graphql", // 백엔드 GraphQL 엔드포인트
  url: 'http://ec2-13-55-123-201.ap-southeast-2.compute.amazonaws.com:3000/graphql',
});

// 인증 헤더 설정
const authLink = setContext(async (_, {headers}) => {
  const token = await AsyncStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// 에러 처리
const errorLink = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({message, locations, path}) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);

      // 401 에러 시 토큰 제거
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        AsyncStorage.removeItem('accessToken');
      }
    }
  },
);

// Apollo Client 인스턴스 생성
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['userId'],
      },
      Goal: {
        keyFields: ['goalId'],
      },
      Sticker: {
        keyFields: ['stickerId'],
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
