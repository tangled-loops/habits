'use client';

import { useRouter, redirect } from 'next/navigation';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { Form } from '.';
import { useState } from 'react';
import { FormDialog } from './form';

export default function HabitsHeader({ handleSubmit }: { handleSubmit: () => void }) {
  return (
    <div className='bg-card w-full grid grid-cols-2 p-4 rounded shadow'>
      <h1 className='flex flex-row items-center'>Habit Tracker</h1>
      <div className='flex flex-row items-center justify-end'>
        <FormDialog 
          title='New Habit' 
          desc='Create a Habit to Track'
          trigger={<PlusCircle />}
          handleSubmit={handleSubmit}
          submitTitle='Create'
        />
      </div>
    </div>
  );
}
