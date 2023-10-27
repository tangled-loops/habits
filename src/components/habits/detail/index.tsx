'use client';

import { useSearchParams } from 'next/navigation';

import { HabitEdit } from '../action-dialogs';
import { Header } from './header';
import { InfoCard } from './info-card';
import { Journal } from './journal';
import { ResponseCard } from './response-card';
import { HasHabit } from './types';

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
  const handleSubmit = async () => {
    await habitQuery.refetch();
  };
  return (
    <>
      <Header habit={habitQuery.data ?? habit} />
      <HabitEdit
        habit={habitQuery.data ?? habit}
        open={!!params.get('edit')}
        handleSubmit={handleSubmit}
      />
      <div className='space-8 mx-8 my-1 grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
        <InfoCard habit={habitQuery.data ?? habit} count={count} />
        <ResponseCard habit={habitQuery.data ?? habit} count={count} />
      </div>
      <Journal />
    </>
  );
}

export { DetailSection };
