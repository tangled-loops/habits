'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useContext } from 'react';

import { HabitCreate } from '../action-dialogs';
import { HabitCard } from './card';

import { UIContext } from '@/components/providers/ui';
import { Menubar } from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Button } from '$/ui/button';

export function HabitsList({ habits }: { habits: Array<FrontendHabit> }) {
  const searchParams = useSearchParams();
  const tags = trpc.tags.findAllNames.useQuery();
  return (
    <>
      <HabitCreate open={!!searchParams.get('create')} tags={tags.data} />
      {habits.length === 0 && (
        <div className='flex h-[50vh] w-full flex-row items-center justify-center'>
          <div className='flex flex-col items-center'>
            <p className='p-4'>You&apos;re not tracking any Habits... Yet!</p>
            <Link href='/habits?create=true' passHref>
              <Button>
                <Plus className='mr-2' />
                Add Habit
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3'>
        {habits.map((habit) => {
          return (
            <div key={habit.id}>
              <HabitCard habit={habit} tags={tags.data} />
            </div>
          );
        })}
      </div>
    </>
  );
}

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
