'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Habit } from '@/server/db/schema';
import { Edit } from 'lucide-react';
import { FormDialog } from './form';

export default function HabitsTable({ habits, handleSubmit }: { habits?: Habit[], handleSubmit: () => void }) {
  return (
    <Table>
      <TableCaption>Tracking Habits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[200px]'>Title</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className='w-[100px]'>zoop</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {habits && habits.map((habit) => {
          return (
            <TableRow key={habit.id}>
              <TableCell className='font-medium'>{habit.title}</TableCell>
              <TableCell>{habit.description}</TableCell>
              <TableCell>
                <FormDialog 
                  data={{ id: habit.id, title: habit.title, description: habit.description || '' }}
                  title='Edit Habit' 
                  desc='Edit the Habit'
                  trigger={<Edit />}
                  handleSubmit={handleSubmit}
                  submitTitle='Save'
                />
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
