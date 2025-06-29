// src/utils/cacheUtils.ts
import {gql} from '@apollo/client';
import {apolloClient} from '../graphql/client';

export const invalidateGoalCache = (goalId?: string) => {
  if (goalId) {
    apolloClient.cache.evict({
      id: apolloClient.cache.identify({__typename: 'Goal', id: goalId}),
    });
  }

  // 관련 쿼리들 무효화
  apolloClient.refetchQueries({
    include: ['MyGoals', 'FollowingGoals'],
  });
};

export const invalidateUserCache = (userId?: string) => {
  if (userId) {
    apolloClient.cache.evict({
      id: apolloClient.cache.identify({__typename: 'User', id: userId}),
    });
  }
};

export const updateStickerCount = (
  goalId: string,
  userId: string,
  increment: number = 1,
) => {
  const goalCache = apolloClient.cache.readFragment({
    id: apolloClient.cache.identify({__typename: 'Goal', id: goalId}),
    fragment: gql`
      fragment GoalParticipants on Goal {
        participants {
          id
          user {
            id
          }
          stickerCount
        }
      }
    `,
  });

  if (goalCache && Array.isArray((goalCache as any).participants)) {
    const updatedParticipants = (goalCache as any).participants.map(
      (participant: any) => {
        if (participant.user.id === userId) {
          return {
            ...participant,
            stickerCount: participant.stickerCount + increment,
          };
        }
        return participant;
      },
    );

    apolloClient.cache.writeFragment({
      id: apolloClient.cache.identify({__typename: 'Goal', id: goalId}),
      fragment: gql`
        fragment UpdateGoalParticipants on Goal {
          participants {
            id
            user {
              id
            }
            stickerCount
          }
        }
      `,
      data: {participants: updatedParticipants},
    });
  }
};
