import { BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface JournalEntry {
  id: number;
  text: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export function Journal() {
  const [active, setActive] = useState(false);

  useEffect(() => setActive(true), []);

  const journalEntries: JournalEntry[] = [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: null,
      text: 'a blah and a blah and I blah blah blahed weeee',
    },
    {
      id: 2,
      createdAt: new Date('10/12/2023 00:00'),
      updatedAt: new Date('10/13/2023 00:00'),
      text: 'a blah and a blah and I blah blah blahed weeee',
    },
    {
      id: 3,
      createdAt: new Date('10/11/2023 00:00'),
      updatedAt: null,
      text: 'a blah and a blah and I blah blah blahed weeee',
    },
  ];
  return (
    <div className='space-8 mx-8 -mt-5 grid h-full grid-cols-1 gap-4 p-4'>
      <Card className='h-[350px]'>
        <CardHeader>
          <CardTitle className='flex flex-row items-center justify-between'>
            Journal
            {active ? (
              <Dialog>
                <DialogTrigger>
                  <Button variant='ghostPrimary'>
                    <BookOpen />
                    <span className='sr-only'>Write</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form>
                    <Textarea />
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant='ghostPrimary'>
                <BookOpen />
                <span className='sr-only'>Write</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {journalEntries.map((entry) => {
              return (
                <li key={entry.id} className='w-full p-4'>
                  {entry.updatedAt ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className='grid grid-cols-1 gap-0'>
                            <p className='text-left font-semibold'>Created</p>
                            {entry.createdAt.toDateString()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          Last Updated: {entry.updatedAt?.toDateString() ?? ''}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <div className='grid-cols-3'>
                      <span className='grid gap-0'>
                        <p className='font-semibold'>Created</p>
                        {entry.createdAt.toDateString()}
                      </span>
                      <div className='grid'>
                        <p className='font-semibold'>Text</p>
                        {entry.text}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
