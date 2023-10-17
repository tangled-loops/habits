'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

import { Card, CardContent } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import HabitsForm, { FormViewModel, useFormViewModel } from './form';

import { FrontendHabit } from '@/lib/models/habit';

import { Button } from '$/ui/button';

function HabitCreate() {
  const params = useSearchParams();

  const [show, setShow] = useState(true);

  const viewModel = useFormViewModel({
    redirectTo: '/habits?page=1',
    onMutate: async () => {
      viewModel.router.refresh();
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
            className='text-white'
            onClick={() => viewModel.onSubmit(viewModel.watcher!)}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function handleOpenChange(
  allow: boolean,
  viewModel: FormViewModel,
  // setShow: Dispatch<SetStateAction<boolean>>,
) {
  if (allow) {
    // setShow(false);
    viewModel.router.replace(viewModel.redirectTo);
    // viewModel.router.refresh();
  }
  return (open: boolean) => {};
}

interface HabitEditProps {
  habit: FrontendHabit;
  open?: boolean;
  handleSubmit?: () => void;
}

function HabitEdit({ habit, open, handleSubmit }: HabitEditProps) {
  const path = usePathname();

  const viewModel = useFormViewModel({ habit, redirectTo: path });

  const onSubmit = async () => {
    await viewModel.onSubmit(viewModel.watcher!);
    handleSubmit?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange(false, viewModel)}>
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
            onClick={() => handleOpenChange(true, viewModel)}
          >
            Cancel
          </Button>
          <Button className='text-white' onClick={onSubmit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { HabitCreate, HabitEdit };
