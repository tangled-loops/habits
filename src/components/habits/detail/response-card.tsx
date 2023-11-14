import { Plus } from 'lucide-react';
import { GridLoader } from 'react-spinners';

import { FrontendResponse } from '../../../lib/models/response';
import { HasHabitAndTRPC, TRPCData } from './types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useDelayRender } from '@/lib/hooks/use-delay-render';
import { backgroundColor, Color } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

// function date(item: { createdAt: Date }) {
//   return new Date(
//     item.createdAt.toISOString().replaceAll('T', ' ').replaceAll('Z', ''),
//   ).toLocaleDateString();
// }

function time(item: { createdAt: Date }) {
  const locTime = new Date(
    item.createdAt.toISOString().replaceAll('T', ' ').replaceAll('Z', ''),
  ).toLocaleTimeString();
  const parts = locTime.split(' ');
  const type = parts[1];
  const restNoSec = parts[0]
    .split(':')
    .filter((_x, i, r) => i < r.length - 1)
    .join(':');
  return `${restNoSec} ${type}`;
}

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
  responses?: Record<string, FrontendResponse[]>;
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

  const section = (responses: FrontendResponse[]) => {
    return responses.map((response) => (
      <li className='border border-t-0 p-2 hover:bg-secondary hover:shadow'>
        <div className='flex w-full flex-row justify-center space-x-2 md:space-x-8'>
          <div className='flex flex-row justify-end space-x-2'>
            <Badge variant={'outline'} className='text-primary'>
              <p>+1</p>
            </Badge>
            {/* <p className='text-sm'>{response.name}</p> */}
          </div>
          <p className='text-sm'>
            <span>{time(response)}</span>
          </p>
        </div>
      </li>
    ));
  };

  return (
    <ScrollArea className='-mb-2 h-[220px] w-full rounded-xl border p-0'>
      <ul className='p-4'>
        {Object.keys(responses).map((date) => (
          <div>
            <div className='sticky top-0 border-b bg-background'>{date}</div>
            <div className='ml-[100px]'>{section(responses[date])}</div>
          </div>
        ))}
      </ul>
    </ScrollArea>
  );
}

function ResponseCard({ habit, count }: HasHabitAndTRPC) {
  const { active } = useDelayRender();

  const { mutateAsync } = trpc.responses.add.useMutation();
  const inWindowResponses = trpc.responses.since.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });
  const responses = trpc.responses.findFrontendGrouped.useQuery(
    { habitId: habit.id! },
    { enabled: true },
  );

  const updateResponse = async () => {
    await mutateAsync({ habitId: habit.id! });
    await inWindowResponses.refetch();
    await responses.refetch();
    await count.refetch();
  };

  if (!active)
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className='flex flex-row items-center justify-between'>
              <p>
                Recent Responses{' '}
                {count.data ? `(${count.data} / ${habit.goal})` : '(0)'}
              </p>
              <Plus />
            </div>
          </CardTitle>
        </CardHeader>
        <Separator className={cn(backgroundColor(habit.color as Color))} />
        <CardContent>
          <div className='-mb-3 mt-2 h-[225px] rounded-lg border'></div>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className='flex flex-row items-center justify-between'>
            <p>
              Recent Responses{' '}
              {count.data ? `(${count.data} / ${habit.goal})` : '(0)'}
            </p>
            <Button variant='ghostPrimary' onClick={updateResponse}>
              <Plus />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <Separator className={cn(backgroundColor(habit.color as Color))} />
      <CardContent>
        <div className='-mb-3 mt-2'>
          <ResponseCardContent responses={responses.data} />
        </div>
      </CardContent>
    </Card>
  );
}

export { ResponseCard, ResponseCount };
