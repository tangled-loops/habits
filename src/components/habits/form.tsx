'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TRPCClientErrorBase } from '@trpc/client';
import { UseTRPCQueryResult } from '@trpc/react-query/shared';
import { DefaultErrorShape } from '@trpc/server';
import { Dot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form';

import { ToastProps } from '../ui/toast';
import { useToast } from '../ui/use-toast';
import { icon } from './icon';

import {
  Color,
  colors,
  Day,
  days,
  frequencies,
  Frequency,
  FrontendHabit,
  frontendHabitSchema,
  icons,
  textColor,
} from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '$/ui/button';
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
import { MultiSelect, OptionType } from '$/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$/ui/select';
import { Textarea } from '$/ui/textarea';

// eslint-disable-next-line no-unused-vars
type MutateFn = (data: FrontendHabit) => Promise<void>;

interface UseFormViewModelOptions {
  habit?: FrontendHabit;
  redirectTo: string;
  toastTitle?: string;
  onMutate?: MutateFn;
}

export function useFormViewModel({
  habit,
  onMutate,
  toastTitle,
  redirectTo,
}: UseFormViewModelOptions): FormViewModel {
  const router = useRouter();

  const { toast } = useToast();

  const [tags, setTags] = React.useState<Array<OptionType>>([]);

  const create = trpc.habits.create.useMutation();
  const update = trpc.habits.update.useMutation();
  const tagsQuery = trpc.tags.findAllNames.useQuery();

  const viewModel = new FormViewModel({
    tags,
    habit,
    toast,
    router,
    mutate: async (data: FrontendHabit) => {
      if (data.id) {
        await update.mutateAsync(data);
      } else {
        await create.mutateAsync(data);
      }
      await onMutate?.(data);
    },
    setTags,
    tagsQuery,
    redirectTo,
    toastTitle,
  });

  const form = useForm<FrontendHabit>({
    resolver: zodResolver(frontendHabitSchema),
    defaultValues: viewModel.defaultValues,
  });

  const watcher = form.watch();

  viewModel.form = form;
  viewModel.watcher = watcher;
  return viewModel;
}

// eslint-disable-next-line no-unused-vars
type Toast = ({ ...props }: ToastProps) => {
  id: string;
  dismiss: () => void;
  // eslint-disable-next-line no-unused-vars
  update: (props: any) => void;
};

interface FormViewModelOptions extends UseFormViewModelOptions {
  tags: Array<OptionType>;
  toast: Toast;
  mutate: MutateFn;
  router: ReturnType<typeof useRouter>;
  setTags: React.Dispatch<React.SetStateAction<Array<OptionType>>>;
  tagsQuery: UseTRPCQueryResult<
    string[],
    TRPCClientErrorBase<DefaultErrorShape>
  >;
}

export class FormViewModel {
  toastTitle?: string;

  habit: Partial<FrontendHabit> | null | undefined;
  mutate: MutateFn;
  redirectTo: string;
  tagOptions: Array<OptionType>;

  form?: UseFormReturn<FrontendHabit>;
  watcher?: FrontendHabit;

  toast: Toast;
  router: ReturnType<typeof useRouter>;

  setTags: React.Dispatch<React.SetStateAction<Array<OptionType>>>;
  tagsQuery: UseTRPCQueryResult<
    string[],
    TRPCClientErrorBase<DefaultErrorShape>
  >;

  constructor({
    tags,
    toast,
    habit,
    router,
    mutate,
    setTags,
    tagsQuery,
    redirectTo,
    toastTitle,
  }: FormViewModelOptions) {
    this.toast = toast;
    this.habit = habit;
    this.mutate = mutate;
    this.router = router;
    this.setTags = setTags;
    this.tagOptions = tags;
    this.tagsQuery = tagsQuery;
    this.redirectTo = redirectTo;
    this.toastTitle = toastTitle;

    setTimeout(() => {
      if (tagsQuery.data) setTags(this.makeTagOptions);
    }, 250);
  }

  get id() {
    return this.habit?.id ?? '';
  }

  get frequency() {
    return this.habit?.frequency ?? Frequency[Frequency.Daily];
  }

  get color() {
    return this.habit?.color ?? 'green';
  }

  get icon() {
    return this.habit?.icon ?? '';
  }

  get goal() {
    return this.habit?.goal ?? 1;
  }

  get tags() {
    return this.tagsQuery.data ?? this.habit?.tags ?? [];
  }

  get makeTagOptions() {
    return this.tags.map((t) => ({ value: t, label: t }));
  }

  get selectedDays() {
    return this.habit?.selectedDays ?? [];
  }

  get defaultValues() {
    if (this.habit) {
      return { ...this.habit };
    } else {
      return {
        id: this.id,
        frequency: this.frequency,
        goal: this.goal,
        selectedDays: this.selectedDays,
        color: this.color,
        icon: this.icon,
        tags: this.tags,
        notes: '',
      };
    }
  }

  async onSubmit(data: FrontendHabit) {
    await this.mutate({ ...data, archived: false });
    this.router.replace(this.redirectTo);
    this.toast({
      title: this.toastTitle ?? 'Success',
      variant: 'success',
    });
  }

  handleNewTag(
    value: string,
    field: ControllerRenderProps<FrontendHabit, 'tags'>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    return () => {
      this.setTags([...this.tagOptions, { value: value, label: value }]);
      field.onChange([...field.value, value]);
      setOpen(false);
    };
  }

  selectAllTitle(field: ControllerRenderProps<FrontendHabit, 'selectedDays'>) {
    if (field.value && field.value.length === 7) {
      return 'Deselect All';
    } else {
      return 'Select All';
    }
  }

  handleSelectAllDays(
    field: ControllerRenderProps<FrontendHabit, 'selectedDays'>,
  ) {
    return () => {
      if (field.value && field.value.length === 7) {
        field.onChange([]);
      } else {
        field.onChange(days().map((day) => Day[day]));
      }
    };
  }
}

interface HabitsFormProps {
  viewModel: FormViewModel;
}

export default function HabitsForm({ viewModel }: HabitsFormProps) {
  return (
    <Form {...viewModel.form!}>
      <form onSubmit={viewModel.form!.handleSubmit(viewModel.onSubmit)}>
        <div className='m-4 grid grid-cols-1 gap-4'>
          <FormField
            control={viewModel.form!.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-2 gap-4'>
            <FormField
              control={viewModel.form!.control}
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
                        <SelectValue>
                          <div className='flex flex-row items-center'>
                            <Dot
                              className={cn(
                                textColor(field.value as Color),
                                `mr-2`,
                              )}
                            />{' '}
                            {field.value}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => {
                        return (
                          <SelectItem
                            id={color}
                            className={cn(
                              textColor(color),
                              `hover:${textColor(color)}`,
                            )}
                            value={color}
                          >
                            {color}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={viewModel.form!.control}
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
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {icons.map((ico) => {
                        return (
                          <SelectItem id={ico} value={ico}>
                            {icon(ico, viewModel.watcher!.color as Color)}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div
          className={cn(
            'm-4 grid grid-cols-1 gap-4',
            viewModel.watcher!.frequency === Frequency[Frequency.Daily]
              ? 'lg:grid-cols-3'
              : 'lg:grid-cols-2',
          )}
        >
          <FormField
            control={viewModel.form!.control}
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
          {viewModel.watcher!.frequency === Frequency[Frequency.Daily] ? (
            <FormField
              control={viewModel.form!.control}
              name='selectedDays'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div className='flex flex-row items-center justify-between'>
                      Days
                      <div
                        onClick={viewModel.handleSelectAllDays(field)}
                        className={cn(
                          buttonVariants({ variant: 'ghost' }),
                          'font-light',
                        )}
                      >
                        {viewModel.selectAllTitle(field)}
                      </div>
                    </div>
                  </FormLabel>
                  <DaysInput {...field} selected={field.value || []} />
                  <FormDescription>On what days.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {viewModel.watcher!.frequency ? (
            <FormField
              control={viewModel.form!.control}
              name='goal'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Input {...field} type='number' />
                  </FormControl>
                  <FormDescription>
                    How many times per{' '}
                    {viewModel.frequency === Frequency[Frequency.Daily]
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
            control={viewModel.form!.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <MultiSelect
                  selected={field.value || []}
                  options={viewModel.tagOptions}
                  onEmpty={(value, setOpen) => (
                    <Button
                      onClick={viewModel.handleNewTag(value, field, setOpen)}
                    >
                      Create Tag: {value}
                    </Button>
                  )}
                  {...field}
                  className='sm:w-[510px]'
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={viewModel.form!.control}
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
      </form>
    </Form>
  );
}
