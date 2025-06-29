// src/components/goal/GoalCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
// @ts-ignore
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {Card} from '../../components/common/Card';
import {Avatar} from '../../components/common/Avatar';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';

interface GoalCardProps {
  goal: any;
  onPress: () => void;
  showCreator?: boolean;
}

const CardContainer = styled(TouchableOpacity)`
  margin: ${Spacing.sm}px ${Spacing.md}px;
`;

const GoalHeader = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${Spacing.md}px;
`;

const GoalInfo = styled(View)`
  flex: 1;
  margin-left: ${Spacing.sm}px;
`;

const GoalTitle = styled(Text)`
  font-size: ${Typography.h4.fontSize}px;
  font-weight: ${Typography.h4.fontWeight};
  color: ${Colors.textPrimary};
  margin-bottom: ${Spacing.xs}px;
`;

const GoalMeta = styled(Text)`
  font-size: ${Typography.caption.fontSize}px;
  color: ${Colors.textSecondary};
`;

const ProgressContainer = styled(View)`
  margin: ${Spacing.md}px 0;
`;

const ProgressBar = styled(View)`
  height: 8px;
  background-color: ${Colors.surfaceDark};
  border-radius: ${BorderRadius.small}px;
  overflow: hidden;
  margin-bottom: ${Spacing.sm}px;
`;

const ProgressFill = styled(LinearGradient)<{width: string}>`
  height: 100%;
  width: ${({width}: {width: string}) => width};
  border-radius: ${BorderRadius.small}px;
`;

const ProgressText = styled(Text)`
  font-size: ${Typography.bodySmall.fontSize}px;
  color: ${Colors.textSecondary};
  text-align: center;
`;

const ParticipantsContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${Spacing.md}px;
`;

const ParticipantAvatars = styled(View)`
  flex-direction: row;
`;

const ParticipantCount = styled(Text)`
  font-size: ${Typography.bodySmall.fontSize}px;
  color: ${Colors.textSecondary};
  margin-left: ${Spacing.sm}px;
`;

const ModeIndicator = styled(View)<{mode: string}>`
  padding: ${Spacing.xs}px ${Spacing.sm}px;
  border-radius: ${BorderRadius.small}px;
  background-color: ${({mode}: {mode: string}) => {
    switch (mode) {
      case 'personal':
        return Colors.info;
      case 'competition':
        return Colors.warning;
      case 'challenger_recruitment':
        return Colors.success;
      default:
        return Colors.surfaceDark;
    }
  }};
`;

const ModeText = styled(Text)`
  font-size: ${Typography.caption.fontSize}px;
  color: ${Colors.background};
  font-weight: 600;
`;

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onPress,
  showCreator = false,
}) => {
  const getModeText = (mode: string) => {
    switch (mode) {
      case 'personal':
        return '개인';
      case 'competition':
        return '경쟁';
      case 'challenger_recruitment':
        return '챌린저 모집';
      default:
        return mode;
    }
  };

  const getTotalStickers = () => {
    return goal.participants.reduce(
      (total: number, participant: any) => total + participant.stickerCount,
      0,
    );
  };

  const getProgressPercentage = () => {
    const totalStickers = getTotalStickers();
    return Math.min((totalStickers / goal.totalStickers) * 100, 100);
  };

  const renderParticipants = () => {
    const visibleParticipants = goal.participants.slice(0, 3);
    const remainingCount = goal.participants.length - 3;

    return (
      <ParticipantsContainer>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ParticipantAvatars>
            {visibleParticipants.map((participant: any, index: number) => (
              <Avatar
                key={participant.id}
                size="small"
                imageUri={participant.user.profileImage}
                name={participant.user.nickname}
                style={{
                  marginLeft: index > 0 ? -8 : 0,
                  zIndex: visibleParticipants.length - index,
                }}
              />
            ))}
          </ParticipantAvatars>
          {remainingCount > 0 && (
            <ParticipantCount>+{remainingCount}명</ParticipantCount>
          )}
        </View>
        <ModeIndicator mode={goal.mode}>
          <ModeText>{getModeText(goal.mode)}</ModeText>
        </ModeIndicator>
      </ParticipantsContainer>
    );
  };

  return (
    <CardContainer onPress={onPress}>
      <Card padding="lg">
        {showCreator && (
          <GoalHeader>
            <Avatar
              size="small"
              imageUri={goal.createdBy.profileImage}
              name={goal.createdBy.nickname}
            />
            <GoalInfo>
              <Text style={{fontWeight: '600', color: Colors.textPrimary}}>
                {goal.createdBy.nickname}
              </Text>
            </GoalInfo>
            <Icon
              name="chevron-forward"
              size={16}
              color={Colors.textSecondary}
            />
          </GoalHeader>
        )}

        <GoalTitle numberOfLines={2}>{goal.title}</GoalTitle>
        {goal.description && (
          <GoalMeta numberOfLines={2}>{goal.description}</GoalMeta>
        )}

        <ProgressContainer>
          <ProgressBar>
            <ProgressFill
              width={`${getProgressPercentage()}%`}
              colors={[Colors.primary, Colors.primaryLight]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            />
          </ProgressBar>
          <ProgressText>
            {getTotalStickers()} / {goal.totalStickers} 스티커 (
            {getProgressPercentage().toFixed(0)}%)
          </ProgressText>
        </ProgressContainer>

        {renderParticipants()}
      </Card>
    </CardContainer>
  );
};
