'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '../ui/button';
import { DaysInput } from '../ui/days-input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

const FormDataSchema = z.object({
  defaultDays: z.array(z.string()),
  defaultColor: z.string(),
  journalResponseRequired: z.number(),
  hideSidebarByDefault: z.number(),
});

type FormData = z.infer<typeof FormDataSchema>;

export default function SettingsForm() {
  const form = useForm<FormData>({
    defaultValues: {
      defaultDays: [],
      defaultColor: 'green',
      journalResponseRequired: 0,
      hideSidebarByDefault: 0,
    },
    resolver: zodResolver(FormDataSchema),
  });

  function onSubmit(data: FormData) {
    console.log(data);
  }

  return (
    <div className='container mt-10'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mx-2 grid gap-8'
        >
          <FormField
            control={form.control}
            name='defaultDays'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='grid gap-4'>
                    <FormLabel className='whitespace-nowrap font-semibold'>
                      Default Habit Color
                    </FormLabel>
                    <DaysInput
                      selected={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='defaultColor'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='grid gap-4'>
                    <FormLabel className='whitespace-nowrap font-semibold'>
                      Default Habit Color
                    </FormLabel>
                    <Input {...field} className='w-[60%]' />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <div className='grid grid-cols-1 gap-4'>
            <FormField
              control={form.control}
              name='journalResponseRequired'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormLabel className='whitespace-nowrap font-semibold'>
                        Suggest to journal when you add a Habit Response
                      </FormLabel>
                      <Switch {...field} className='justify-self-center' />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='hideSidebarByDefault'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormLabel className='font-semibold'>
                        Hide the left sidebar by default
                      </FormLabel>
                      <Switch {...field} className='justify-self-center' />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-row items-center justify-end space-x-4'>
            <Button
              type='submit'
              variant='outline'
              className='text-destructive'
            >
              Reset
            </Button>
            <Button type='submit' variant='outline' className='text-primary'>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

// Create Form
// days input
// Default color in create form
// Default icon in create form
// Require journal entry when habit is responded to? (toggle)
// Hide sidebar always (toggle)
