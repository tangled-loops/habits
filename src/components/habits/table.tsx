'use client';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '$ui/table';
import { Habit } from '~db/schema';
import { useState } from 'react';
import z from 'zod';
import { trpc } from '@/lib/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '$ui/form';
import { Input } from '$ui/input';

export type Field = 'none' | 'description' | 'title';

interface HabitsTableProps {
  habits: Habit[];
  handleSubmit: () => void;
}

const editFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
});

export type EditFieldFormValues = z.infer<typeof editFieldSchema>;

export interface EditFieldProps {
  id: string;
  value: string | null;
  field: string;
  handleSubmit: () => void;
}

export function EditField({ id, field, value, handleSubmit }: EditFieldProps) {
  const mutation = trpc.habits.updateField.useMutation();
  const defaultValues = { id, type: field };

  const form = useForm<EditFieldFormValues>({
    resolver: zodResolver(editFieldSchema),
    defaultValues,
  });

  function onSubmit(data: EditFieldFormValues) {
    if (data.title || data.description) mutation.mutate(data);
    // Need to wait a bit so when we refresh the data it is in fact fresh
    setTimeout(() => handleSubmit(), 250);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name={field as keyof EditFieldFormValues}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  className='w-[100%]'
                  defaultValue={String(value)}
                  // here what I should do is just unset editing?
                  onBlur={() => onSubmit(defaultValues)}
                  onKeyDown={(event) => {
                    if (event.code === 'Enter') {
                      form.handleSubmit(onSubmit);
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default function HabitsTable({
  habits,
  handleSubmit,
}: HabitsTableProps) {
  const [editing, setEditing] = useState<Field>('none');
  const onSubmit = () => {
    handleSubmit();
    setEditing('none');
  };
  const content = (habit: Habit, field: Field) => {
    const editField = (value: string | null) => {
      return (
        <EditField
          id={habit.id}
          field={field}
          handleSubmit={onSubmit}
          value={value}
        />
      );
    };
    const fieldEditing = field === editing;
    switch (field) {
      case 'description': {
        if (fieldEditing) return editField(habit.description);
        return habit.description;
      }
      case 'title': {
        if (fieldEditing) return editField(habit.title);
        return habit.title;
      }
      default: {
        return '';
      }
    }
  };

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
        {habits &&
          habits.map((habit) => {
            return (
              <TableRow key={habit.id}>
                <TableCell
                  className='font-medium'
                  onClick={() => setEditing('title')}
                >
                  {content(habit, 'title')}
                </TableCell>
                <TableCell onClick={() => setEditing('description')}>
                  {content(habit, 'description')}
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
