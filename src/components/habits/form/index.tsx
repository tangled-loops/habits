'use client';

import { Dot } from 'lucide-react';
import React, { useState } from 'react';

import { icon } from '../icon';
import { FormViewModel, useFormViewModel } from './form-view-model';

import { Textarea } from '@/components/ui/textarea';
import {
  Color,
  colors,
  frequencies,
  Frequency,
  icons,
  textColor,
} from '@/lib/models/habit';
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
import { MultiSelect } from '$/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '$/ui/select';

interface HabitsFormProps {
  viewModel: FormViewModel;
}

interface HasViewModel {
  viewModel: FormViewModel;
}

const NameField = ({ viewModel }: HasViewModel) => (
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
);

const ColorField = ({ viewModel }: HasViewModel) => (
  <FormField
    control={viewModel.form!.control}
    name='color'
    render={({ field }) => (
      <FormItem>
        <FormLabel>Color</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue>
                <div className='flex flex-row items-center'>
                  <Dot
                    className={cn(textColor(field.value as Color), `mr-2`)}
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
                  key={color}
                  id={color}
                  className={cn(textColor(color), `hover:${textColor(color)}`)}
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
);

const IconField = ({ viewModel }: HasViewModel) => (
  <FormField
    control={viewModel.form!.control}
    name='icon'
    render={({ field }) => (
      <FormItem>
        <FormLabel>Icon</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {icons.map((ico) => {
              return (
                <SelectItem key={ico} id={ico} value={ico}>
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
);

const FrequencyInput = ({ viewModel }: HasViewModel) => (
  <FormField
    control={viewModel.form!.control}
    name='frequency'
    render={({ field }) => (
      <FormItem>
        <FormLabel>Frequency</FormLabel>
        <Select defaultValue={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder='Select how often you want to track this habit.' />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {frequencies().map((freq) => {
              return (
                <SelectItem
                  id={`${freq}`}
                  key={`${freq}`}
                  value={Frequency[freq]}
                >
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
);

const SelectedDaysInput = ({ viewModel }: HasViewModel) => {
  if (viewModel.watcher!.frequency !== Frequency[Frequency.Daily]) return null;
  return (
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
          <DaysInput onChange={field.onChange} selected={field.value || []} />
          <FormDescription>On what days.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const GoalInput = ({ viewModel }: HasViewModel) => {
  if (!viewModel.watcher?.frequency) return null;
  return (
    <FormField
      control={viewModel.form!.control}
      name='goal'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Goal</FormLabel>
          <FormControl>
            <Input {...field} type='number' min={0} />
          </FormControl>
          <FormDescription>
            How many{'  '}
            <GoalCode
              code={viewModel.watcher?.goalCode}
              viewModel={viewModel}
            />
            {'  '}
            per
            {'  '}
            {viewModel.frequency === Frequency[Frequency.Daily]
              ? 'day'
              : 'week'}
            .
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

function GoalCode({
  code,
  viewModel,
}: {
  code?: string;
  viewModel: FormViewModel;
}) {
  const [_code, setCode] = useState(code);
  const [editing, setEditing] = useState(false);
  if (!editing) {
    return (
      <button onClick={() => setEditing(!editing)}>{_code ?? 'Times'}</button>
    );
  }
  return (
    <FormField
      control={viewModel.form!.control}
      name='goalCode'
      render={({ field }) => (
        <FormItem className='flex flex-row items-center space-x-2'>
          <FormControl>
            <Input
              {...field}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  setCode(field.value);
                  setEditing(false);
                }
              }}
            />
          </FormControl>
          <button
            onClick={(event) => {
              event.stopPropagation();
              setCode(field.value);
              setEditing(false);
            }}
          >
            Save
          </button>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

const TagsInput = ({ viewModel }: HasViewModel) => (
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
            <Button onClick={viewModel.handleNewTag(value, field, setOpen)}>
              Create Tag: {value}
            </Button>
          )}
          onChange={field.onChange}
          className='sm:w-[510px]'
        />
        <FormMessage />
      </FormItem>
    )}
  />
);

const NotesInput = ({ viewModel }: HasViewModel) => (
  <FormField
    control={viewModel.form!.control}
    name='notes'
    render={({ field }) => (
      <FormItem>
        <FormLabel>Notes</FormLabel>
        <FormControl>
          <Textarea {...field} />
        </FormControl>
        <FormDescription>Any additional info you want to add.</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);

function HabitsForm({ viewModel }: HabitsFormProps) {
  return (
    <Form {...viewModel.form!}>
      <form>
        <div className='m-4 grid grid-cols-1 gap-4'>
          <NameField viewModel={viewModel} />
          <div className='grid grid-cols-2 gap-4'>
            <ColorField viewModel={viewModel} />
            <IconField viewModel={viewModel} />
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
          <FrequencyInput viewModel={viewModel} />
          <SelectedDaysInput viewModel={viewModel} />
          <GoalInput viewModel={viewModel} />
        </div>
        <div className='m-4 grid grid-cols-1 gap-8'></div>
        <div className='m-4 grid grid-cols-1 gap-8'>
          <TagsInput viewModel={viewModel} />
          <NotesInput viewModel={viewModel} />
        </div>
      </form>
    </Form>
  );
}

export { HabitsForm, useFormViewModel, FormViewModel };
