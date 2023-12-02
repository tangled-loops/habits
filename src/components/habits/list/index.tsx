'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { HabitCreate } from '../action-dialogs';
import { HabitCard } from './card';

import { Button } from '@/components/ui/button';
import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';

function HabitsList({ habits }: { habits: Array<FrontendHabit> }) {
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

export { HabitsList };
