import { getClient } from '@/server/session';
import HabitsPage from '@/components/habits/page';

export default async function Habits({ params }: { params: { id: string }}) {
  return (
    <h1>Habit with id: {params.id}</h1>
  );
}
