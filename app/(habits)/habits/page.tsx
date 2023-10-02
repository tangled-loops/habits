import HabitsPage from '@/components/habits/page';
import { getServerSession } from 'next-auth';

export default async function Habits() {
  return <HabitsPage />
}
