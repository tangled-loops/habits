'use client';

import React, { useContext } from 'react';

import { UIContext } from '@/components/providers/ui';
import { cn } from '@/lib/utils';

export function SettingsWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarMargin } = useContext(UIContext);
  return (
    <div className={cn(sidebarMargin, 'rounded-xl border-0')}>{children}</div>
  );
}
