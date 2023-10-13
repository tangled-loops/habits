import { Edit } from 'lucide-react';
import Link from 'next/link';

import { DetailSection } from '@/components/habits/detail';
import { HabitEdit } from '@/components/habits/edit';
import { Journal } from '@/components/habits/journal';
import { Button } from '@/components/ui/button';
import { getClient } from '@/server/session';

export default async function Habits({ params }: { params: { id: string } }) {
  const api = await getClient();
  const habit = await api.habits.findById({ id: params.id });
  const responses = await api.responses.since({
    habitId: params.id,
    frequency: habit.frequency,
  });
  return (
    <div className='-m-8 md:container'>
      <div className='mt-4 flex min-h-full flex-col'>
        <div className='flex flex-row items-center justify-between border px-8 py-6 md:-mx-12'>
          <h1 className='text-xl font-semibold'>{habit.name}</h1>
          <Link href={`/habits/${habit.id}?edit=true&id=${habit.id}`} passHref>
            <Button>
              <Edit className='mr-2' />
              Edit
            </Button>
          </Link>
        </div>
        <HabitEdit habit={habit} />
        <DetailSection habit={habit} responses={responses} />
        <Journal />
      </div>
    </div>
  );
}
