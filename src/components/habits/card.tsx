'use client';

import {
  Archive,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  View,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import {
  backgroundColor,
  Color,
  Day,
  days,
  Icon,
} from '../../lib/models/habit';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { HabitEdit } from './action-dialogs';
import { EditField, Field } from './edit-field';
import { icon } from './icon';

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

interface HasHabit {
  habit: FrontendHabit;
}

interface ProgressDisplayProps extends HasHabit {
  responses: number;
}

function ProgressDisplay({ habit, responses }: ProgressDisplayProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='-mb-4'>
          <Progress
            value={(responses / habit.goal) * 100}
            className={backgroundColor(habit.color as Color, true)}
            indicatorClassName={backgroundColor(habit.color as Color)}
          />
        </TooltipTrigger>
        <TooltipContent>
          ({habit.responses} / {habit.goal})
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Days({ habit }: HasHabit) {
  return (
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
          {habit.frequency === 'Daily' ? (
            <>
              <div className='grid grid-cols-7 gap-0.5'>
                {days().map((day, i) => {
                  const sday = Day[day];
                  const sliceTo = i === (Day.Thursday || Day.Sunday) ? 2 : 1;
                  if (habit.selectedDays?.includes(sday)) {
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
  );
}

function Tags({ habit }: HasHabit) {
  return (
    <div
      className={cn(
        'h-[40px]',
        'flex-1 flex-row items-center space-x-2 space-y-2 pb-4',
      )}
    >
      {habit.tags &&
        habit.tags.map((tag) => {
          return (
            <Badge id={tag} className='bg-blue-500'>
              {tag}
            </Badge>
          );
        })}
    </div>
  );
}

interface ActionsProps extends HasHabit {
  onRespond: () => void;
}

function Actions({ habit, onRespond }: ActionsProps) {
  return (
    <div className='-mb-2 grid grid-cols-2'>
      <Button onClick={onRespond} size='sm' className='w-[60%]'>
        <Plus className='mr-2' />
        Respond
      </Button>
      <div className='flex flex-row justify-end'>
        <Link href={`/habits?archive=true&id=${habit.id}`} passHref>
          <Button
            variant='ghostPrimary'
            className='w-full cursor-pointer text-left'
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Archive className='text-destructive' />
                  <span className='sr-only'>Archive</span>
                </TooltipTrigger>
                <TooltipContent>Archive</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </Link>
        <Link href={`/habits?edit=true&id=${habit.id}`} passHref>
          <Button
            variant='ghostPrimary'
            className='w-full cursor-pointer text-left'
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Edit />
                  <span className='sr-only'>Edit</span>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </Link>
        <Link href={`/habits/${habit.id}`} passHref>
          <Button
            variant='ghostPrimary'
            className='w-full cursor-pointer text-left'
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Search />
                  <span className='sr-only'>View Details</span>
                </TooltipTrigger>
                <TooltipContent>View Details</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Notes({ habit }: HasHabit) {
  return <span>{habit.notes.substring(0, 100)}...</span>;
}

interface EditableTitleProps extends HasHabit {
  editing: Field;
  setEditing: Dispatch<SetStateAction<Field>>;
  handleSubmit: () => void;
}

function EditableTitle({
  habit,
  editing,
  setEditing,
  handleSubmit,
}: EditableTitleProps) {
  const content = () => {
    const editField = (value: string | null) => {
      return (
        <EditField
          id={habit.id || ''}
          field={'name'}
          value={value}
          handleSubmit={handleSubmit}
        />
      );
    };
    const fieldEditing = 'name' === editing;
    if (fieldEditing) return editField(habit.name || '');
    return habit.name;
  };
  return (
    <CardTitle className='font-2xl' onClick={() => setEditing('name')}>
      {content()}
    </CardTitle>
  );
}

export function HabitCard({ habit }: HasHabit) {
  const { data, refetch } = trpc.habits.findById.useQuery(
    { id: habit.id || '' },
    { enabled: false },
  );

  const { mutateAsync } = trpc.responses.add.useMutation();

  const [_habit, setHabit] = useState<FrontendHabit>(data ?? habit);
  const [editing, setEditing] = useState<Field>('none');
  const [responses, setResponses] = useState(habit.responses ?? 0);

  const handleSubmit = async () => {
    const { data } = await refetch();
    if (data) setHabit(data);
    setEditing('none');
  };

  const delayedQuery = () => {
    setTimeout(async () => {
      const { data } = await refetch();
      if (data) setHabit(data);
    }, 250);
  };

  const updateResponse = async () => {
    await mutateAsync({ habitId: _habit.id! });
    setResponses(responses + 1);
  };

  return (
    <>
      <HabitEdit habit={_habit} handleSubmit={delayedQuery} />
      <Card className='p-2'>
        <div className='flex flex-row items-center'>
          <CardHeader className='grow p-4'>
            <EditableTitle
              editing={editing}
              setEditing={setEditing}
              handleSubmit={handleSubmit}
              habit={_habit}
            />
            <Separator className={backgroundColor(_habit.color as Color)} />
          </CardHeader>
          <Days habit={_habit} />
          {_habit.icon.length > 0 &&
            icon(_habit.icon as Icon, _habit.color as Color)}
        </div>
        <CardContent className='mb-2 p-4 pt-0'>
          <Tags habit={_habit} />
        </CardContent>
        <CardFooter className='mb-0 grid gap-2 p-3'>
          <Actions habit={_habit} onRespond={updateResponse} />
          <ProgressDisplay habit={_habit} responses={responses} />
        </CardFooter>
      </Card>
    </>
  );
}
