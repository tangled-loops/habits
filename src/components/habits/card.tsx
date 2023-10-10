'use client';

import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Frequency } from '../../lib/models/habit';
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
  const query = trpc.habits.findById.useQuery(
    { id: habit.id || '' },
    { enabled: false },
  );

  const mutation = trpc.habits.addResponse.useMutation();

  const [_habit, setHabit] = useState<FrontendHabit>(habit);
  const [editing, setEditing] = useState<Field>('none');
  const [responses, setResponses] = useState(habit.responses ?? 0);

  const handleSubmit = async () => {
    const habit = await query.refetch();
    if (habit.data) setHabit(habit.data);
    setEditing('none');
  };

  const updateResponse = async () => {
    await mutation.mutateAsync({ habitId: habit.id || 'fuck' });
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
                <h3>Tracked on:</h3>
                <ul>
                  {_habit.selectedDays?.map((day) => {
                    return <li key={day}>{day}</li>;
                  })}
                </ul>
              </>
            ) : (
              'Tracked Weekly'
            )}
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger className='mr-4'>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='max-w-[50px] space-y-1'>
            <Link href={`/habits/${habit.id}`} passHref legacyBehavior>
              <DropdownMenuItem
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'w-full cursor-pointer text-left',
                )}
              >
                Details
              </DropdownMenuItem>
            </Link>
            <Link href={`/habits/${habit.id}/edit`} passHref legacyBehavior>
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
