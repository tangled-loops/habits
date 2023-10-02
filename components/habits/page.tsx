'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { PlusCircle } from 'lucide-react';
import { trpc } from "@/lib/trpc";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import z from "zod";
import { Table } from ".";
import HabitsHeader from "./header";
import { Habit } from "@/server/db/schema";

export default function HabitsPage() {
  const query = trpc.habits.findAll.useQuery()
  
  const [habits, setHabits] = useState<Habit[] | undefined>([]);

  async function handleSubmit() {
    const newData = await query.refetch()
    if (newData.isFetched && newData.data) {
      setHabits(newData.data)
    }
  }
  
  useEffect(() => {
    // not sure why I have to set it twice
    setHabits(query.data)
  })

  return (
    <>
      <HabitsHeader handleSubmit={handleSubmit} />
      <div className='grid p-4'>
        <Table habits={habits} handleSubmit={handleSubmit} />
      </div>
    </>
  );
}
