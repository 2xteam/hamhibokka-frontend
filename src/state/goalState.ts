// src/state/goalState.ts
import {atom, atomFamily} from 'recoil';
import {Goal} from '../types';

export const myGoalsState = atom<Goal[]>({
  key: 'myGoalsState',
  default: [],
});

export const followingGoalsState = atom<Goal[]>({
  key: 'followingGoalsState',
  default: [],
});

export const goalDetailState = atomFamily<Goal | null, string>({
  key: 'goalDetailState',
  default: null,
});

export const selectedGoalModeState = atom<
  'personal' | 'competition' | 'challenger_recruitment'
>({
  key: 'selectedGoalModeState',
  default: 'personal',
});
