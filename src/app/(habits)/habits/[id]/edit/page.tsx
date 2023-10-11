import HabitsForm from '@/components/habits/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClient } from '@/server/session';

export default async function Edit({ params }: { params: { id: string } }) {
  const api = await getClient();
  const tags = await api.tags.findAll();
  const habit = await api.habits.findById({ id: params.id });

  return (
    <div className='m-4 flex min-h-full flex-col p-4'>
      <div className='grid rounded-lg'>
        <Card>
          <CardHeader>
            <CardTitle>Create a Habit to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsForm data={habit} tags={tags} submitTitle='Save' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
