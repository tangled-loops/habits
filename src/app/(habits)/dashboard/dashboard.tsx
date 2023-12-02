'use client';

import React, { useContext } from 'react';

import { UIContext } from '@/components/providers/ui';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  const { sidebarMargin } = useContext(UIContext);

  return (
    <div className={'border-b shadow-sm'}>
      <h1 className={cn('h-[62px] p-4 text-xl', sidebarMargin)}>Dashboard</h1>
    </div>
  );
}

export function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { sidebarMargin } = React.useContext(UIContext);
  return <div className={cn(sidebarMargin, 'h-full')}>{children}</div>;
}
