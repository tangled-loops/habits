'use client';

import { useEffect, useState } from "react";

import { trpc } from "@/lib/trpc";
import { Habit } from "@/server/db/schema";

import HabitsHeader from "./header";
import HabitsList from "./list";

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
      <HabitsHeader onSubmit={handleSubmit} />
      <div className='grid p-4'>
        <HabitsList habits={_habits} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
