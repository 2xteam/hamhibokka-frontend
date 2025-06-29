// src/state/index.ts
import React from 'react';
import {RecoilRoot} from 'recoil';

export function StateProvider({children}: {children: React.ReactNode}) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
