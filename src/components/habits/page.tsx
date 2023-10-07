'use client';

import { useState } from 'react';

import { trpc } from '@/lib/trpc';
import { Habit } from '@/src/server/db/schema';

import { HabitCard } from './card';
import { FormDialog } from './form';
import { PlusCircle } from 'lucide-react';

interface HabitsPageProps {
  habits: Array<Habit>;
}

export default function HabitsPage({ habits }: HabitsPageProps) {
  const query = trpc.habits.findAll.useQuery();

  const [_habits, setHabits] = useState<Array<Habit>>(habits);

  async function handleSubmit() {
    const newData = await query.refetch();

    if (newData.isFetched && newData.data) {
      setHabits(newData.data);
    }
  }

  return (
    <>
      <div className='bg-card grid w-full grid-cols-2 rounded p-4 shadow'>
        <h1 className='flex flex-row items-center'>Habit Tracker</h1>
        <div className='flex flex-row items-center justify-end'>
          <FormDialog
            title='New Habit'
            desc='Create a Habit to Track'
            trigger={<PlusCircle />}
            handleSubmit={handleSubmit}
            submitTitle='Create'
          />
        </div>
      </div>
      <div className='grid p-4'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {_habits.map((habit) => {
            return <HabitCard habit={habit} onSubmit={handleSubmit} />;
          })}
        </div>
      </div>
    </>
  );
}
