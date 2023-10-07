'use client';

import { Badge } from '$/ui/badge';
import { MoreHorizontal, Plus, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { EditField, Field } from './table';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Habit } from '~/db/schema';

interface HabitCardProps {
  habit: Habit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const query = trpc.habits.findById.useQuery({ id: habit.id });

  const [_habit, setHabit] = useState(habit);
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
          id={_habit.id}
          field={field}
          value={value}
          handleSubmit={handleSubmit}
        />
      );
    };
    const fieldEditing = field === editing;
    switch (field) {
      case 'title': {
        if (fieldEditing) return editField(_habit.title);
        return _habit.title;
      }
      case 'description': {
        if (fieldEditing) return editField(_habit.description);
        return _habit.description;
      }
      default: {
        return '';
      }
    }
  };

  const tags = [
    { id: '1', name: 'daily' },
    { id: '2', name: 'life-things' },
  ];

  return (
    <Card className='bg-emerald-400'>
      <div className='flex flex-row items-center'>
        <CardHeader className='grow'>
          <CardTitle className='font-2xl' onClick={() => setEditing('title')}>
            {content('title')}
          </CardTitle>
        </CardHeader>
        <Badge className='m-8 bg-orange-400 px-4 py-1'>Weekly</Badge>
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
      {/* <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm flex flex-row">
            Lorem ipsum doo dah floo
          </div>
          <div className="text-sm flex flex-row">
            Lorem ipsum doo dah floo
          </div>
        </div>
      </CardContent> */}
      <CardFooter className='items-center justify-between'>
        <div className='flex flex-row space-x-2'>
          {tags.map((tag) => {
            return (
              <Badge id={tag.id} className='bg-blue-500'>
                {tag.name}
              </Badge>
            );
          })}
        </div>
        <div className='flex flex-row items-center space-x-5'>
          <div className='text-sm'>0 / 10</div>
          <Button onClick={() => {}}>
            <Plus />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
