'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { trpc } from '@/lib/trpc';

import { Form, FormControl, FormField, FormItem } from '$/ui/form';
import { Input } from '$/ui/input';

const fields = ['none', 'notes', 'name'] as const;
export type Field = (typeof fields)[number];

const editFieldSchema = z.object({
  id: z.string(),
  field: z.enum(fields),
  value: z.string(),
});

export type EditFieldFormValues = z.infer<typeof editFieldSchema>;

export interface EditFieldProps {
  id: string;
  value: string;
  field: Field;
  handleSubmit: () => void;
}

// @todo could generalize this by passing the schema in or something although
//  the mutation makes it a packaged unit maybe not worth generalizing.
export function EditField({ id, field, value, handleSubmit }: EditFieldProps) {
  const mutation = trpc.habits.updateField.useMutation();
  const defaultValues = { id, field, value };

  const form = useForm<EditFieldFormValues>({
    resolver: zodResolver(editFieldSchema),
    defaultValues,
  });

  function onSubmit(data: EditFieldFormValues) {
    if (data.value) mutation.mutate(data);
    // Need to wait a bit so when we refresh the data it is in fact fresh
    setTimeout(() => handleSubmit(), 250);
  }

  return (
    <Form {...form}>
      <form className='space-y-8'>
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
