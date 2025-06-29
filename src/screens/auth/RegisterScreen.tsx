// src/screens/auth/RegisterScreen.tsx
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

const Header = styled(View)`
  padding: ${Spacing.lg}px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.borderLight};
`;

const Title = styled(Text)`
  font-size: ${Typography.h2.fontSize}px;
  font-weight: ${Typography.h2.fontWeight};
  color: ${Colors.textPrimary};
`;

const Content = styled(View)`
  flex: 1;
  padding: ${Spacing.xl}px;
`;

const FormContainer = styled(View)`
  flex: 1;
  justify-content: center;
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

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    nickname?: string;
  }>({});

  const {register, registerLoading} = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // 이메일 검증
    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      isValid = false;
    }

    // 닉네임 검증
    if (!nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      isValid = false;
    } else if (nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다.';
      isValid = false;
    } else if (nickname.length > 20) {
      newErrors.nickname = '닉네임은 20자 이하여야 합니다.';
      isValid = false;
    }

    // 비밀번호 검증
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다.';
      isValid = false;
    }

    // 비밀번호 확인 검증
    if (!confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      const result = await register(email, password, nickname);

      if (!result.success) {
        Alert.alert('회원가입 실패', result.error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>회원가입</Title>
      </Header>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={{flex: 1}}>
          <Content>
            <FormContainer>
              <Input
                label="이메일"
                value={email}
                onChangeText={setEmail}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                error={errors.email}
              />
              <Input
                label="닉네임"
                value={nickname}
                onChangeText={setNickname}
                placeholder="닉네임을 입력하세요"
                leftIcon="person-outline"
                error={errors.nickname}
                helperText="다른 사용자들에게 표시되는 이름입니다"
              />
              <Input
                label="비밀번호"
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                leftIcon="lock-closed-outline"
                error={errors.password}
                helperText="6자 이상 입력해주세요"
              />
              <Input
                label="비밀번호 확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry
                leftIcon="lock-closed-outline"
                error={errors.confirmPassword}
              />
              <Button
                title="회원가입"
                onPress={handleRegister}
                loading={registerLoading}
                fullWidth
              />
            </FormContainer>

            <LinkContainer>
              <LinkText>이미 계정이 있으신가요?</LinkText>
              <LinkButton onPress={() => navigation.navigate('Login')}>
                로그인
              </LinkButton>
            </LinkContainer>
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};
