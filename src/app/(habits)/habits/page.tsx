import HabitsPage from '$/habits/page';

import { getClient } from '~/session';

export default async function Habits() {
  const api = await getClient();
  const habits = await api.habits.findAll();

  return <HabitsPage habits={habits} />;
}
