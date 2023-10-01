'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { toast } from '../ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button, buttonVariants } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { trpc } from '@/lib/trpc';
import { redirect, useRouter } from 'next/navigation';

const habitsFormSchema = z.object({
  title: z.string(),
  description: z.string(),
});

type HabitsFormValues = z.infer<typeof habitsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<HabitsFormValues> = {
  title: '',
  description: '',
};

/**
 * @todo figure out why the session passed into the auth context is not correct
 */
export default function HabitsForm() {
  console.log('main')
  const mutation = trpc.habits.create.useMutation()
  const router = useRouter()

  const form = useForm<HabitsFormValues>({
    resolver: zodResolver(habitsFormSchema),
    defaultValues,
  });

  function onSubmit(data: HabitsFormValues) {
    console.log(data)
    const resp = mutation.mutate(data)
    console.log(resp)
    router.replace('/habits')
    // toast({
    //   title: 'You submitted the following values:',
    //   description: (
    //     <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
    //       <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Habit</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className='flex flex-col items-center p-5'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <div className=''>
                    <FormControl>
                      <Input {...field} className='w-[300px]' />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Title for the habit to track.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Font</FormLabel>
                  <div className='relative w-max'>
                    <FormControl>
                      <Textarea {...field} className='w-[300px]' />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Description of the habit to track.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-row justify-end'>
              <Button type='submit'>Update preferences</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
