import { getClient } from '@/src/server/session';
import HabitsPage from '@/components/habits/page';

export default async function Habits() {
  const api = await getClient();
  const habits = await api.habits.findAll();

  return <HabitsPage habits={habits} />;
}
