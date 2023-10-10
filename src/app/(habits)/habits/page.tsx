import { Plus } from 'lucide-react';
import Link from 'next/link';

import { HabitsList } from '@/components/habits/list';
import { Separator } from '@/components/ui/separator';
import { FrontendHabit } from '@/lib/models/habit';

import { getClient } from '~/session';

import { HabitCard } from '$/habits/card';
import { Button } from '$/ui/button';

export default async function Habits() {
  const api = await getClient();
  // @todo Types are getting confusing need to straighten all this out eventually
  // const habits: Array<FrontendHabit> = await api.habits.findAll({ limit: 10 });

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
      <div className='mt-4 rounded-xl border p-4'>
        <div className='flex flex-row items-center justify-between py-4'>
          <h1 className='px-2 py-4'>Everything</h1>
          <div className='flex flex-row'>Sort by</div>
        </div>
        <Separator className='mb-5' />
        <HabitsList />
      </div>
    </div>
  );
}
