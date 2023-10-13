import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { HabitCreate } from '@/components/habits/create';
import { HabitsList } from '@/components/habits/list';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getClient } from '@/server/session';

import { Button } from '$/ui/button';

export default async function Habits({
  searchParams,
}: {
  searchParams: { page: number };
}) {
  const client = await getClient();
  const habits = await client.habits.findAll({
    limit: 10,
    page: Number(searchParams.page ?? 1),
  });
  return (
    <div className='flex max-h-screen min-h-full flex-col md:mx-8 lg:mx-16'>
      <HabitCreate />
      <div className='flex flex-row items-center justify-between border p-4 md:-mx-20'>
        <h2>Habit Tracker</h2>
        <Link href='/habits?create=true' passHref>
          <Button>
            <Plus className='mr-2' />
            New Habit
          </Button>
        </Link>
      </div>
      <ScrollArea className='mt-4 h-[80vh] rounded-xl border p-4'>
        <div className=''>
          {/* <div className='flex flex-row items-center justify-between py-4'>
          <h1 className='px-2 py-4'>Habits</h1>
          <div className='flex flex-row'>Sort by</div>
        </div> */}
          {/* <Separator className='mb-5' /> */}
          <div className='p-4'>
            <HabitsList habits={habits} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
