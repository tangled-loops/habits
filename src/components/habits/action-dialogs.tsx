'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import HabitsForm, { FormViewModel } from './form';

import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';

import { Button } from '$/ui/button';

function handleOpenChange(
  allow: boolean,
  viewModel: FormViewModel,
  setShow: Dispatch<SetStateAction<boolean>>,
) {
  if (allow) {
    setShow(false);
    viewModel.router.replace(viewModel.redirectTo);
    viewModel.router.refresh();
  }
  return (open: boolean) => {};
}

function HabitCreate() {
  const params = useSearchParams();

  const [show, setShow] = useState(true);

  const tagsQuery = trpc.tags.findAll.useQuery();
  const mutation = trpc.habits.createOrUpdate.useMutation();

  const viewModel = new FormViewModel({
    tagsQuery,
    redirectTo: '/habits?page=1',
    mutate: async (data: FrontendHabit) => {
      mutation.mutate(data);
      setShow(false);
    },
  });

  return (
    <Dialog open={!!params.get('create') && show} onOpenChange={setShow}>
      <DialogContent className='md:min-w-[500px] lg:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Create a Habit to Track...</DialogTitle>
        </DialogHeader>
        <ScrollArea className='-px-2 mt-2 max-h-[500px]'>
          <Card>
            <CardContent>
              <HabitsForm viewModel={viewModel} />
            </CardContent>
          </Card>
        </ScrollArea>
        <DialogFooter className='sm:justify-between'>
          <Button
            variant='destructive'
            type='submit'
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
          <span></span>
          <Button
            type='submit'
            onClick={() => viewModel.onSubmit(viewModel.watcher)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HabitEdit({
  habit,
  forceOpen,
}: {
  habit: FrontendHabit;
  forceOpen?: boolean;
}) {
  const ctx = trpc.useContext();
  const path = usePathname();
  const params = useSearchParams();

  const [show, setShow] = useState(forceOpen ?? true);

  const thisDialog = habit.id === (params.get('id') ?? '');

  const tagsQuery = trpc.tags.findAll.useQuery();
  const mutation = trpc.habits.createOrUpdate.useMutation({
    onSuccess() {
      ctx.habits.invalidate();
    },
  });

  const viewModel = new FormViewModel({
    habit,
    tagsQuery,
    redirectTo: path,
    mutate: (data: FrontendHabit) => mutation.mutate(data),
  });

  return (
    <Dialog
      open={!!forceOpen || (show && thisDialog)}
      onOpenChange={handleOpenChange(false, viewModel, setShow)}
    >
      <DialogContent className='md:min-w-[500px] lg:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Editing...</DialogTitle>
        </DialogHeader>
        <ScrollArea className='-px-2 mt-2 max-h-[500px]'>
          <Card>
            <CardContent>
              <HabitsForm viewModel={viewModel} />
            </CardContent>
          </Card>
        </ScrollArea>
        <DialogFooter className='-mb-4 sm:justify-between'>
          <Button
            variant='destructive'
            type='submit'
            onClick={() => handleOpenChange(true, viewModel, setShow)}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            onClick={() => viewModel.onSubmit(viewModel.watcher)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { HabitCreate, HabitEdit };
