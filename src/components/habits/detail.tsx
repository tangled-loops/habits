'use client';

import { TRPCClientErrorBase } from '@trpc/client';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { DefaultErrorShape } from '@trpc/server';
import { Check, Dot } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { GridLoader } from 'react-spinners';

import { HabitEdit } from './action-dialogs';
import { Journal } from './journal';

import { Badge } from '@/components/ui/badge';
import { DaysField } from '@/components/ui/days-input';
import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { Response } from '@/server/db/schema';

import { Button } from '$/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '$/ui/card';
import { ScrollArea } from '$/ui/scroll-area';
import { Separator } from '$/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '$/ui/table';

interface TRPCData {
  count: UseTRPCQueryResult<number, TRPCClientErrorBase<DefaultErrorShape>>;
}

interface ResponseCountProps extends TRPCData {
  initial: number;
}

function ResponseCount({ count, initial }: ResponseCountProps) {
  return (
    <div className='grid'>
      <span>Tracked</span>
      <span className='text-center'>{count.data ?? initial}</span>
    </div>
  );
}

interface ResponsesCardProps extends TRPCData {
  habit: FrontendHabit;
  responses: Array<Response>;
}

function ResponsesCard({ habit, responses, count }: ResponsesCardProps) {
  const { mutateAsync } = trpc.responses.add.useMutation();
  const _responses = trpc.responses.since.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });

  const updateResponse = async () => {
    await mutateAsync({ habitId: habit.id! });
    await _responses.refetch();
    await count.refetch();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex flex-row items-center justify-between'>
          Recent Responses ({count.data} / {habit.goal})
          <Button onClick={updateResponse}>
            <Check className='mr-2' />
            Respond
          </Button>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className='-mb-3 mt-2'>
        {_responses.data ? (
          <ScrollArea className='h-[200px] border p-4 shadow'>
            <Table>
              <TableHead>
                <TableHeader>Date</TableHeader>
              </TableHead>
              <TableBody className='rounded-lg border'>
                {_responses.data.map((response) => {
                  return (
                    <TableRow key={response.id}>
                      <TableCell>
                        <div className='flex flex-row'>
                          <div className='flex flex-col items-center justify-center'>
                            <Dot />
                          </div>
                          <div className='flex w-full flex-row space-x-2'>
                            <span>
                              {response.createdAt.toLocaleDateString()}
                            </span>
                            <span>at</span>
                            <span>
                              {response.createdAt.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <div className='flex h-[200px] w-full flex-col items-center justify-center'>
            <div className='flex flex-row items-center justify-center'>
              <GridLoader color='#3bdb6b' />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface InfoCardProps extends TRPCData {
  habit: FrontendHabit;
}

function InfoCard({ habit, count }: InfoCardProps) {
  return (
    <Card>
      <CardContent>
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
            <ResponseCount initial={count.data ?? 0} count={count} />
          </div>
        </div>
        <div className='mt-4 grid'>
          <span>Tags</span>
          <span>
            {habit.tags.map((tag) => {
              return <Badge className='m-1'>{tag}</Badge>;
            })}
          </span>
        </div>
        <div className='space-4 mt-4 grid grid-cols-1'>
          <span>Notes</span>
          <span className='m-1'>{habit.notes}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailSection({
  habit,
  responses,
}: {
  habit: FrontendHabit;
  responses: Array<Response>;
}) {
  const params = useSearchParams();
  const count = trpc.responses.countSince.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });
  return (
    <>
      <HabitEdit habit={habit} forceOpen={!!params.get('edit')} />
      <div className='space-8 mx-8 my-1 grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
        <InfoCard habit={habit} count={count} />
        <ResponsesCard habit={habit} responses={responses} count={count} />
      </div>
      <Journal />
    </>
  );
}

export { DetailSection };
