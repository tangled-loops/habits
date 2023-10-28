import { Plus } from 'lucide-react';
import { GridLoader } from 'react-spinners';

import { HasHabitAndTRPC, TRPCData } from './types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { backgroundColor, Color } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { Response } from '@/server/db/schema';

interface ResponseCountProps extends TRPCData {
  initial: number;
}

function ResponseCount({ count, initial }: ResponseCountProps) {
  return (
    <div className='grid'>
      <span className='font-semibold'>Tracked</span>
      <span className='text-center'>{count.data ?? initial}</span>
    </div>
  );
}

function ResponseCardContent({
  responses,
}: {
  responses?: Record<string, Response[]>;
}) {
  if (!responses) {
    return (
      <div className='flex h-[200px] w-full flex-col items-center justify-center'>
        <div className='flex flex-row items-center justify-center'>
          <GridLoader color='#3bdb6b' />
        </div>
      </div>
    );
  }

  if (Object.keys(responses).length === 0) {
    return <span></span>;
  }

  const something = (date: string, responses: Response[]) => {
    const time = (response: Response) =>
      new Date(
        response.createdAt
          .toISOString()
          .replaceAll('T', ' ')
          .replaceAll('Z', ''),
      );
    return (
      <li key={date} className='m-2 grid grid-cols-1 gap-4'>
        {date}
        <ul className='ml-5'>
          {responses.map((response) => {
            return (
              <li key={date} className='grid grid-cols-1 gap-4'>
                <span className='m-1'>
                  {time(response).toLocaleTimeString()}
                </span>
              </li>
            );
          })}
        </ul>
      </li>
    );
  };

  return (
    <ScrollArea className='-mb-2 h-[220px] w-full rounded-xl border p-0'>
      <ul className='p-4'>
        {Object.keys(responses).map((date) => {
          return (
            <div className='flex flex-row items-center justify-center'>
              <span className='flex h-full flex-col items-center'>{`(${responses[date].length})`}</span>
              <span>{something(date, responses[date])}</span>
            </div>
          );
        })}
      </ul>
    </ScrollArea>
  );
}

function ResponseCard({ habit, count }: HasHabitAndTRPC) {
  const { mutateAsync } = trpc.responses.add.useMutation();
  const inWindowResponses = trpc.responses.since.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });
  const responses = trpc.responses.findGrouped.useQuery(
    { habitId: habit.id! },
    { enabled: true },
  );

  const updateResponse = async () => {
    await mutateAsync({ habitId: habit.id! });
    await inWindowResponses.refetch();
    await responses.refetch();
    await count.refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex flex-row items-center justify-between'>
          <p>
            Recent Responses{' '}
            {count.data ? `(${count.data} / ${habit.goal})` : '(0)'}
          </p>
          <Button variant='ghostPrimary' onClick={updateResponse}>
            <Plus />
          </Button>
        </CardTitle>
      </CardHeader>
      <Separator className={cn(backgroundColor(habit.color as Color))} />
      <CardContent className='-mb-3 mt-2'>
        <ResponseCardContent responses={responses.data} />
      </CardContent>
    </Card>
  );
}

export { ResponseCard, ResponseCount };
