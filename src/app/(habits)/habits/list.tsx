'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useContext } from 'react';

import { UIContext } from '@/components/providers/ui';
import { Menubar } from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { Button } from '$/ui/button';

export function ListScrollArea({ children }: { children: React.ReactNode }) {
  const { sidebarMargin } = useContext(UIContext);
  return (
    <ScrollArea className={cn(sidebarMargin, 'absolute inset-0 h-screen')}>
      {children}
    </ScrollArea>
  );
}

export function ListMenubar({ children }: { children: React.ReactNode }) {
  const { sidebarMargin } = useContext(UIContext);

  return (
    <Menubar
      className={cn(
        sidebarMargin,
        'flex flex-row justify-start rounded-none border-0 border-b',
      )}
    >
      {children}
    </Menubar>
  );
}

export function ListHeader() {
  const { sidebarMargin } = useContext(UIContext);

  return (
    <div className={cn(sidebarMargin, 'h-[63px] border-b p-4')}>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-xl font-normal'>Habit Tracker</h1>
        <Link href='/habits?create=true' passHref>
          <Button variant='ghostPrimary'>
            <Plus className='mr-2' />
            New Habit
          </Button>
        </Link>
      </div>
    </div>
  );
}
