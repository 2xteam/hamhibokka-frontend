// src/components/common/Avatar.tsx
import React from 'react';
import {View, Text, Image, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {Colors, Typography} from '../../theme';

interface AvatarProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  imageUri?: string;
  name?: string;
  style?: ViewStyle;
}

const sizeMap = {
  small: 32,
  medium: 48,
  large: 64,
  xl: 96,
};

const AvatarContainer = styled(View)<{size: number}>`
  width: ${({size}: {size: number}) => size}px;
  height: ${({size}: {size: number}) => size}px;
  border-radius: ${({size}: {size: number}) => size / 2}px;
  background-color: ${Colors.primary};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AvatarImage = styled(Image)<{size: number}>`
  width: ${({size}: {size: number}) => size}px;
  height: ${({size}: {size: number}) => size}px;
`;

const InitialText = styled(Text)<{size: number}>`
  color: ${Colors.background};
  font-size: ${({size}: {size: number}) => size * 0.4}px;
  font-weight: 600;
`;

export const Avatar: React.FC<AvatarProps> = ({
  size = 'medium',
  imageUri,
  name,
  style,
}) => {
  const avatarSize = sizeMap[size];
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <AvatarContainer size={avatarSize} style={style}>
      {imageUri ? (
        <AvatarImage source={{uri: imageUri}} size={avatarSize} />
      ) : (
        <InitialText size={avatarSize}>{initial}</InitialText>
      )}
    </AvatarContainer>
  );
};
