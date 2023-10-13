'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import HabitsForm from './form';

import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';

export function HabitCreate() {
  const params = useSearchParams();
  const [show, setShow] = useState(true);
  const query = trpc.tags.findAll.useQuery();

  return (
    <Dialog open={!!params.get('create') && show} onOpenChange={setShow}>
      <DialogContent className='md:min-w-[500px] lg:min-w-[800px]'>
        <DialogHeader>
          <DialogTitle>Create a Habit to Track...</DialogTitle>
        </DialogHeader>
        <ScrollArea className='-px-2 mt-2 max-h-[500px]'>
          <Card>
            <CardContent>
              <HabitsForm tags={query.data ?? []} submitTitle='Save' />
            </CardContent>
          </Card>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
