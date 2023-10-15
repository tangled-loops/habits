'use client';

import { TRPCClientErrorBase } from '@trpc/client';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { DefaultErrorShape } from '@trpc/server';
import { BookOpen, ChevronLeft, Dot, Edit, Plus } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { GridLoader } from 'react-spinners';

import { HabitEdit } from './action-dialogs';
import { icon } from './icon';

import { Badge } from '@/components/ui/badge';
import { DaysField } from '@/components/ui/days-input';
import {
  backgroundColor,
  Color,
  FrontendHabit,
  Icon,
} from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

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

interface HasHabit {
  habit: FrontendHabit;
}

type HasHabitAndTRPC = TRPCData & HasHabit;

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

function ResponsesCard({ habit, count }: HasHabitAndTRPC) {
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
          Recent Responses ({count.data} / {habit.goal})
          <Button variant='ghostPrimary' onClick={updateResponse}>
            <Plus className='mr-2' />
            {/* Mark Performed */}
          </Button>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className='-mb-3 mt-2'>
        {responses.data ? (
          <ScrollArea className='h-[200px] border p-4 shadow'>
            <Table>
              <TableHead>
                <TableHeader>Date</TableHeader>
              </TableHead>
              <TableBody className='rounded-lg border'>
                {responses.data.map((response) => {
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

function InfoCard({ habit, count }: HasHabitAndTRPC) {
  return (
    <Card>
      <CardHeader className='grow p-4'>
        <CardTitle className='font-2xl'>General Info</CardTitle>
      </CardHeader>
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
              return (
                <Badge
                  className={cn(
                    backgroundColor(habit.color as Color),
                    backgroundColor(habit.color as Color, false, true),
                    'm-1',
                  )}
                >
                  {tag}
                </Badge>
              );
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

interface JournalEntry {
  text: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export function Journal() {
  const journalEntries = [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: null,
      text: 'a blah and a blah and I blah blah blahed weeee',
    },
    {
      id: 2,
      createdAt: new Date('10/12/2023 00:00'),
      updatedAt: new Date('10/13/2023 00:00'),
      text: 'a blah and a blah and I blah blah blahed weeee',
    },
    {
      id: 3,
      createdAt: new Date('10/11/2023 00:00'),
      updatedAt: null,
      text: 'a blah and a blah and I blah blah blahed weeee',
    },
  ];
  return (
    <div className='space-8 mx-8 -mt-5 grid h-full grid-cols-1 gap-4 p-4'>
      <Card className='h-[350px]'>
        <CardHeader>
          <CardTitle className='flex flex-row items-center justify-between'>
            Journal
            <Button variant='ghostPrimary'>
              <BookOpen className='mr-2' />
              <span className='sr-only'>Write</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <ul>
            {journalEntries.map((entry) => {
              return (
                <li key={entry.id}>
                  {entry.updatedAt ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {entry.createdAt.toDateString()}
                        </TooltipTrigger>
                        <TooltipContent>
                          Last Updated: {entry.updatedAt?.toDateString() ?? ''}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span>{entry.createdAt.toDateString()}</span>
                  )}
                </li>
              );
            })}
          </ul> */}
          {/* <Editor /> */}
        </CardContent>
      </Card>
    </div>
  );
}

function Header({ habit }: { habit: FrontendHabit }) {
  return (
    <div className='border px-8 py-6 md:-mx-12'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='flex flex-row items-center text-xl font-normal'>
          <Link href={`/habits?page=1`} passHref className='-mx-6'>
            <Button variant='ghostPrimary'>
              <ChevronLeft className='mr-0' />
              Back
            </Button>
          </Link>
          <div className='mx-8'>
            <div className='flex flex-row space-x-6'>
              {icon(habit.icon as Icon, habit.color as Color)}
              {habit.name}
            </div>
            <Separator
              className={cn('ml-10', backgroundColor(habit.color as Color))}
            />
          </div>
        </h2>
        <Link href={`/habits/${habit.id}?edit=true&id=${habit.id}`} passHref>
          <Button variant='ghostPrimary'>
            <Edit className='mr-2' />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DetailSection({ habit }: HasHabit) {
  const params = useSearchParams();
  const [_habit, setHabit] = useState(habit);
  const count = trpc.responses.countSince.useQuery({
    habitId: habit.id!,
    frequency: habit.frequency,
  });
  const habitQuery = trpc.habits.findById.useQuery(
    { id: habit.id! },
    { enabled: false },
  );
  const handleSubmit = async () => {
    await habitQuery.refetch();
    setTimeout(async () => {
      if (habitQuery.data) setHabit(habitQuery.data);
    }, 250);
  };
  return (
    <>
      <Header habit={habitQuery.data ?? _habit} />
      <HabitEdit
        habit={_habit}
        forceOpen={!!params.get('edit')}
        handleSubmit={handleSubmit}
      />
      <div className='space-8 mx-8 my-1 grid h-full grid-cols-1 gap-4 p-4 lg:grid-cols-2'>
        <InfoCard habit={habitQuery.data ?? _habit} count={count} />
        <ResponsesCard habit={habitQuery.data ?? _habit} count={count} />
      </div>
      <Journal />
    </>
  );
}

export { DetailSection };
