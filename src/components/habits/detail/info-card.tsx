import { ResponseCount } from './response-card';
import { HasHabitAndTRPC } from './types';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DaysField } from '@/components/ui/days-input';
import { Separator } from '@/components/ui/separator';
import { backgroundColor, Color } from '@/lib/models/habit';
import { cn } from '@/lib/utils';

function InfoCard({ habit, count }: HasHabitAndTRPC) {
  return (
    <Card>
      <CardHeader className='grow p-6'>
        <CardTitle className='font-semibold'>General Info</CardTitle>
      </CardHeader>
      <Separator className='my-2' />
      <CardContent>
        <div className='mt-4 grid'>
          <div className='flex flex-row justify-around'>
            <div className='grid'>
              <span className='font-semibold'>Goal</span>
              <span className='text-center'>{habit.goal}</span>
            </div>
            <div className='grid gap-4'>
              {habit.frequency === 'Weekly' ? <span></span> : null}
              <span className='flex w-full flex-row items-center justify-center text-center'>
                <span>{habit.frequency}</span>
              </span>
              {habit.frequency === 'Daily' ? (
                <DaysField selected={habit.selectedDays ?? []} />
              ) : null}
            </div>
            <ResponseCount initial={count.data ?? 0} count={count} />
          </div>
        </div>
        <Separator className='my-2' />
        <div className='mt-4 grid'>
          <span className='font-semibold'>Tags</span>
          <span>
            {habit.tags.length > 0 ? (
              habit.tags.map((tag) => {
                return (
                  <Badge
                    className={cn(
                      backgroundColor(habit.color as Color),
                      backgroundColor(habit.color as Color, false, true),
                      'm-1 text-white',
                    )}
                  >
                    {tag}
                  </Badge>
                );
              })
            ) : (
              <div className='text-center'>
                None Added - (create button here?)
              </div>
            )}
          </span>
        </div>
        <Separator className='my-2' />
        <div className='space-4 mt-4 grid grid-cols-1'>
          <span className='font-semibold'>Notes</span>
          <span className='m-1'>{habit.notes}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export { InfoCard };
