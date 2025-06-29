// src/components/common/Card.tsx
import React from 'react';
import {View, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {Colors, Spacing, BorderRadius, Shadows} from '../../theme';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof Spacing;
  margin?: keyof typeof Spacing;
  shadow?: keyof typeof Shadows;
  style?: ViewStyle;
}

const CardContainer = styled(View)<{
  padding: number;
  margin: number;
}>`
  background-color: ${Colors.background};
  border-radius: ${BorderRadius.large}px;
  padding: ${({padding}: {padding: number}) => padding}px;
  margin: ${({margin}: {margin: number}) => margin}px;
`;

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  margin = 'sm',
  shadow = 'medium',
  style,
}) => {
  return (
    <CardContainer
      padding={Spacing[padding]}
      margin={Spacing[margin]}
      style={style}>
      {children}
    </CardContainer>
  );
};
