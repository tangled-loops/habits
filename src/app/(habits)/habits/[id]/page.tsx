import { Dot, Edit, Plus } from 'lucide-react';
import Link from 'next/link';

import { RecentResponsesCard } from '@/components/habits/recent-responses-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DaysField } from '@/components/ui/days-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getClient } from '@/server/session';

export default async function Habits({ params }: { params: { id: string } }) {
  const api = await getClient();
  const habit = await api.habits.findById({ id: params.id });
  const responses = await api.responses.since({
    habitId: params.id,
    frequency: habit.frequency,
  });
  return (
    <div className='-m-8 md:container'>
      <div className='flex min-h-full flex-col'>
        <div className='mx-8 my-4 flex flex-row items-center justify-between rounded-lg border p-4 shadow'>
          <h1 className='text-xl font-semibold'>{habit.name}</h1>
          <Link href={`/habits/${habit.id}/edit`} passHref>
            <Button>
              <Edit />
              Edit
            </Button>
          </Link>
        </div>
        <div className='space-8 mx-8 my-1 grid h-full grid-cols-1 gap-4 rounded-lg border p-4 shadow lg:grid-cols-2'>
          <Card>
            <CardContent>
              <div className='space-4 mt-4 grid grid-cols-1'>
                <span>Notes</span>
                <span className='m-1'>{habit.notes}</span>
              </div>
              <div className='mt-4 grid'>
                <span>Tags</span>
                <span>
                  {habit.tags.map((tag) => {
                    return <Badge className='m-1'>{tag}</Badge>;
                  })}
                </span>
              </div>
              <div className='mt-4 grid'>
                <div className='flex flex-row justify-around'>
                  <div className='grid'>
                    <span>Goal</span>
                    <span className='text-center'>{habit.goal}</span>
                  </div>
                  <div className='grid gap-4'>
                    {habit.frequency === 'Weekly' ? <span></span> : null}
                    <span className='flex w-full flex-row items-center justify-center text-center'>
                      <span>{habit.frequency}</span>
                    </span>
                    {habit.frequency === 'Daily' ? (
                      <DaysField selected={habit.selectedDays ?? []} />
                    ) : null}
                  </div>
                  <div className='grid'>
                    <span>Tracked</span>
                    <span className='text-center'>{habit.responses ?? 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <RecentResponsesCard habit={habit} responses={responses} />
        </div>
      </div>
    </div>
  );
}
