'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';

import {
  frequencies,
  Frequency,
  FrontendHabit,
  frontendHabitSchema,
} from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Button } from '$/ui/button';
import { DaysInput } from '$/ui/days-input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '$/ui/form';
import { Input } from '$/ui/input';
import { MultiSelect } from '$/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$/ui/select';
import { Textarea } from '$/ui/textarea';

interface HabitsFormProps {
  data?: Partial<FrontendHabit>;
  tags: Array<string>;
  submitTitle: string;
}

export default function HabitsForm({
  data,
  tags,
  submitTitle,
}: HabitsFormProps) {
  const router = useRouter();
  const mutation = trpc.habits.createOrUpdate.useMutation();

  const tagOptions = tags.map((t) => ({ value: t, label: t }));

  let defaultValues: Partial<FrontendHabit>;
  if (data) {
    console.log(data);
    defaultValues = { ...data };
  } else {
    defaultValues = {
      id: '',
      frequency: Frequency[Frequency.Daily],
      goal: 1,
      selectedDays: [],
      color: 'primary',
      icon: 'none',
      tags: [],
    };
  }

  const form = useForm<FrontendHabit>({
    resolver: zodResolver(frontendHabitSchema),
    defaultValues,
  });

  const watcher = form.watch();

  const onSubmit = (data: FrontendHabit) => {
    mutation.mutate(data);
    router.replace('/habits?page=1');
    router.refresh();
    // @todo add a toast
  };

  const [_tags, setTags] = React.useState(tagOptions);

  const handleNewTag = (
    value: string,
    field: ControllerRenderProps<FrontendHabit, 'tags'>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setTags([..._tags, { value: value, label: value }]);
    field.onChange([...field.value, value]);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='m-4 grid grid-cols-1 gap-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  If I could name them, I could tame them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='icon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        </div>
        <div
          className={cn(
            'm-4 grid grid-cols-1 gap-4',
            watcher.frequency === Frequency[Frequency.Daily]
              ? 'lg:grid-cols-3'
              : 'lg:grid-cols-2',
          )}
        >
          <FormField
            control={form.control}
            name='frequency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select how often you want to track this habit.' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {frequencies().map((freq) => {
                      return (
                        <SelectItem id={`${freq}`} value={Frequency[freq]}>
                          {Frequency[freq]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormDescription>How often</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {watcher.frequency === Frequency[Frequency.Daily] ? (
            <FormField
              control={form.control}
              name='selectedDays'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days</FormLabel>
                  <DaysInput {...field} selected={field.value || []} />
                  <FormDescription>On what days.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {watcher.frequency ? (
            <FormField
              control={form.control}
              name='goal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' />
                  </FormControl>
                  <FormDescription>
                    How many times per{' '}
                    {watcher.frequency === Frequency[Frequency.Daily]
                      ? 'day'
                      : 'week'}
                    .
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
        <div className='m-4 grid grid-cols-1 gap-8'></div>
        <div className='m-4 grid grid-cols-1 gap-8'>
          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <MultiSelect
                  selected={field.value || []}
                  options={_tags}
                  onEmpty={(value, setOpen) => (
                    <Button onClick={() => handleNewTag(value, field, setOpen)}>
                      Create Tag: {value}
                    </Button>
                  )}
                  {...field}
                  className='sm:w-[510px]'
                />
                {/* <FormDescription>Categorize and classify.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription>
                  Any additional info you want to add.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='mt-10'>
          <div className='flex flex-row justify-end'>
            <Button type='submit'>{submitTitle}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
