import { ChevronLeft, Edit } from 'lucide-react';
import Link from 'next/link';

import { DetailSection } from '@/components/habits/detail';
import { Button } from '@/components/ui/button';
import { FrontendHabit } from '@/lib/models/habit';
import { getClient } from '@/server/session';

function Header({ habit }: { habit: FrontendHabit }) {
  return (
    <div className='border px-8 py-6 md:-mx-12'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='flex flex-row items-center text-xl font-normal'>
          <Link href={`/habits?page=1`} passHref className='-mx-6'>
            <Button variant='ghostPrimary'>
              <ChevronLeft className='mr-0' />
              Back
            </Button>
          </Link>
          <div className='mx-8'>{habit.name}</div>
        </h2>
        <Link href={`/habits/${habit.id}?edit=true&id=${habit.id}`} passHref>
          <Button variant='ghostPrimary'>
            <Edit className='mr-2' />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

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
        <Header habit={habit} />
        <DetailSection habit={habit} responses={responses} />
      </div>
    </div>
  );
}
