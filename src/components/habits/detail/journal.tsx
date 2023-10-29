import { BookOpen, Edit2 } from 'lucide-react';
import { useState } from 'react';

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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useDelayRender } from '@/lib/hooks/use-delay-render';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { Journal } from '@/server/db/schema';

function Edit({ journal, onSave }: { journal: Journal, onSave: () => void }) {
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

  if (!active) return <Edit2 />

  return (
    <Dialog open={open} onOpenChange={handleOpenChange(false)}>
      <DialogTrigger className='w-[24px]'>
        <div className={cn(buttonVariants({ variant: 'ghostPrimary' }))}>
          <Edit2 />
          <span className='sr-only'>Write</span>
        </div>
      </DialogTrigger>
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
        <div className={cn(buttonVariants({ variant: 'ghostPrimary' }))}>
          <BookOpen />
          <span className='sr-only'>Write</span>
        </div>
      </DialogTrigger>
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
          <CardTitle>
            <div  className='flex flex-row items-center justify-between'>
              <span className='ml-2 text-xl font-semibold'>Journal</span>
              {active ? (
                <Create habitId={habitId} onSave={handleSave} />
              ) : (
                <Button variant='ghostPrimary'>
                  <BookOpen />
                  <span className='sr-only'>Write</span>
                </Button>
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
                          <div className='flex h-full flex-row'>
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
                                  {/* @todo make this a tooltip that shows full created and updated if any */}
                                </Badge>
                              </div>
                            </div>
                            <Separator
                              orientation='vertical'
                              className='-mt-1 ml-2'
                            />
                            <div className='mx-5 flex w-[60%] text-ellipsis flex-col items-center justify-center text-sm'>
                              <button onClick={() => console.log('expand if needed?')}>
                                {entry.content.substring(0, 145)}
                                {entry.content.length > 145 && ' ...'}
                              </button>
                            </div>
                            <Separator orientation='vertical' className='-mt-1' />
                            <div className='relative -mr-2 flex flex-col items-center justify-center pl-1'>
                              <Edit journal={entry} onSave={handleSave} />
                            </div>
                          </div>
                        </li>
                      );
                    })
                  : null}
              </ul>
            ) : (null)}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
