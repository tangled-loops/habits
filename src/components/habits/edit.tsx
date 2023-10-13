'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import HabitsForm from './form';

import { FrontendHabit } from '@/lib/models/habit';

export function HabitEdit({ habit }: { habit: FrontendHabit }) {
  const params = useSearchParams();
  const [show, setShow] = useState(true);
  const thisDialog = habit.id === (params.get('id') ?? '');
  return (
    <Dialog
      open={!!params.get('create') && show && thisDialog}
      onOpenChange={setShow}
    >
      <DialogContent className='md:min-w-[500px] lg:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Editing...</DialogTitle>
        </DialogHeader>
        <ScrollArea className='-px-2 mt-2 max-h-[500px]'>
          <Card>
            <CardContent>
              <HabitsForm data={habit} tags={habit.tags} submitTitle='Save' />
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
