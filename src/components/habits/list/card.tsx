import { Info } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import { HabitEdit } from '../action-dialogs';
import { EditField, Field } from '../edit-field';
import { icon } from '../icon';
import { Actions } from './actions';
import { NotesAccordianItem } from './notes';
import { TagsAccordianItem } from './tags';
import { HasColors, HasHabit } from './types';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import {
  abbrev,
  backgroundColor,
  Color,
  colorCss,
  Day,
  days,
  FrontendHabit,
  Icon,
} from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Badge } from '$/ui/badge';

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
          ({responses} / {habit.goal})
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
              'mr-4 text-center text-white',
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
                  if (habit.selectedDays?.includes(sday)) {
                    return (
                      <Badge
                        key={i}
                        variant='secondary'
                        className='bg-primary text-center text-white hover:bg-primary/50'
                      >
                        {abbrev(sday)}
                      </Badge>
                    );
                  }
                  return (
                    <Badge
                      key={i}
                      variant='outline'
                      className='text-center text-accent'
                    >
                      {abbrev(sday)}
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

const InfoAccordianItem = ({ habit, colors }: HasHabit & HasColors) => {
  return (
    <AccordionItem value='item-0'>
      <AccordionTrigger>
        <div className='jusity-start flex flex-row items-center space-x-8'>
          <Info className={cn('mr-2', colors.text)} /> Info{' '}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className='grid grid-flow-col'>
          <div className='grid grid-cols-1 gap-2'>
            <span className='font-semibold'>Total</span>
            <span className=''>{habit.totalResponses}</span>
          </div>
          <div className='grid grid-cols-1 gap-4'>
            <span className='font-semibold'>In Window</span>
            <span className=''>{habit.responses}</span>
          </div>
          <div className='grid grid-cols-1 gap-4'>
            <span className='font-semibold'>Goal</span>
            <span className=''>{habit.goal}</span>
          </div>
          <div className='grid grid-cols-1 gap-4'>
            <span className='font-semibold'>Tracked</span>
            <span className=''>{habit.frequency}</span>
          </div>
        </div>
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
  const router = useRouter();
  const { toast } = useToast();
  const params = useSearchParams();

  const { data, refetch } = trpc.habits.findById.useQuery(
    { id: habit.id || '' },
    { enabled: false },
  );

  const add = trpc.responses.add.useMutation();
  const archive = trpc.habits.archive.useMutation();
  const unarchive = trpc.habits.unarchive.useMutation();

  const [_habit, setHabit] = useState<FrontendHabit>(data ?? habit);
  const [editing, setEditing] = useState<Field>('none');
  const [responses, setResponses] = useState(habit.responses ?? 0);

  const colors = colorCss(habit.color as Color);

  const handleSubmit = async () => {
    const { data } = await refetch();
    if (data) setHabit(data);
    setEditing('none');
  };

  const updateResponse = async () => {
    await add.mutateAsync({ habitId: _habit.id! });
    setResponses(responses + 1);
    if (
      responses + 1 >= habit.goal &&
      (!!params.get('filter') || !!params.get('sort'))
    )
      router.refresh();
  };

  const handleArchive = async () => {
    const isArchived = _habit.archived;
    if (isArchived) {
      await unarchive.mutateAsync({ id: _habit.id! });
    } else {
      await archive.mutateAsync({ id: _habit.id! });
    }

    router.refresh();

    const title = isArchived
      ? `${_habit.name} is no longer archive`
      : `Archived ${_habit.name}`;
    const variant = isArchived ? 'success' : 'destructive';
    toast({ title, variant });
  };

  const editingEnabled =
    !!params.get('id') &&
    !!params.get('edit') &&
    params.get('id') === _habit.id!;
  return (
    <>
      <HabitEdit
        habit={_habit}
        open={editingEnabled}
        handleSubmit={handleSubmit}
      />
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
            <Separator className={cn(colors.background)} />
          </CardHeader>
          <Days habit={_habit} />
        </div>
        <CardContent className='mb-2 p-4 pt-0'>
          <Accordion type='single' collapsible>
            <InfoAccordianItem habit={_habit} colors={colors} />
            <NotesAccordianItem habit={_habit} colors={colors} />
            <TagsAccordianItem habit={_habit} colors={colors} />
            {/* @todo make notes editable */}
            {/* @todo basic info tab */}
            {/* @todo add some sort of responses tab to show the number of responses per day*/}
          </Accordion>
        </CardContent>
        <CardFooter className='mb-0 grid gap-2 p-3'>
          <Actions
            habit={_habit}
            colors={colors}
            onRespond={updateResponse}
            onArchive={handleArchive}
          />
          <ProgressDisplay habit={_habit} responses={responses} />
        </CardFooter>
      </Card>
    </>
  );
}

export { HabitCard };
