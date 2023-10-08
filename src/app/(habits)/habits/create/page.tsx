import HabitsForm from '@/components/habits/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClient } from '@/server/session';

export default async function Create() {
  const client = await getClient()
  const tags = await client.tags.findAll();
  return (
    <div className='flex min-h-full flex-col p-4'>
      <div className='grid rounded-lg'>
        <Card>
          <CardHeader>
            <CardTitle>Create a Habit to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsForm submitTitle='Create Habit' tags={tags}/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
