// src/components/sticker/StickerButton.tsx
import React, {useState} from 'react';
import {TouchableOpacity, Modal, View, Text} from 'react-native';
import {useMutation} from '@apollo/client';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

import {Button} from '../common/Button';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {GRANT_STICKER_MUTATION} from '../../graphql/stickers';
import {StickerPicker} from '@/components/sticker/StickerPicker';

interface StickerButtonProps {
  goalId: string;
  recipientId: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const StickerButtonContainer = styled(TouchableOpacity)<{
  disabled: boolean;
  size: 'small' | 'medium' | 'large';
}>`
  width: ${({size}: {size: 'small' | 'medium' | 'large'}) => {
    switch (size) {
      case 'small':
        return '32px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  }};
  height: ${({size}: {size: 'small' | 'medium' | 'large'}) => {
    switch (size) {
      case 'small':
        return '32px';
      case 'large':
        return '48px';
      default:
        return '40px';
    }
  }};
  border-radius: ${({size}: {size: 'small' | 'medium' | 'large'}) => {
    switch (size) {
      case 'small':
        return '16px';
      case 'large':
        return '24px';
      default:
        return '20px';
    }
  }};
  background-color: ${({disabled}: {disabled: boolean}) =>
    disabled ? Colors.surfaceDark : Colors.secondary};
  align-items: center;
  justify-content: center;
  opacity: ${({disabled}: {disabled: boolean}) => (disabled ? 0.6 : 1)};
`;

const ModalContainer = styled(View)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

const ModalContent = styled(View)`
  background-color: ${Colors.background};
  border-top-left-radius: ${BorderRadius.xl}px;
  border-top-right-radius: ${BorderRadius.xl}px;
  padding: ${Spacing.lg}px;
  max-height: 80%;
`;

const ModalHeader = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${Spacing.lg}px;
  padding-bottom: ${Spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.borderLight};
`;

const ModalTitle = styled(Text)`
  font-size: ${Typography.h3.fontSize}px;
  font-weight: ${Typography.h3.fontWeight};
  color: ${Colors.textPrimary};
`;

export const StickerButton: React.FC<StickerButtonProps> = ({
  goalId,
  recipientId,
  size = 'medium',
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const [grantSticker, {loading}] = useMutation(GRANT_STICKER_MUTATION, {
    onCompleted: () => {
      setModalVisible(false);
      // 성공 피드백 추가 가능
    },
    onError: error => {
      console.error('Error granting sticker:', error);
    },
  });

  const handleStickerSelect = (stickerImageId: string, reason?: string) => {
    grantSticker({
      variables: {
        goalId,
        userId: recipientId,
        stickerImageId,
        reason,
      },
    });
  };

  return (
    <>
      <StickerButtonContainer
        size={size}
        disabled={disabled}
        onPress={() => !disabled && setModalVisible(true)}>
        <Icon
          name="star"
          size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
          color={Colors.background}
        />
      </StickerButtonContainer>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <ModalContainer>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>스티커 선택</ModalTitle>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </ModalHeader>

            <StickerPicker onSelect={handleStickerSelect} loading={loading} />
          </ModalContent>
        </ModalContainer>
      </Modal>
    </>
  );
};
