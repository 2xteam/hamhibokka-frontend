// src/components/common/Button.tsx

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import styled from 'styled-components/native';
import {Colors, Typography, Spacing, BorderRadius} from '../../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'small' | 'medium' | 'large';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

interface StyledButtonProps {
  variant: Variant;
  fullWidth: boolean;
  disabled: boolean;
  size: Size;
}

const ButtonContainer = styled(TouchableOpacity)<StyledButtonProps>`
  padding: ${({size}: StyledButtonProps) => {
    switch (size) {
      case 'small':
        return `${Spacing.sm}px ${Spacing.md}px`;
      case 'large':
        return `${Spacing.lg}px ${Spacing.xl}px`;
      default:
        return `${Spacing.md}px ${Spacing.lg}px`;
    }
  }};
  border-radius: ${BorderRadius.medium}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: ${({fullWidth}: StyledButtonProps) => (fullWidth ? '100%' : 'auto')};
  background-color: ${({variant, disabled}: StyledButtonProps) => {
    if (disabled) return Colors.surfaceDark;
    switch (variant) {
      case 'primary':
        return Colors.primary;
      case 'secondary':
        return Colors.secondary;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return Colors.primary;
    }
  }};
  border-width: ${({variant}: StyledButtonProps) =>
    variant === 'outline' ? '1px' : '0px'};
  border-color: ${({variant, disabled}: StyledButtonProps) => {
    if (disabled) return Colors.borderDark;
    return variant === 'outline' ? Colors.primary : 'transparent';
  }};
  opacity: ${({disabled}: StyledButtonProps) => (disabled ? 0.6 : 1)};
`;

interface StyledTextProps {
  variant: Variant;
  size: Size;
  disabled: boolean;
}

const ButtonText = styled(Text)<StyledTextProps>`
  font-size: ${({size}: StyledTextProps) => {
    switch (size) {
      case 'small':
        return '14px';
      case 'large':
        return '18px';
      default:
        return '16px';
    }
  }};
  font-weight: 600;
  color: ${({variant, disabled}: StyledTextProps) => {
    if (disabled) return Colors.textDisabled;
    switch (variant) {
      case 'primary':
      case 'secondary':
        return Colors.background;
      case 'outline':
      case 'ghost':
        return Colors.primary;
      default:
        return Colors.background;
    }
  }};
`;

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onPress={onPress}
      style={style}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost'
              ? Colors.primary
              : Colors.background
          }
        />
      ) : (
        <ButtonText variant={variant} size={size} disabled={disabled}>
          {title}
        </ButtonText>
      )}
    </ButtonContainer>
  );
};
