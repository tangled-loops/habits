import { DetailSection } from '@/components/habits/detail';
import { getClient } from '@/server/session';
import { redirect } from 'next/navigation';

export default async function Habits({ params }: { params: { id: string } }) {
  const api = await getClient();
  if (!api) redirect('/login')
  const habit = await api.habits.findById({ habitId: params.id });
  // const responses = await api.responses.since({
  //   habitId: params.id,
  //   frequency: habit.frequency,
  // });
  return (
    <div className='-m-8 md:container'>
      <div className='mt-4 flex min-h-full flex-col'>
        <DetailSection habit={habit} />
      </div>
    </div>
  );
}
