// export function UIProvider() {
// const derp = useCon
// }
'use client';

import React from 'react';

interface UIContextValue {
  sidebarMode: boolean;
  setSidebarMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UIContext = React.createContext<UIContextValue>(
  {} as UIContextValue,
);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarMode, setSidebarMode] = React.useState(true);
  return (
    <UIContext.Provider value={{ sidebarMode, setSidebarMode }}>
      {children}
    </UIContext.Provider>
  );
}
