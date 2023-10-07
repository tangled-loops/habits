import { HabitCard } from '$/habits/card';
import { Button } from '$/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

import { Habit } from '@/server/db/schema';

import { getClient } from '~/session';

export default async function Habits() {
  const api = await getClient();
  const habits: Array<Habit> = await api.habits.findAll();

  return (
    <div className='flex min-h-full flex-col'>
      <div className='flex flex-row items-center justify-between rounded-xl border p-4'>
        <h2>Habit Tracker</h2>
        <Link href='/habits/create' passHref legacyBehavior>
          <Button>
            <Plus className='mr-2' />
            New Habit
          </Button>
        </Link>
      </div>
      <div className='mt-4 min-h-screen rounded-xl border p-4'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          {habits.map((habit) => {
            return <HabitCard key={habit.id} habit={habit} />;
          })}
        </div>
      </div>
    </div>
  );
}
