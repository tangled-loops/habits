import HabitsForm from '@/components/habits/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Create() {
  return (
    <div className='flex min-h-full flex-col p-4'>
      <div className='grid rounded-lg'>
        <Card>
          <CardHeader>
            <CardTitle>Create a Habit to Track</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsForm submitTitle='Create Habit' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
