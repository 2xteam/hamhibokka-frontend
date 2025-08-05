import {useMutation} from '@apollo/client';
import React, {useState} from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {LOGIN_USER, REGISTER_USER} from '../queries/user';

// 비밀번호 강도 검증 함수
const validatePassword = (password: string) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push(`최소 ${minLength}자 이상`);
  }
  if (!hasUpperCase) {
    errors.push('대문자 포함');
  }
  if (!hasLowerCase) {
    errors.push('소문자 포함');
  }
  if (!hasNumbers) {
    errors.push('숫자 포함');
  }
  if (!hasSpecialChar) {
    errors.push('특수문자 포함');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: Math.max(0, 5 - errors.length), // 0-5 강도
  };
};

const {width, height} = Dimensions.get('window');

interface User {
  id: string;
  userId: string;
  email: string;
  nickname: string;
  profileImage?: string;
}

interface AuthScreenProps {
  onAuthSuccess: (token: string, user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({onAuthSuccess}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [login] = useMutation(LOGIN_USER);
  const [register] = useMutation(REGISTER_USER);

  const handleAuth = async () => {
    console.log('handleAuth called with:', {
      isLogin,
      email,
      password,
      nickname,
    });

    if (!email || !password || (!isLogin && !nickname)) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }

    // 비밀번호 강도 검증 (회원가입 시에만)
    if (!isLogin) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        Alert.alert(
          '비밀번호 강도 부족',
          `다음 조건을 만족해야 합니다:\n${passwordValidation.errors.join(
            '\n',
          )}`,
        );
        return;
      }
    } else {
      // 로그인 시에는 기본 길이만 확인
      if (password.length < 6) {
        Alert.alert('오류', '비밀번호는 6자 이상이어야 합니다.');
        return;
      }
    }

    // 회원가입 시 비밀번호 확인 검증
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (isLogin) {
        console.log('Attempting login with:', {email, password}); // 요청 데이터 로그

        result = await login({
          variables: {
            loginInput: {email, password},
          },
        });

        console.log('Login result:', result); // 디버깅용

        if (result.data?.login) {
          const {accessToken, user} = result.data.login;
          onAuthSuccess(accessToken, user);
        }
      } else {
        result = await register({
          variables: {
            registerInput: {email, password, nickname},
          },
        });

        if (result.data?.register) {
          const {accessToken, user} = result.data.register;
          onAuthSuccess(accessToken, user);
        }
      }
    } catch (error: any) {
      // 개발 환경에서만 에러 로그 출력
      if (__DEV__) {
        console.error('Auth error:', error);
      }

      let errorMessage = isLogin
        ? '로그인에 실패했습니다.'
        : '회원가입에 실패했습니다.';

      // GraphQL 에러 메시지 추출
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];

        // 개발 환경에서만 GraphQL 에러 로그 출력
        if (__DEV__) {
          console.log('GraphQL Error:', graphQLError);
        }

        // 특정 에러 메시지 처리
        if (
          graphQLError.message &&
          graphQLError.message.includes('이미 존재하는 이메일')
        ) {
          errorMessage = '이미 가입된 이메일입니다.';
        } else if (
          graphQLError.message &&
          graphQLError.message.includes('이미 사용 중인 닉네임')
        ) {
          errorMessage = '이미 사용 중인 닉네임입니다.';
        } else if (
          graphQLError.message &&
          graphQLError.message.includes('잘못된 이메일')
        ) {
          errorMessage = '올바른 이메일 형식을 입력해주세요.';
        } else if (
          graphQLError.message &&
          graphQLError.message.includes('잘못된 비밀번호')
        ) {
          errorMessage = '비밀번호를 다시 확인해주세요.';
        } else {
          // 기본적으로 GraphQL 에러 메시지 사용
          errorMessage = graphQLError.message || errorMessage;
        }
      } else if (error.networkError) {
        errorMessage = '네트워크 연결을 확인해주세요.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('오류', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNickname('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* 로고 영역 */}
        <View style={styles.logoContainer}>
          <Text style={styles.appName}>🥇 함히보까</Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? '다시 만나서 반가워요! 👋'
              : '함께 목표를 달성해봐요! ✨'}
          </Text>
        </View>

        {/* 입력 폼 */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이메일</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#BDC3C7"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder={
                  isLogin
                    ? '비밀번호를 입력해주세요'
                    : '8자 이상, 대소문자, 숫자, 특수문자 포함'
                }
                placeholderTextColor="#BDC3C7"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeButtonText}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
            {!isLogin && password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                {(() => {
                  const validation = validatePassword(password);
                  return (
                    <>
                      <View style={styles.strengthBar}>
                        <View
                          style={[
                            styles.strengthFill,
                            {width: `${(validation.strength / 5) * 100}%`},
                          ]}
                        />
                      </View>
                      <Text style={styles.strengthText}>
                        강도: {validation.strength}/5
                      </Text>
                      {validation.errors.length > 0 && (
                        <Text style={styles.errorText}>
                          {validation.errors.join(', ')}
                        </Text>
                      )}
                    </>
                  );
                })()}
              </View>
            )}
          </View>

          {!isLogin && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>비밀번호 확인</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={[
                      styles.textInput,
                      styles.passwordInput,
                      confirmPassword &&
                        password !== confirmPassword &&
                        styles.errorInput,
                    ]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="비밀번호를 다시 입력해주세요"
                    placeholderTextColor="#BDC3C7"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }>
                    <Text style={styles.eyeButtonText}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {confirmPassword && password !== confirmPassword && (
                  <Text style={styles.errorText}>
                    비밀번호가 일치하지 않습니다
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>닉네임</Text>
                <TextInput
                  style={styles.textInput}
                  value={nickname}
                  onChangeText={text => {
                    if (text.length <= 12) {
                      setNickname(text);
                    }
                  }}
                  placeholder="다른 사용자들에게 보여질 이름 (최대 12자)"
                  placeholderTextColor="#BDC3C7"
                  maxLength={12}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.authButton, isLoading && styles.disabledButton]}
            onPress={handleAuth}
            disabled={isLoading}>
            <Text style={styles.authButtonText}>
              {isLoading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleAuthMode}>
            <Text style={styles.switchButtonText}>
              {isLogin ? '계정이 없으신가요? ' : '이미 계정이 있으신가요? '}
              <Text style={styles.switchButtonHighlight}>
                {isLogin ? '회원가입' : '로그인'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8F7',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 12,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E8F5F3',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#34495E',
  },
  authButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#BDC3C7',
    shadowOpacity: 0,
    elevation: 0,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 14,
    color: '#34495E',
  },
  switchButtonHighlight: {
    color: '#4ECDC4',
    fontWeight: '600',
  },
  errorInput: {
    borderColor: '#E74C3C',
    backgroundColor: '#FDF2F2',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 20,
  },
  passwordStrengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: '#E0E6ED',
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: '#34495E',
    fontWeight: '500',
  },
});

export default AuthScreen;
