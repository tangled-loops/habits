'use client';

import { HabitCard } from './card';

import { FrontendHabit } from '@/lib/models/habit';

function HabitsList({ habits }: { habits: Array<FrontendHabit> }) {
  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {habits.map((habit) => {
          return (
            <div key={habit.id}>
              <HabitCard habit={habit} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export { HabitsList };
