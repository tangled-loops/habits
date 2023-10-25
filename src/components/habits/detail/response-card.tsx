import { Dot, Plus } from 'lucide-react';
import { GridLoader } from 'react-spinners';

import { HasHabitAndTRPC, TRPCData } from './types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

function ResponseCardContent({ responses }: { responses?: Response[] }) {
  if (!responses) {
    return (
      <div className='flex h-[200px] w-full flex-col items-center justify-center'>
        <div className='flex flex-row items-center justify-center'>
          <GridLoader color='#3bdb6b' />
        </div>
      </div>
    );
  }

  if (responses.length === 0) {
    return <span></span>;
  }

  return (
    <ScrollArea className='h-[200px] border p-4 shadow'>
      <Table>
        <TableHead>
          <TableHeader>Date</TableHeader>
        </TableHead>
        <TableBody className='rounded-lg border'>
          {responses.map((response) => {
            return (
              <TableRow key={response.id}>
                <TableCell>
                  <div className='flex flex-row'>
                    <div className='flex flex-col items-center justify-center'>
                      <Dot />
                    </div>
                    <div className='flex w-full flex-row space-x-2'>
                      <span>{response.createdAt.toLocaleDateString()}</span>
                      <span>at</span>
                      <span>{response.createdAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function ResponseCard({ habit, count }: HasHabitAndTRPC) {
  const { mutateAsync } = trpc.responses.add.useMutation();
  const responses = trpc.responses.since.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });

  const updateResponse = async () => {
    await mutateAsync({ habitId: habit.id! });
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
