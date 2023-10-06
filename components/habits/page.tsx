'use client';

import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";
import { Habit } from "@/server/db/schema";

import HabitsHeader from "./header";
import HabitsList, { HabitCard } from "./card";
import { FormDialog } from "./form";
import { PlusCircle } from "lucide-react";

interface HabitsPageProps {
  habits: Array<Habit>;
}

export default function HabitsPage({ habits }: HabitsPageProps) {
  const query = trpc.habits.findAll.useQuery()
  
  const [_habits, setHabits] = useState<Array<Habit>>(habits);

  async function handleSubmit() {
    const newData = await query.refetch()

    if (newData.isFetched && newData.data) {
      setHabits(newData.data)
    }
  }

  return (
    <>
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
      <div className='grid p-4'>
        <div className="grid grid-cols-2 gap-4">
          {_habits.map((habit) => {
            return <HabitCard habit={habit} onSubmit={handleSubmit} />
          })}
        </div>
      </div>
    </>
  );
}
