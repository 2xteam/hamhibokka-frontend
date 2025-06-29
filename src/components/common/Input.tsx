// src/components/common/Input.tsx
import React, {useState} from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
}

const Container = styled(View)`
  margin-bottom: ${Spacing.md}px;
`;

const Label = styled(Text)`
  font-size: ${Typography.bodyMedium.fontSize}px;
  font-weight: 600;
  color: ${Colors.textPrimary};
  margin-bottom: ${Spacing.sm}px;
`;

const InputContainer = styled(View)<{hasError: boolean; isFocused: boolean}>`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({
    hasError,
    isFocused,
  }: {
    hasError: boolean;
    isFocused: boolean;
  }) => {
    if (hasError) return Colors.error;
    if (isFocused) return Colors.primary;
    return Colors.border;
  }};
  border-radius: ${BorderRadius.medium}px;
  background-color: ${Colors.background};
  padding: ${Spacing.md}px;
`;

const StyledTextInput = styled(TextInput)`
  flex: 1;
  font-size: ${Typography.bodyMedium.fontSize}px;
  color: ${Colors.textPrimary};
  padding: 0;
`;

const IconContainer = styled(TouchableOpacity)`
  padding: ${Spacing.xs}px;
`;

const ErrorText = styled(Text)`
  font-size: ${Typography.caption.fontSize}px;
  color: ${Colors.error};
  margin-top: ${Spacing.xs}px;
`;

const HelperText = styled(Text)`
  font-size: ${Typography.caption.fontSize}px;
  color: ${Colors.textSecondary};
  margin-top: ${Spacing.xs}px;
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleRightIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      <InputContainer hasError={!!error} isFocused={isFocused}>
        {leftIcon && (
          <IconContainer>
            <Icon name={leftIcon} size={20} color={Colors.textSecondary} />
          </IconContainer>
        )}
        <StyledTextInput
          {...props}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={Colors.textDisabled}
        />
        {(rightIcon || secureTextEntry) && (
          <IconContainer onPress={handleRightIconPress}>
            <Icon
              name={
                secureTextEntry
                  ? isSecure
                    ? 'eye-off'
                    : 'eye'
                  : rightIcon || 'close'
              }
              size={20}
              color={Colors.textSecondary}
            />
          </IconContainer>
        )}
      </InputContainer>
      {error && <ErrorText>{error}</ErrorText>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </Container>
  );
};
