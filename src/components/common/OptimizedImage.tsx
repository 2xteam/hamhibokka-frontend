// src/components/common/OptimizedImage.tsx
import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import {Colors, BorderRadius} from '../../theme';

interface OptimizedImageProps {
  uri: string;
  width: number;
  height: number;
  borderRadius?: number;
  placeholder?: React.ReactNode;
}

const ImageContainer = styled(View)<{
  width: number;
  height: number;
  borderRadius: number;
}>`
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;
  border-radius: ${({borderRadius}) => borderRadius}px;
  overflow: hidden;
  background-color: ${Colors.surfaceDark};
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled(View)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.surface};
`;

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  width,
  height,
  borderRadius = 0,
  placeholder,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <ImageContainer width={width} height={height} borderRadius={borderRadius}>
      {!error && (
        <FastImage
          style={{width, height}}
          source={{
            uri,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      {(loading || error) && (
        <LoadingContainer>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            placeholder || (
              <View style={{backgroundColor: Colors.surfaceDark}} />
            )
          )}
        </LoadingContainer>
      )}
    </ImageContainer>
  );
};
