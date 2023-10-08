'use client';

import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { EditField, Field } from './edit-field';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { HabitsFormValues } from '@/lib/models/habit';

import { Badge } from '$/ui/badge';

interface HabitCardProps {
  habit: Partial<HabitsFormValues>;
}

export function HabitCard({ habit }: HabitCardProps) {
  const query = trpc.habits.findById.useQuery({ id: habit.id || '' });

  const [_habit, setHabit] = useState<Partial<HabitsFormValues>>(habit);
  const [editing, setEditing] = useState<Field>('none');

  const handleSubmit = async () => {
    const habit = await query.refetch();
    if (habit.data) setHabit(habit.data);
    setEditing('none');
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
        <CardHeader className='grow'>
          <CardTitle className='font-2xl' onClick={() => setEditing('name')}>
            {content('name')}
          </CardTitle>
        </CardHeader>
        <Badge className='m-8 bg-blue-400 px-4 py-1'>{_habit.frequency}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger className='mr-4'>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='space-y-1'>
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
      <CardFooter className='items-center justify-between'>
        <div className='flex flex-row space-x-2'>
          {_habit.tags?.map((tag) => {
            return (
              <Badge id={tag} className='bg-blue-500'>
                {tag}
              </Badge>
            );
          })}
        </div>
        <div className='flex flex-row items-center space-x-5'>
          <div className='text-sm'>0 / {_habit.goal}</div>
          <Button onClick={() => {}}>
            <Plus />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
