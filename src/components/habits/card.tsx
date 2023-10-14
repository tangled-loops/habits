'use client';

import { Edit, MoreHorizontal, Plus, Trash, View } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import { Day, days } from '../../lib/models/habit';
import { Progress } from '../ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { HabitEdit } from './action-dialogs';
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
        <TooltipTrigger>
          <Progress value={(responses / habit.goal) * 100} />
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
    <div className='jusitfy-end flex h-[20px] flex-row space-x-2'>
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
    <div className='grid grid-cols-2'>
      <Button onClick={onRespond} size='sm'>
        <Plus className='mr-2' />
        Respond
      </Button>
      <div className='flex flex-row justify-end'>
        <Link href={`/habits/${habit.id}`} passHref>
          <Button
            variant='ghostPrimary'
            className='w-full cursor-pointer text-left'
          >
            <View />
          </Button>
        </Link>
        <Link href={`/habits?edit=true&id=${habit.id}`} passHref>
          <Button
            variant='ghostPrimary'
            className='w-full cursor-pointer text-left'
          >
            <Edit />
            {/* Edit */}
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

// @todo move this out of the body of this function
function content(
  habit: FrontendHabit,
  editing: Field,
  field: Field,
  handleSubmit: () => void,
) {}

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
    await mutateAsync({ habitId: _habit.id || 'fuck' });
    setResponses(responses + 1);
  };

  return (
    <>
      <HabitEdit habit={_habit} handleSubmit={delayedQuery} />
      <Card className='-p-4'>
        <div className='flex flex-row items-center'>
          <CardHeader className='grow p-4'>
            <EditableTitle
              editing={editing}
              setEditing={setEditing}
              handleSubmit={handleSubmit}
              habit={habit}
            />
          </CardHeader>
          <Days habit={_habit} />
        </div>
        <CardContent className='grid gap-4'>
          <Notes habit={_habit} />
          <Tags habit={_habit} />
        </CardContent>
        <CardFooter className='grid gap-2 p-3'>
          <Actions habit={_habit} onRespond={updateResponse} />
          <ProgressDisplay habit={habit} responses={responses} />
        </CardFooter>
      </Card>
    </>
  );
}
