export default async function Habits({ params }: { params: { id: string } }) {
  return <h1>Habit with id: {params.id}</h1>;
}
