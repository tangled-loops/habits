'use client';

import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';

import { HabitEdit } from '../action-dialogs';
import { Header } from './header';
import { InfoCard } from './info-card';
import { Journal } from './journal';
import { ResponseCard } from './response-card';
import { HasHabit } from './types';

import { UIContext } from '@/components/providers/ui';
import { ScrollArea } from '@/components/ui/scroll-area';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

function DetailSection({ habit }: HasHabit) {
  const params = useSearchParams();
  const count = trpc.responses.countSince.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });
  const habitQuery = trpc.habits.findById.useQuery(
    { habitId: habit.id! },
    { enabled: false },
  );
  const { sidebarMargin } = useContext(UIContext);
  const handleSubmit = async () => await habitQuery.refetch();
  return (
    <div className='flex h-screen flex-col'>
      {!!params.get('edit') && (
        <HabitEdit
          habit={habitQuery.data ?? habit}
          open={true}
          handleSubmit={handleSubmit}
        />
      )}
      <div className='relative mb-4 h-full overflow-hidden'>
        <Header habit={habitQuery.data ?? habit} />
        <ScrollArea className={cn('absolute inset-0 mt-[64px]', sidebarMargin)}>
          <div className='space-8 my-1 grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
            <InfoCard habit={habitQuery.data ?? habit} count={count} />
            <ResponseCard habit={habitQuery.data ?? habit} count={count} />
          </div>
          <Journal habitId={habit.id ?? ''} />
        </ScrollArea>
      </div>
    </div>
  );
}

export { DetailSection };
