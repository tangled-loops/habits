export default async function Edit({ params }: { params: { id: string } }) {
  return <h1>Habit with id: {params.id}</h1>;
}
