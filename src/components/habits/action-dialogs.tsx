'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { FormViewModel, HabitsForm, useFormViewModel } from './form';

import { FrontendHabit } from '@/lib/models/habit';

import { Button } from '$/ui/button';
import { Card, CardContent } from '$/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '$/ui/dialog';
import { ScrollArea } from '$/ui/scroll-area';

function HabitCreate({ open, tags }: { open?: boolean; tags?: string[] }) {
  const viewModel = useFormViewModel({
    tagNames: tags,
    redirectTo: '/habits?page=1',
    onMutate: async () => {
      viewModel.router.refresh();
    },
    toastTitle: 'New Habit Added',
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange(false, viewModel)}>
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
            onClick={() => handleOpenChange(true, viewModel)}
          >
            Cancel
          </Button>
          <span></span>
          <Button
            type='submit'
            className='text-white'
            onClick={() => viewModel.onSubmit()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function handleOpenChange(allow: boolean, viewModel: FormViewModel) {
  if (allow) {
    viewModel.router.replace(viewModel.redirectTo);
  }
  // eslint-disable-next-line no-unused-vars
  return (open: boolean) => {};
}

interface HabitEditProps {
  habit: FrontendHabit;
  open?: boolean;
  tags?: string[];
  handleSubmit?: () => void;
}

function HabitEdit({ habit, open, tags, handleSubmit }: HabitEditProps) {
  const path = usePathname();

  const viewModel = useFormViewModel({
    habit,
    tagNames: tags,
    redirectTo: path,
    toastTitle: `Edit Successful`,
  });

  const onSubmit = async () => {
    const didSubmit = await viewModel.onSubmit();
    if (didSubmit) handleSubmit?.();
  };

  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
  }, []);

  if (!active) return null;

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
