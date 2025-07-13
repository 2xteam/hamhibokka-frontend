module.exports = {
  // root: true,
  // extends: '@react-native',

  extends: [
    '@react-native-community',
    'prettier', // prettier와 충돌하는 규칙 비활성화
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // prettier 규칙을 eslint 에러로 표시
  },
};
