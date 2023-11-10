'use client';

import { ChevronRight, Loader } from 'lucide-react';
import Link from 'next/link';

import { FrontendHabit } from '../../lib/models/habit';
import { Days } from '../habits/list/days';

import { useDelayRender } from '@/lib/hooks/use-delay-render';

import { ScrollArea } from '$/ui/scroll-area';

export function HabitList({ habits }: { habits: FrontendHabit[] }) {
  const { active } = useDelayRender();
  if (!active)
    return (
      <div className='flex flex-col items-center justify-center'>
        <Loader className='animate-spin' />
      </div>
    );
  return (
    <ScrollArea className='-m-2 h-[125px] border-separate flex-col justify-center border border-primary/50 p-0'>
      {habits.length > 0 ? (
        <ul className=''>
          {active &&
            habits.map((habit) => {
              return (
                <li className='cursor-pointer border border-t-0 p-2 hover:bg-secondary hover:shadow'>
                  <Link href={`/habits/${habit.id}`} passHref>
                    <button className='flex w-full flex-row items-center justify-between'>
                      <p>{habit.name}</p>
                      <span className='flex flex-row items-center'>
                        <Days habit={habit} />
                        <ChevronRight />
                      </span>
                    </button>
                  </Link>
                </li>
              );
            })}
        </ul>
      ) : (
        <p className='p-6'>There{"'"}s nothing here, track some habits.</p>
      )}
    </ScrollArea>
  );
}
