import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ControllerRenderProps, useForm, UseFormReturn } from 'react-hook-form';

import {
  Day,
  days,
  Frequency,
  FrontendHabit,
  frontendHabitSchema,
} from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';

import { OptionType } from '$/ui/multi-select';
import { ToastProps } from '$/ui/toast';
import { useToast } from '$/ui/use-toast';

// eslint-disable-next-line no-unused-vars
type MutateFn = (data: FrontendHabit) => Promise<void>;

interface UseFormViewModelOptions {
  habit?: FrontendHabit;
  tagNames?: string[];
  redirectTo: string;
  toastTitle?: string;
  onMutate?: MutateFn;
}

function useFormViewModel({
  habit,
  tagNames,
  onMutate,
  toastTitle,
  redirectTo,
}: UseFormViewModelOptions): FormViewModel {
  const router = useRouter();

  const { toast } = useToast();

  const [tags, setTags] = React.useState<Array<OptionType>>(
    tagNames?.map((t) => ({ value: t, label: t })) ?? [],
  );

  const create = trpc.habits.create.useMutation();
  const update = trpc.habits.update.useMutation();

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
}

class FormViewModel {
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

  constructor({
    tags,
    toast,
    habit,
    router,
    mutate,
    setTags,
    redirectTo,
    toastTitle,
  }: FormViewModelOptions) {
    this.toast = toast;
    this.habit = habit;
    this.mutate = mutate;
    this.router = router;
    this.setTags = setTags;
    this.tagOptions = tags;
    this.redirectTo = redirectTo;
    this.toastTitle = toastTitle;
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
    return this.habit?.tags ?? [];
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
        archived: false,
      };
    }
  }

  async onSubmit() {
    let didSubmit = false;
    await this.form?.handleSubmit((data: FrontendHabit) => {
      didSubmit = true;
      this.mutate({ ...data });
    })();
    if (didSubmit) {
      this.router.replace(this.redirectTo);
      // this.router.refresh()
      this.toast({
        title: this.toastTitle ?? 'Success',
        variant: 'success',
      });
    }
    return didSubmit;
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

export { useFormViewModel, FormViewModel };
