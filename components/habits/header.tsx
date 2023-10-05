'use client';

import { PlusCircle } from 'lucide-react';
import { FormDialog } from './form';

export default function HabitsHeader({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className='bg-card w-full grid grid-cols-2 p-4 rounded shadow'>
      <h1 className='flex flex-row items-center'>Habit Tracker</h1>
      <div className='flex flex-row items-center justify-end'>
        <FormDialog 
          title='New Habit' 
          desc='Create a Habit to Track'
          trigger={<PlusCircle />}
          handleSubmit={onSubmit}
          submitTitle='Create'
        />
      </div>
    </div>
  );
}
