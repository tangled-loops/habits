import { HasHabit } from './types';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  abbrev,
  backgroundColor,
  Color,
  Day,
  dayNames,
} from '@/lib/models/habit';
import { cn } from '@/lib/utils';

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
                {dayNames().map((day, i) => {
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

export { Days };
