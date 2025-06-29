// src/screens/auth/LoginScreen.tsx
import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import {Button} from '../../components/common/Button';
import {Input} from '../../components/common/Input';
import {Colors, Spacing, Typography} from '../../theme';
import {useAuth} from '../../hooks/useAuth';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${Colors.background};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const Content = styled(View)`
  flex: 1;
  padding: ${Spacing.xl}px;
  justify-content: center;
  min-height: 100%;
`;

const Header = styled(View)`
  align-items: center;
  margin-bottom: ${Spacing.xxl}px;
`;

const Title = styled(Text)`
  font-size: ${Typography.h1.fontSize}px;
  font-weight: ${Typography.h1.fontWeight};
  color: ${Colors.primary};
  margin-bottom: ${Spacing.sm}px;
`;

const Subtitle = styled(Text)`
  font-size: ${Typography.bodyMedium.fontSize}px;
  color: ${Colors.textSecondary};
  text-align: center;
`;

const FormContainer = styled(View)`
  margin-bottom: ${Spacing.xl}px;
`;

const LinkContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  margin-top: ${Spacing.lg}px;
`;

const LinkText = styled(Text)`
  font-size: ${Typography.bodyMedium.fontSize}px;
  color: ${Colors.textSecondary};
`;

const LinkButton = styled(Text)`
  font-size: ${Typography.bodyMedium.fontSize}px;
  color: ${Colors.primary};
  font-weight: 600;
  margin-left: ${Spacing.xs}px;
`;

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const {login, loginLoading} = useAuth();

  const validateForm = () => {
    let isValid = true;

    // 이메일 검증
    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // 비밀번호 검증
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      const result = await login(email, password);

      if (!result.success) {
        Alert.alert('로그인 실패', result.error);
      }
    }
  };

  return (
    <Container>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollContainer>
          <Content>
            <Header>
              <Title>함히보까</Title>
              <Subtitle>목표를 달성하고 스티커를 모아보세요!</Subtitle>
            </Header>

            <FormContainer>
              <Input
                label="이메일"
                value={email}
                onChangeText={setEmail}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                error={emailError}
              />
              <Input
                label="비밀번호"
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                leftIcon="lock-closed-outline"
                error={passwordError}
              />
              <Button
                title="로그인"
                onPress={handleLogin}
                loading={loginLoading}
                fullWidth
              />
            </FormContainer>

            <LinkContainer>
              <LinkText>계정이 없으신가요?</LinkText>
              <LinkButton onPress={() => navigation.navigate('Register')}>
                회원가입
              </LinkButton>
            </LinkContainer>

            <LinkContainer>
              <LinkButton onPress={() => navigation.navigate('ForgotPassword')}>
                비밀번호를 잊으셨나요?
              </LinkButton>
            </LinkContainer>
          </Content>
        </ScrollContainer>
      </KeyboardAvoidingView>
    </Container>
  );
};
