'use client';

import { useSearchParams } from 'next/navigation';

import { HabitEdit } from '../action-dialogs';
import { Header } from './header';
import { InfoCard } from './info-card';
import { Journal } from './journal';
import { ResponseCard } from './response-card';
import { HasHabit } from './types';

import { ScrollArea } from '@/components/ui/scroll-area';
import { trpc } from '@/lib/trpc';

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
  const handleSubmit = async () => await habitQuery.refetch();
  return (
    <div className='flex max-h-screen min-h-full flex-col'>
      {!!params.get('edit') && (
        <HabitEdit
          habit={habitQuery.data ?? habit}
          open={true}
          handleSubmit={handleSubmit}
        />
      )}
      <div className='mb-4 overflow-hidden'>
        <Header habit={habitQuery.data ?? habit} />
        <ScrollArea className='-mx-4 mt-[60px] h-[90vh] pb-8'>
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
