'use client'

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function HabitsHeader() {
  const router = useRouter()
  return (
    <div className='bg-card w-full grid grid-cols-2 p-4 rounded shadow'>
      <h1 className='flex flex-row items-center'>Habit Tracker</h1>
      <div className='flex flex-row items-center justify-end'>
        <Button variant='default' className='' onClick={() => router.push('/habits/new')}>
          New Habit
        </Button>
      </div>
    </div>
  )
}