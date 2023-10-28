import { Archive, Edit, Plus, View } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { HasColors, HasHabit } from './types';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDelayRender } from '@/lib/hooks/use-delay-render';
import { cn } from '@/lib/utils';

interface ActionsProps extends HasHabit {
  onRespond: () => void;
  onArchive: () => void;
}

function Actions({
  habit,
  onRespond,
  onArchive,
  colors,
}: ActionsProps & HasColors) {
  const { active } = useDelayRender();

  if (!active) {
    return (
      <div className='-mb-2 grid grid-cols-2'>
        <div
          className={cn(
            buttonVariants({ variant: 'default' }),
            'mb-1 h-[30px] w-[60%] text-white',
            colors.background,
            colors.hover,
          )}
        >
          <div className='flex flex-row items-center p-4 text-sm'>
            <Plus className='mr-2' />
            Respond
          </div>
        </div>
        <div className='flex flex-row items-center justify-end'>
          <div className={cn(buttonVariants({ variant: 'ghost' }))}>
            <Archive
              className={cn(
                habit.archived ? 'text-primary' : 'text-destructive',
              )}
            />
            <span className='sr-only'>Archive</span>
          </div>
          <div className={cn(buttonVariants({ variant: 'ghost' }))}>
            <Edit />
            <span className='sr-only'>Edit</span>
          </div>
          <div className={cn(buttonVariants({ variant: 'ghost' }))}>
            <View />
            <span className='sr-only'>View Details</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='-mb-2 grid grid-cols-2'>
      <Button
        onClick={onRespond}
        size='sm'
        className={cn(colors.background, colors.hover, 'w-[60%] text-white')}
      >
        <Plus className='mr-2' />
        Respond
      </Button>
      <div className='flex flex-row items-center justify-end'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'cursor-pointer text-left',
                )}
                onClick={onArchive}
              >
                <Archive
                  className={cn(
                    habit.archived ? 'text-primary' : 'text-destructive',
                  )}
                />
                <span className='sr-only'>Archive</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className='text-white'>
              {habit.archived ? 'Unarchive' : 'Archive'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Link href={`/habits?edit=true&id=${habit.id}`} passHref>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full cursor-pointer text-left',
                  )}
                >
                  <Edit />
                  <span className='sr-only'>Edit</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
        <Link href={`/habits/${habit.id}`} passHref>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'w-full cursor-pointer text-left',
                  )}
                >
                  <View />
                  <span className='sr-only'>View Details</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Link>
      </div>
    </div>
  );
}

export { Actions };
