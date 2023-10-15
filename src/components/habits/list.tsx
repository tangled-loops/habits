'use client';

import {
  Archive,
  Edit,
  LucideStickyNote,
  Plus,
  Search,
  Tag,
  View,
} from 'lucide-react';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';

import { HabitEdit } from './action-dialogs';
import { EditField, Field } from './edit-field';
import { icon } from './icon';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  backgroundColor,
  Color,
  Day,
  days,
  FrontendHabit,
  Icon,
  textColor,
} from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '$/ui/accordion';
import { Badge } from '$/ui/badge';
import { Progress } from '$/ui/progress';
import { Separator } from '$/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '$/ui/tooltip';

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
        <TooltipTrigger className='p-2'>
          <Badge
            variant='secondary'
            className={cn(
              backgroundColor(habit.color as Color),
              backgroundColor(habit.color as Color, false, true),
              'mr-4 text-center text-background',
            )}
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

function Tags({ habit, className }: HasHabit & { className?: string }) {
  return (
    <div
      className={cn(
        'h-[40px]',
        'mb-2 flex-1 flex-row items-center space-x-2 space-y-2 pb-4',
        className,
      )}
    >
      {habit.tags &&
        habit.tags.map((tag) => {
          return (
            <Badge
              id={tag}
              className={cn(backgroundColor(habit.color as Color))}
            >
              {tag}
            </Badge>
          );
        })}
    </div>
  );
}

const TagsAccordianItem = ({ habit }: HasHabit) => {
  if (habit.tags.length === 0) return null;
  return (
    <AccordionItem value='item-1'>
      {habit.tags.length > 3 ? (
        <>
          <AccordionTrigger>
            <div className='flex flex-row items-center'>
              <Tag className={cn('mr-2', textColor(habit.color as Color))} />
              Tags ({habit.tags.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Tags habit={habit} />
          </AccordionContent>
        </>
      ) : (
        <div className='flex flex-col justify-center py-4'>
          <div className='flex flex-row items-center'>
            <Tag className={cn('mr-2', textColor(habit.color as Color))} />
            Tags
            <Tags habit={habit} className='-mb-4 ml-6 space-y-0' />
          </div>
        </div>
      )}
    </AccordionItem>
  );
};

interface ActionsProps extends HasHabit {
  onRespond: () => void;
}

function Actions({ habit, onRespond }: ActionsProps) {
  return (
    <div className='-mb-2 grid grid-cols-2'>
      <Button
        onClick={onRespond}
        size='sm'
        className={cn(backgroundColor(habit.color as Color), 'w-[60%]')}
      >
        <Plus className='mr-2' />
        Respond
      </Button>
      <div className='flex flex-row justify-end'>
        <Link href={`/habits?archive=true&id=${habit.id}`} passHref>
          <Button variant='ghost' className='w-full cursor-pointer text-left'>
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
            variant='ghost'
            className={cn('w-full cursor-pointer text-left')}
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
            variant='ghost'
            className={cn('w-full cursor-pointer text-left')}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <View />
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
  return <span>{habit.notes}</span>;
}

const NotesAccordianItem = ({ habit }: HasHabit) => {
  if (habit.notes.length === 0) return null;
  return (
    <AccordionItem value='item-2'>
      <AccordionTrigger>
        <div className='jusity-start flex flex-row items-center space-x-8'>
          <LucideStickyNote
            className={cn('mr-2', textColor(habit.color as Color))}
          />
          Notes{' '}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Notes habit={habit} />
      </AccordionContent>
    </AccordionItem>
  );
};

interface TitleProps extends HasHabit {
  editing: Field;
  setEditing: Dispatch<SetStateAction<Field>>;
  handleSubmit: () => void;
}

function Title({ habit, editing, setEditing, handleSubmit }: TitleProps) {
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

function HabitCard({ habit }: HasHabit) {
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

  const updateResponse = async () => {
    await mutateAsync({ habitId: _habit.id! });
    setResponses(responses + 1);
  };

  return (
    <>
      <HabitEdit habit={_habit} handleSubmit={handleSubmit} />
      <Card className='p-2'>
        <div className='flex flex-row items-center'>
          {_habit.icon.length > 0 &&
            icon(_habit.icon as Icon, _habit.color as Color)}
          <CardHeader className='grow p-4'>
            <Title
              editing={editing}
              setEditing={setEditing}
              handleSubmit={handleSubmit}
              habit={_habit}
            />
            <Separator className={backgroundColor(_habit.color as Color)} />
          </CardHeader>
          <Days habit={_habit} />
        </div>
        <CardContent className='mb-2 p-4 pt-0'>
          <Accordion type='single' collapsible>
            <NotesAccordianItem habit={_habit} />
            <TagsAccordianItem habit={_habit} />
            {/* @todo make notes editable */}
            {/* @todo basic info tab */}
            {/* @todo add some sort of responses tab to show the number of responses per day*/}
          </Accordion>
        </CardContent>
        <CardFooter className='mb-0 grid gap-2 p-3'>
          <Actions habit={_habit} onRespond={updateResponse} />
          <ProgressDisplay habit={_habit} responses={responses} />
        </CardFooter>
      </Card>
    </>
  );
}

function HabitsList({ habits }: { habits: Array<FrontendHabit> }) {
  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {habits.map((habit) => {
          return (
            <>
              <div>
                <HabitCard key={habit.id} habit={habit} />
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export { HabitsList };
