import HabitsPage from '@/components/habits/page';
import { client } from '@/lib/api';
import { authOptions } from '@/server/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Habits() {
  const session = await getServerSession(authOptions)
  console.log(session)
  if (!session) redirect('/');

  const api = client(session)
  const habits = await api.habits.findAll()
  console.log(habits)
  return <HabitsPage habits={habits} />
}
