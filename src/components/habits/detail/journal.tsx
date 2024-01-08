import { TooltipArrow, TooltipTrigger } from '@radix-ui/react-tooltip';
import { BookOpen, Edit2 } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useDelayRender } from '@/lib/hooks/use-delay-render';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { Journal as JournalRecord } from '@/server/db/schema';

function Trigger({ icon }: { icon: React.ReactElement }) {
  return (
    <DialogTrigger className='flex flex-row items-center justify-center p-4'>
      <div className={cn(buttonVariants({ variant: 'ghostPrimary' }))}>
        {icon}
        <span className='sr-only'>Write</span>
      </div>
    </DialogTrigger>
  );
}
interface FooterProps {
  handleSave: () => void;
  // eslint-disable-next-line no-unused-vars
  handleOpenChange: (force: boolean) => ((to: boolean) => void) | undefined;
}

function Footer({ handleOpenChange, handleSave }: FooterProps) {
  return (
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
  );
}

function Edit({
  journal,
  onSave,
}: {
  journal: JournalRecord;
  onSave: () => void;
}) {
  const { active } = useDelayRender();

  const [open, setOpen] = useState(false);
  const update = trpc.journals.update.useMutation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    await update.mutateAsync({ id: journal.id, content, title });
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

  if (!active) return <Edit2 />;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange(false)}>
      <Trigger icon={<Edit2 />} />
      <DialogContent>
        <DialogHeader>
          <span className='text-lg font-semibold'>New Journal Entry</span>
        </DialogHeader>
        <div>
          <form>
            <div className='grid grid-cols-1 gap-4'>
              <div className='grid grid-cols-1 gap-2'>
                <h3 className='font-semibold'>Title</h3>
                <Input
                  type='text'
                  placeholder={'What to call it...'}
                  defaultValue={journal.title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <Textarea
                placeholder={'Whatcha thinkin bout...'}
                defaultValue={journal.content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
          </form>
        </div>
        <Footer handleOpenChange={handleOpenChange} handleSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}

function Create({ habitId, onSave }: { habitId: string; onSave: () => void }) {
  const { active } = useDelayRender();

  const add = trpc.journals.create.useMutation();

  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

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

  if (!active) return <BookOpen />;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange(false)}>
      <Trigger icon={<BookOpen className='' />} />
      <DialogContent>
        <DialogHeader>
          <span className='text-lg font-semibold'>New Journal Entry</span>
        </DialogHeader>
        <div>
          {/* @todo change this to a full handled form useForm etc */}
          <form>
            <div className='grid grid-cols-1 gap-4'>
              <div className='grid grid-cols-1 gap-2'>
                <h3 className='font-semibold'>Title</h3>
                <Input
                  type='text'
                  placeholder={'What to call it...'}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <Textarea
                placeholder={'Whatcha thinkin bout...'}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
          </form>
        </div>
        <Footer handleOpenChange={handleOpenChange} handleSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
}

export function Journal({ habitId }: { habitId: string }) {
  const { active } = useDelayRender();

  const query = trpc.journals.find.useQuery({ habitId });

  const handleSave = () => query.refetch();

  return (
    <div className='-mt-8 mb-4 grid h-full grid-cols-1 gap-4 p-4'>
      <Card className='h-[350px]'>
        <CardHeader>
          <CardTitle>
            <div className='flex flex-row items-center justify-between'>
              <span className='ml-2 text-xl font-semibold'>Journal</span>
              {active ? (
                <Create habitId={habitId} onSave={handleSave} />
              ) : (
                <div className='mr-[11px] mt-1'>
                  <Button variant='ghostPrimary'>
                    <BookOpen />
                    <span className='sr-only'>Write</span>
                  </Button>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className='h-[250px] rounded-xl border'>
            {active ? (
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
                          <div className='flex w-full flex-row'>
                            <div className='basis-[25%]'>
                              <div className='grid max-h-[64px] place-items-center p-2 text-xs sm:text-sm'>
                                <p className='h-full w-full overflow-hidden'>
                                  <p className='whitespace-nowrap'>
                                    {entry.title}
                                  </p>
                                </p>
                                <p className='w-full'>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <Badge
                                          className={cn('m-0.5')}
                                          variant='outline'
                                        >
                                          {entry.createdAt.toLocaleDateString()}
                                          {/* @todo make this a tooltip that shows full
                                    created and updated if any */}
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent className='border bg-background text-secondary-foreground'>
                                        <div className='grid justify-between p-2'>
                                          <p className='flex flex-row justify-between space-x-2'>
                                            <span>Created At: </span>
                                            <span>
                                              {entry.createdAt
                                                .toISOString()
                                                .split('T')
                                                .join(' ')
                                                .replace('.000Z', '')}
                                            </span>
                                          </p>
                                          {entry.updatedAt && (
                                            <p className='grid'>
                                              <span>Last Updated: </span>
                                              {entry.updatedAt
                                                .toISOString()
                                                .split('T')
                                                .join(' ')
                                                .replace('.000Z', '')}
                                            </p>
                                          )}
                                        </div>
                                        <TooltipArrow className='-mb-2 h-2 w-4 fill-primary stroke-primary' />
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </p>
                              </div>
                            </div>
                            <div className='basis-[65%] border-l'>
                              <div className='grid max-h-[64px] place-items-start overflow-auto p-2'>
                                {entry.content}
                              </div>
                            </div>
                            <div className='basis-[10%] border-l'>
                              <div className='grid grid-flow-col'>
                                <Edit journal={entry} onSave={handleSave} />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
            ) : null}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

{
  /* <div className='flex h-full flex-row items-center'>
  <div className='flex flex-col'>
    <div className='flex w-full flex-row items-start justify-start px-4 pt-2'>
      <h1 className='text-md font-light'>
        {entry.title.substring(0, 10)}
      </h1>
    </div>
    <div className='ml-4'>
      <Badge
        className={cn('m-0.5')}
        variant='secondary'
      >
        {entry.createdAt.toLocaleDateString()}
        @todo make this a tooltip that shows full created and updated if any
      </Badge>
    </div>
  </div>
  <Separator
    orientation='vertical'
    className='-mt-1 ml-2'
  />
  <div className='mx-5 flex w-[80%] flex-col items-center justify-center text-ellipsis text-sm'>
    <button
      onClick={() => console.log('expand if needed?')}
    >
      {entry.content.substring(0, 145)}
      {entry.content.length > 145 && ' ...'}
    </button>
  </div>
  <Separator
    orientation='vertical'
    className='-mt-1'
  />
  <div className='-ml-32 flex w-[15%] flex-row items-center justify-center md:-ml-8'>
    <Edit journal={entry} onSave={handleSave} />
  </div>
</div>
*/
}
