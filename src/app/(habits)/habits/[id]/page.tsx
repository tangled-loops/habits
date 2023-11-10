import { redirect } from 'next/navigation';

import { DetailSection } from '@/components/habits/detail';
import { getClient } from '@/server/session';

export default async function Habits({ params }: { params: { id: string } }) {
  const api = await getClient();
  if (!api) redirect('/login');
  const habit = await api.habits.findById({ habitId: params.id });
  return <DetailSection habit={habit} />;
}
