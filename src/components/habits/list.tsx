'use client';

import React, { ReactNode, useEffect } from 'react';
import { GridLoader } from 'react-spinners';

import { HabitCard } from './card';

import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';

export function HabitsList({ habits }: { habits: Array<FrontendHabit> }) {
  return (
    <>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {habits.map((habit) => {
          return <HabitCard key={habit.id} habit={habit} />;
        })}
      </div>
    </>
  );
}
