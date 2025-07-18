import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS, EMOJIS, LOADING_MESSAGES} from '../../constants';

export type LoadingSize = 'small' | 'large';
export type LoadingVariant = 'spinner' | 'text' | 'fullscreen';

interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  message?: string;
  style?: ViewStyle;
  color?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  variant = 'spinner',
  message,
  style,
  color = COLORS.PRIMARY,
}) => {
  const renderContent = () => {
    switch (variant) {
      case 'text':
        return (
          <View style={styles.textContainer}>
            <Text style={styles.loadingText}>
              {message || LOADING_MESSAGES.LOADING_GOALS} {EMOJIS.SUCCESS}
            </Text>
          </View>
        );
      case 'fullscreen':
        return (
          <View style={styles.fullscreenContainer}>
            <ActivityIndicator size="large" color={color} />
            <Text style={styles.fullscreenText}>
              {message || LOADING_MESSAGES.LOADING_GOALS} {EMOJIS.SUCCESS}
            </Text>
          </View>
        );
      default:
        return (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size={size as 'small' | 'large'} color={color} />
            {message && <Text style={styles.spinnerText}>{message}</Text>}
          </View>
        );
    }
  };

  return <View style={[styles.container, style]}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  spinnerText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  fullscreenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  fullscreenText: {
    marginTop: 16,
    fontSize: 18,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});

export default Loading;
