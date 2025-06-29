// src/components/sticker/StickerPicker.tsx
import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
import {useQuery} from '@apollo/client';
import styled from 'styled-components/native';

import {Input} from '../common/Input';
import {Button} from '../common/Button';
import {Colors, Spacing, Typography, BorderRadius} from '../../theme';
import {GET_STICKER_IMAGES_QUERY} from '../../graphql/stickers';

interface StickerPickerProps {
  onSelect: (stickerImageId: string, reason?: string) => void;
  loading?: boolean;
}

const TabContainer = styled(View)`
  flex-direction: row;
  margin-bottom: ${Spacing.md}px;
`;

const Tab = styled(TouchableOpacity)<{active: boolean}>`
  flex: 1;
  padding: ${Spacing.sm}px;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${(props: {active: boolean}) =>
    props.active ? Colors.primary : Colors.borderLight};
`;

const TabText = styled(Text)<{active: boolean}>`
  font-size: ${Typography.bodyMedium.fontSize}px;
  font-weight: 600;
  color: ${(props: {active: boolean}) =>
    props.active ? Colors.primary : Colors.textSecondary};
`;

const StickerGrid = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const StickerItem = styled(TouchableOpacity)<{selected: boolean}>`
  width: 30%;
  aspect-ratio: 1;
  margin-bottom: ${Spacing.sm}px;
  border-radius: ${BorderRadius.medium}px;
  border-width: 2px;
  border-color: ${({selected}: {selected: boolean}) =>
    selected ? Colors.primary : Colors.borderLight};
  overflow: hidden;
  background-color: ${Colors.surface};
`;

const StickerImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ReasonContainer = styled(View)`
  margin-top: ${Spacing.lg}px;
  padding-top: ${Spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${Colors.borderLight};
`;

export const StickerPicker: React.FC<StickerPickerProps> = ({
  onSelect,
  loading = false,
}) => {
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default');
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const {data: stickerData, loading: stickerLoading} = useQuery(
    GET_STICKER_IMAGES_QUERY,
    {
      variables: {isDefault: activeTab === 'default'},
    },
  );

  const stickers = stickerData?.stickerImages || [];

  const handleStickerPress = (stickerId: string) => {
    setSelectedSticker(stickerId);
  };

  const handleConfirm = () => {
    if (selectedSticker) {
      onSelect(selectedSticker, reason.trim() || undefined);
    }
  };

  const renderStickers = () => {
    if (stickerLoading) {
      return (
        <View style={{padding: Spacing.xl, alignItems: 'center'}}>
          <Text style={{color: Colors.textSecondary}}>
            스티커를 불러오는 중...
          </Text>
        </View>
      );
    }

    if (stickers.length === 0) {
      return (
        <View style={{padding: Spacing.xl, alignItems: 'center'}}>
          <Text style={{color: Colors.textSecondary}}>
            {activeTab === 'default'
              ? '기본 스티커가 없습니다'
              : '커스텀 스티커가 없습니다'}
          </Text>
        </View>
      );
    }

    return (
      <StickerGrid>
        {stickers.map((sticker: any) => (
          <StickerItem
            key={sticker.id}
            selected={selectedSticker === sticker.id}
            onPress={() => handleStickerPress(sticker.id)}>
            <StickerImage source={{uri: sticker.thumbnailUrl}} />
          </StickerItem>
        ))}
      </StickerGrid>
    );
  };

  return (
    <View>
      <TabContainer>
        <Tab
          active={activeTab === 'default'}
          onPress={() => setActiveTab('default')}>
          <TabText active={activeTab === 'default'}>기본 스티커</TabText>
        </Tab>
        <Tab
          active={activeTab === 'custom'}
          onPress={() => setActiveTab('custom')}>
          <TabText active={activeTab === 'custom'}>내 스티커</TabText>
        </Tab>
      </TabContainer>

      <ScrollView style={{maxHeight: 300}}>{renderStickers()}</ScrollView>

      {selectedSticker && (
        <ReasonContainer>
          <Input
            label="응원 메시지 (선택사항)"
            value={reason}
            onChangeText={setReason}
            placeholder="응원의 메시지를 남겨보세요"
            multiline
            numberOfLines={3}
          />
          <Button
            title="스티커 부여하기"
            onPress={handleConfirm}
            loading={loading}
            fullWidth
          />
        </ReasonContainer>
      )}
    </View>
  );
};
