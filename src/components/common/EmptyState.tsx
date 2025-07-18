import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {COLORS, EMOJIS, EMPTY_MESSAGES} from '../../constants';

export type EmptyStateVariant =
  | 'default'
  | 'goals'
  | 'participants'
  | 'followers'
  | 'invitations'
  | 'search';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  message?: string;
  emoji?: string;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'default',
  title,
  message,
  emoji,
  style,
}) => {
  const getDefaultContent = () => {
    switch (variant) {
      case 'goals':
        return {
          title: '목표가 없어요',
          message: EMPTY_MESSAGES.NO_GOALS,
          emoji: EMOJIS.GOAL,
        };
      case 'participants':
        return {
          title: '참가자가 없어요',
          message: '아직 참가자가 없어요 😊',
          emoji: EMOJIS.GROUP,
        };
      case 'followers':
        return {
          title: '팔로워가 없어요',
          message: EMPTY_MESSAGES.NO_FOLLOWERS,
          emoji: EMOJIS.USER,
        };
      case 'invitations':
        return {
          title: '초대가 없어요',
          message: EMPTY_MESSAGES.NO_INVITATIONS,
          emoji: EMOJIS.NOTIFICATION,
        };
      case 'search':
        return {
          title: '검색 결과가 없어요',
          message: EMPTY_MESSAGES.NO_SEARCH_RESULTS,
          emoji: EMOJIS.SEARCH,
        };
      default:
        return {
          title: '데이터가 없어요',
          message: '표시할 내용이 없습니다.',
          emoji: EMOJIS.INFO,
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;
  const displayEmoji = emoji || defaultContent.emoji;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>{displayEmoji}</Text>
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{displayMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: COLORS.SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;
