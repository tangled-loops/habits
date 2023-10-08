import { getClient } from "@/server/session";

export default async function Habits({ params }: { params: { id: string } }) {
  const api = await getClient()
  const habit = await api.habits.findById({ id: params.id })
  return <h1>Habit {habit?.name} with id: {params.id}</h1>;
}
