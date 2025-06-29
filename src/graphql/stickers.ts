// src/graphql/stickers.ts
import {gql} from '@apollo/client';

export const GRANT_STICKER_MUTATION = gql`
  mutation GrantSticker(
    $goalId: ID!
    $userId: ID!
    $stickerImageId: ID!
    $reason: String
  ) {
    grantSticker(
      goalId: $goalId
      userId: $userId
      stickerImageId: $stickerImageId
      reason: $reason
    ) {
      id
      recipientId
      grantedBy
      stickerImageId
      reason
      grantedAt
    }
  }
`;

export const GET_STICKER_IMAGES_QUERY = gql`
  query GetStickerImages($isDefault: Boolean) {
    stickerImages(isDefault: $isDefault) {
      id
      name
      imageUrl
      thumbnailUrl
      isDefault
      category
    }
  }
`;
