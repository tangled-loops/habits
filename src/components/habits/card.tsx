'use client';

import { Edit, MoreHorizontal, Plus, Trash, View } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Day, days } from '../../lib/models/habit';
import { Progress } from '../ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { EditField, Field } from './edit-field';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Badge } from '$/ui/badge';

interface HabitCardProps {
  habit: FrontendHabit;
}

export function HabitCard({ habit }: HabitCardProps) {
  const router = useRouter();
  const { data, refetch } = trpc.habits.findById.useQuery(
    { id: habit.id || '' },
    { enabled: true, refetchOnMount: true, refetchOnReconnect: true },
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

  if (!data) return null;
  // onClick={() => router.push(`/habits/${habit.id}`)}
  return (
    <Card className='-p-4'>
      <div className='flex flex-row items-center'>
        <CardHeader className='grow p-4'>
          <CardTitle className='font-2xl' onClick={() => setEditing('name')}>
            {content('name')}
          </CardTitle>
        </CardHeader>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className='p-4'>
              <Badge
                variant='secondary'
                className='mr-4 bg-primary text-center text-background hover:bg-primary/50'
              >
                <p>{habit.frequency}</p>
              </Badge>
            </TooltipTrigger>
            <TooltipContent className='-my-4 bg-foreground'>
              {_habit.frequency === 'Daily' ? (
                <>
                  <div className='grid grid-cols-7 gap-0.5'>
                    {days().map((day, i) => {
                      const sday = Day[day];
                      const sliceTo =
                        i === (Day.Thursday || Day.Sunday) ? 2 : 1;
                      if (_habit.selectedDays?.includes(sday)) {
                        return (
                          <Badge
                            variant='secondary'
                            className='bg-primary text-center text-background hover:bg-primary/50'
                          >
                            {sday.slice(0, sliceTo)}
                          </Badge>
                        );
                      }
                      return (
                        <Badge
                          variant='outline'
                          className='text-center text-background'
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
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger className='mr-4'>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex flex-row items-center justify-between space-x-2'>
            <Link href={`/habits/${habit.id}`} passHref>
              <DropdownMenuItem
                className={cn(
                  buttonVariants({ variant: 'ghostPrimary' }),
                  'w-full cursor-pointer text-left',
                )}
              >
                <View />
              </DropdownMenuItem>
            </Link>
            <Link href={`/habits?edit=true&id=${habit.id}`} passHref>
              <DropdownMenuItem
                className={cn(
                  buttonVariants({ variant: 'ghostPrimary' }),
                  'w-full cursor-pointer text-left',
                )}
              >
                <Edit />
                {/* Edit */}
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className={cn(
                buttonVariants({ variant: 'ghostDestructive' }),
                'w-full cursor-pointer',
              )}
            >
              <Trash />
              {/* Delete */}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className='grid gap-4'>
        <span>{_habit.notes.substring(0, 35)}...</span>
        <div className='jusitfy-end flex h-[20px] flex-row space-x-2'>
          {_habit.tags &&
            _habit.tags.map((tag) => {
              return (
                <Badge id={tag} className='bg-blue-500'>
                  {tag}
                </Badge>
              );
            })}
        </div>
      </CardContent>
      <CardFooter className='grid gap-2 p-3'>
        <div className='grid'>
          <Button onClick={() => void updateResponse()} size='sm'>
            <Plus />
            Respond
          </Button>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Progress value={(responses / _habit.goal) * 100} />
            </TooltipTrigger>
            <TooltipContent>
              ({_habit.responses} / {_habit.goal})
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
