'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem, FormLabel } from '$ui/form';
import { Button } from '$ui/button';
import { Input } from '$ui/input';
import { Textarea } from '$ui/textarea';
import { trpc } from '@/lib/trpc';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '$ui/dialog';
import { ReactNode, useState } from 'react';

interface FormDialogProps {
  title: ReactNode;
  desc: ReactNode;
  trigger: ReactNode;
  data?: {
    id: string;
    title: string;
    description: string;
  };
  handleSubmit: () => void;
  submitTitle: string;
}

export function FormDialog({
  data,
  title,
  desc,
  trigger,
  submitTitle,
  handleSubmit,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);
  const submitWrapper = () => {
    setOpen(false);
    handleSubmit();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <HabitsForm
          data={data}
          submitTitle={submitTitle}
          handleSubmit={submitWrapper}
        />
      </DialogContent>
    </Dialog>
  );
}

const habitsFormSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
});

type HabitsFormValues = z.infer<typeof habitsFormSchema>;

export default function HabitsForm({
  data,
  submitTitle,
  handleSubmit,
}: {
  data?: {
    id?: string;
    title?: string;
    description?: string;
  };
  submitTitle: string;
  handleSubmit: () => void;
}) {
  const mutation = trpc.habits.createOrUpdate.useMutation();

  let defaultValues: Partial<HabitsFormValues>;
  if (data) {
    defaultValues = { ...data };
  } else {
    defaultValues = {
      id: '',
      title: '',
      description: '',
    };
  }

  const form = useForm<HabitsFormValues>({
    resolver: zodResolver(habitsFormSchema),
    defaultValues,
  });

  function onSubmit(data: HabitsFormValues) {
    mutation.mutate(data);
    // Need to wait a bit so when we refresh the data it is in fact fresh
    setTimeout(() => handleSubmit(), 250);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} className='w-[400px]' />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <div className='relative w-max'>
                <FormControl>
                  <Textarea {...field} className='w-[400px]' />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        <div className='flex flex-row justify-start'>
          <Button type='submit'>{submitTitle}</Button>
        </div>
      </form>
    </Form>
  );
}
