'use client';

import { Dot, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

import { FrontendHabit } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { Response } from '@/server/db/schema';

export function RecentResponsesCard({
  habit,
  responses,
}: {
  habit: FrontendHabit;
  responses: Array<Response>;
}) {
  const router = useRouter();
  const { mutateAsync } = trpc.responses.add.useMutation();
  const [responceCount, setResponsesCount] = useState(habit.responses ?? 0);
  const updateResponse = async () => {
    await mutateAsync({ habitId: habit.id! });
    setResponsesCount(responceCount + 1);
    router.replace(`/habits/${habit.id}`);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex flex-row items-center justify-between'>
          Recent Responses ({responceCount} / {habit.goal})
          <Button onClick={() => void updateResponse()}>
            <Plus />
          </Button>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className='-mb-3 mt-2'>
        <ScrollArea className='h-[200px] border p-4 shadow'>
          <Table>
            <TableHead>
              <TableHeader>Date</TableHeader>
            </TableHead>
            <TableBody className='rounded-lg border'>
              {responses.map((response) => {
                return (
                  <TableRow>
                    <TableCell>
                      <div className='flex flex-row'>
                        <div className='flex flex-col items-center justify-center'>
                          <Dot />
                        </div>
                        <div className='flex w-full flex-row space-x-2'>
                          <span>{response.createdAt.toLocaleDateString()}</span>
                          <span>at</span>
                          <span>{response.createdAt.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
