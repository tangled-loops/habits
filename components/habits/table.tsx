'use client';

import { trpc } from '@/lib/trpc';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

export default function HabitsTable() {
  const allHabits = trpc.habits.findAll.useQuery();
  console.log(allHabits.data);
  return (
    <Table>
      <TableCaption>Tracking Habits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className='w-[200px]'>Title</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allHabits.data && allHabits.data.map((habit) => {
          return (
            <TableRow key={habit.id}>
              <TableCell className='font-medium'>{habit.title}</TableCell>
              <TableCell>{habit.description}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  );
}
