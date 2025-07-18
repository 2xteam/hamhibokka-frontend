import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {COLORS} from '../../constants';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  style,
  padding = 20,
  margin = 0,
}) => {
  const cardStyle = [
    styles.base,
    styles[variant],
    {
      padding,
      margin,
    },
    style,
  ];

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 20,
  },
  default: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_LIGHT,
  },
  elevated: {
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_LIGHT,
  },
  outlined: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY_LIGHT,
    shadowOpacity: 0,
    elevation: 0,
  },
  flat: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 0,
  },
});

export default Card;
