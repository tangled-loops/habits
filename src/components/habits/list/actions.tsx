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
            'mb-1 h-[30px] w-[60%] text-primary-foreground',
            colors.background,
            colors.hover,
          )}
        >
          <div className='flex flex-row items-center text-sm'>
            <Plus className='mr-2' />
            Respond
          </div>
        </div>
        <div className='flex flex-row justify-end'>
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
      <div className='flex flex-row justify-end'>
        <Button
          variant='ghost'
          className='w-full cursor-pointer text-left'
          onClick={onArchive}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Archive
                  className={cn(
                    habit.archived ? 'text-primary' : 'text-destructive',
                  )}
                />
                <span className='sr-only'>Archive</span>
              </TooltipTrigger>
              <TooltipContent className='text-white'>
                {habit.archived ? 'Unarchive' : 'Archive'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Button>
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

export { Actions };
