import { BookOpen, Edit } from 'lucide-react';
import { useState } from 'react';

import { abbrev } from '../../../lib/models/habit';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useDelayRender } from '@/lib/hooks/use-delay-render';
import { backgroundColor, dayNames } from '@/lib/models/habit';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

function Create({ habitId, onSave }: { habitId: string; onSave: () => void }) {
  const [open, setOpen] = useState(false);
  const add = trpc.journals.create.useMutation();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handleSave = async () => {
    await add.mutateAsync({ habitId, content, title });
    onSave();
    setOpen(false);
  };

  const handleOpenChange = (force: boolean) => {
    if (force) {
      setOpen(false);
      return;
    }
    return (to: boolean) => {
      if (!force && !open) setOpen(to);
    };
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange(false)}>
      <DialogTrigger>
        <Button variant='ghostPrimary'>
          <BookOpen />
          <span className='sr-only'>Write</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h1 className='text-lg font-semibold'>New Journal Entry</h1>
        </DialogHeader>
        <div>
          <form>
            <div className='grid grid-cols-1 gap-4'>
              <div className='grid grid-cols-1 gap-2'>
                <h3 className='font-semibold'>Title</h3>
                <Input
                  type='text'
                  placeholder={'...'}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <Textarea onChange={(event) => setContent(event.target.value)} />
            </div>
          </form>
        </div>
        <DialogFooter>
          <div className='grid w-full'>
            <div className='flex flex-row items-center justify-between'>
              <Button
                variant='destructive'
                className='destructive'
                onClick={() => handleOpenChange(true)}
              >
                Cancel
              </Button>
              <Button className='primary' onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Journal({ habitId }: { habitId: string }) {
  const { active } = useDelayRender();

  const query = trpc.journals.find.useQuery({ habitId });

  const handleSave = () => query.refetch();

  return (
    <div className='space-8 mx-8 -mt-5 mb-4 grid h-full grid-cols-1 gap-4 p-4'>
      <Card className='h-[350px]'>
        <CardHeader>
          <CardTitle className='flex flex-row items-center justify-between'>
            Journal
            {active ? (
              <Create habitId={habitId} onSave={handleSave} />
            ) : (
              <Button variant='ghostPrimary'>
                <BookOpen />
                <span className='sr-only'>Write</span>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[250px] rounded-xl border'>
            <ul>
              {query.data
                ? query.data.map((entry, i) => {
                    return (
                      <li
                        key={entry.id}
                        className={cn(
                          'h-[64px] w-full border-spacing-4 border-y',
                          i === query.data.length - 1 && 'border-b-2',
                          'border-t-0',
                        )}
                      >
                        <div className='flex h-full flex-row'>
                          <div className='flex flex-col'>
                            <div className='flex w-full flex-row items-start justify-start px-4 pt-2'>
                              <h1 className='text-md font-semibold'>
                                {entry.title}
                              </h1>
                            </div>
                            <div className='ml-4'>
                              <Badge
                                className={cn('m-0.5')}
                                variant='secondary'
                              >
                                {entry.createdAt.toLocaleDateString()}
                                {/* @todo make this a tooltip that shows full created and updated if any */}
                              </Badge>
                            </div>
                          </div>
                          <Separator
                            orientation='vertical'
                            className='-mt-1 ml-2'
                          />
                          <div className='ml-5 mr-5 flex w-[60%] flex-col items-center justify-center text-sm'>
                            {entry.content}
                          </div>
                          <Separator orientation='vertical' className='-mt-1' />
                          <div className='relative -mr-2 flex flex-col items-center justify-center pl-1'>
                            <Button variant={'ghostPrimary'}>
                              <Edit />
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })
                : null}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
