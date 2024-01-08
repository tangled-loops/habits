'use client';

import React, { useEffect } from 'react';

type SidebarSize = 'na' | 'sm' | 'lg';

interface UIContextValue {
  sidebarSize: SidebarSize;
  sidebarMargin: string;
  setSidebarSize: React.Dispatch<React.SetStateAction<SidebarSize>>;
}

export const UIContext = React.createContext<UIContextValue>(
  {} as UIContextValue,
);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarSize, setSidebarSize] = React.useState<SidebarSize>('na');

  useEffect(() => {
    function handler() {
      if (window.innerWidth < 640 && sidebarSize !== 'na') setSidebarSize('na');
      else if (window.innerWidth > 640 && sidebarSize === 'na')
        setSidebarSize('lg');
    }
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  });

  return (
    <UIContext.Provider
      value={{
        sidebarSize,
        sidebarMargin:
          sidebarSize === 'sm'
            ? 'ml-[85px]'
            : sidebarSize === 'na'
            ? 'ml-[0px]'
            : 'ml-[200px]',
        setSidebarSize,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
