'use client';

import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Day, days } from '../../lib/models/habit';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { EditField, Field } from './edit-field';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Badge } from '$/ui/badge';

interface HabitCardProps {
  habit: FrontendHabit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const { data, refetch } = trpc.habits.findById.useQuery(
    { id: habit.id || '' },
    { enabled: true, refetchOnMount: true },
  );

  const { mutateAsync } = trpc.responses.add.useMutation();

  const [_habit, setHabit] = useState<FrontendHabit>(habit);
  const [editing, setEditing] = useState<Field>('none');
  const [responses, setResponses] = useState(habit.responses ?? 0);

  const handleSubmit = async () => {
    const { data } = await refetch();
    if (data) setHabit(data);
    setEditing('none');
  };

  const updateResponse = async () => {
    await mutateAsync({ habitId: habit.id || 'fuck' });
    setResponses(responses + 1);
  };

  const content = (field: Field) => {
    const editField = (value: string | null) => {
      return (
        <EditField
          id={_habit.id || ''}
          field={field}
          value={value}
          handleSubmit={handleSubmit}
        />
      );
    };
    const fieldEditing = field === editing;
    switch (field) {
      case 'name': {
        if (fieldEditing) return editField(_habit.name || '');
        return _habit.name;
      }
      case 'notes': {
        if (fieldEditing) return editField(_habit.notes || '');
        return _habit.notes;
      }
      default: {
        return '';
      }
    }
  };

  useEffect(() => data && setHabit(data), [data]);

  return (
    <Card>
      <div className='flex flex-row items-center'>
        <CardHeader className='grow p-2'>
          <CardTitle className='font-2xl' onClick={() => setEditing('name')}>
            {content('name')}
          </CardTitle>
        </CardHeader>
        <Popover>
          <PopoverTrigger>
            <Badge className='mx-8 my-4 bg-blue-400 px-4 py-1'>
              {_habit.frequency}
            </Badge>
          </PopoverTrigger>
          <PopoverContent align='start' alignOffset={5}>
            {_habit.frequency === 'Daily' ? (
              <>
                <div className='grid grid-cols-7 gap-0.5'>
                  {days().map((day, i) => {
                    const sday = Day[day];
                    const sliceTo = i === (Day.Thursday || Day.Sunday) ? 2 : 1;
                    if (_habit.selectedDays?.includes(sday)) {
                      return (
                        <Badge
                          variant='secondary'
                          className='bg-primary text-background hover:bg-primary/50 text-center'
                        >
                          {sday.slice(0, sliceTo)}
                        </Badge>
                      );
                    }
                    return (
                      <Badge
                        variant='outline'
                        className='text-foreground text-center'
                      >
                        {sday.slice(0, sliceTo)}
                      </Badge>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className='text-center'>Tracked Weekly</div>
            )}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger className='mr-4'>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='max-w-[50px] space-y-1'>
            <Link href={`/habits/${habit.id}`} passHref>
              <DropdownMenuItem
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'w-full cursor-pointer text-left',
                )}
              >
                Details
              </DropdownMenuItem>
            </Link>
            <Link href={`/habits/${habit.id}/edit`} passHref>
              <DropdownMenuItem
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'w-full cursor-pointer text-left',
                )}
              >
                <Edit className='mr-2' />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'w-full cursor-pointer',
              )}
            >
              <Trash className='mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardFooter className='items-center justify-between p-3'>
        <div className='jusitfy-end flex flex-row space-x-2'>
          {_habit.tags?.map((tag) => {
            return (
              <Badge id={tag} className='bg-blue-500'>
                {tag}
              </Badge>
            );
          })}
        </div>
        <div className='flex flex-row items-center space-x-5'>
          <div className='text-sm'>
            {responses} / {_habit.goal}
          </div>
          <Button onClick={() => void updateResponse()}>
            <Plus />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
