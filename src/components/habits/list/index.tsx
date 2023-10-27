'use client';

import { useSearchParams } from 'next/navigation';

import { HabitCreate } from '../action-dialogs';
import { HabitCard } from './card';

import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';

function HabitsList({ habits }: { habits: Array<FrontendHabit> }) {
  const searchParams = useSearchParams();
  const tags = trpc.tags.findAllNames.useQuery();

  return (
    <>
      <HabitCreate open={!!searchParams.get('create')} tags={tags.data} />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
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

export { HabitsList };
