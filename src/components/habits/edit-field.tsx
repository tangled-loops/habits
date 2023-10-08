'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { trpc } from '@/lib/trpc';

import { Form, FormControl, FormField, FormItem } from '$/ui/form';
import { Input } from '$/ui/input';

export type Field = 'none' | 'notes' | 'name';

const editFieldSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string().optional(),
  notes: z.string().optional(),
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
    if (data.name || data.notes) mutation.mutate(data);
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
