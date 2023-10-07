'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '$/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '$/ui/form';
import { Input } from '$/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { trpc } from '@/lib/trpc';
import { Frequency, habitsFormSchema } from '@/server/db/schema';

type HabitsFormValues = z.infer<typeof habitsFormSchema>;

interface HabitsFormProps {
  data?: HabitsFormValues;
  submitTitle: string;
}

export default function HabitsForm({ data, submitTitle }: HabitsFormProps) {
  const router = useRouter();
  const mutation = trpc.habits.createOrUpdate.useMutation();

  let defaultValues: HabitsFormValues;
  if (data) {
    defaultValues = { ...data };
  } else {
    defaultValues = {
      id: '',
      title: '',
      frequency: 'daily',
      goal: 1,
      selectedDays: [],
      color: 'primary',
      icon: 'none',
      tags: [],
    };
  }

  const form = useForm<HabitsFormValues>({
    resolver: zodResolver(habitsFormSchema),
    defaultValues,
  });

  const watcher = form.watch();

  function onSubmit(data: HabitsFormValues) {
    mutation.mutate(data);
    router.replace('/habits');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 p-16'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} className='' />
              </FormControl>
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
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
                    <SelectItem value={Frequency.daily}>
                      {Frequency.daily.toUpperCase()}
                    </SelectItem>
                    <SelectItem value={Frequency.weekly}>
                      {Frequency.weekly.toUpperCase()}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {watcher.frequency === Frequency.daily 
            ? (
              <FormField
                control={form.control}
                name='selectedDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selected Days</FormLabel>
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
                        <SelectItem value={Frequency.daily}>
                          {Frequency.daily.toUpperCase()}
                        </SelectItem>
                        <SelectItem value={Frequency.weekly}>
                          {Frequency.weekly.toUpperCase()}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
                )
                : null
              }          
        </div>
        <div className='flex flex-row justify-start'>
          <Button type='submit'>{submitTitle}</Button>
        </div>
      </form>
    </Form>
  );
}

// interface FormDialogProps {
//   title: ReactNode;
//   desc: ReactNode;
//   trigger: ReactNode;
//   data?: {
//     id: string;
//     title: string;
//     description: string;
//   };
//   handleSubmit: () => void;
//   submitTitle: string;
// }

// export function FormDialog({
//   data,
//   title,
//   desc,
//   trigger,
//   submitTitle,
//   handleSubmit,
// }: FormDialogProps) {
//   const [open, setOpen] = useState(false);
//   const submitWrapper = () => {
//     setOpen(false);
//     handleSubmit();
//   };
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger>{trigger}</DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//           <DialogDescription>{desc}</DialogDescription>
//         </DialogHeader>
//         <HabitsForm
//           data={data}
//           submitTitle={submitTitle}
//           handleSubmit={submitWrapper}
//         />
//       </DialogContent>
//     </Dialog>
//   );
// }
