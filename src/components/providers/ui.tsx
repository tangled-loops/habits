// export function UIProvider() {
// const derp = useCon
// }
'use client';

import React, { createContext } from 'react';

interface UIContextValue {
  sidebarMode: boolean;
}

export const UIContext = createContext<UIContextValue>({} as UIContextValue);

export function UIProvider({ children }: { children: React.ReactNode }) {
  return (
    <UIContext.Provider value={{ sidebarMode: true }}>
      {children}
    </UIContext.Provider>
  );
}
