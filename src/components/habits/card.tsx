import { MoreHorizontal, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { EditField, Field } from './table';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { Habit } from '~db/schema';

interface HabitCardProps {
  habit: Habit;
  onSubmit: () => void;
}

export function HabitCard({ habit, onSubmit }: HabitCardProps) {
  const [editing, setEditing] = useState<Field>('none');
  const handleSubmit = () => {
    onSubmit();
    setEditing('none');
  };
  const content = (field: Field) => {
    const editField = (value: string | null) => {
      return (
        <EditField
          id={habit.id}
          field={field}
          value={value}
          handleSubmit={handleSubmit}
        />
      );
    };
    const fieldEditing = field === editing;
    switch (field) {
      case 'title': {
        if (fieldEditing) return editField(habit.title);
        return habit.title;
      }
      case 'description': {
        if (fieldEditing) return editField(habit.description);
        return habit.description;
      }
      default: {
        return '';
      }
    }
  };

  const responses = [
    { id: '1', value: 'Performed', createdAt: new Date('10/2/2023') },
    { id: '2', value: 'Performed', createdAt: new Date('10/3/2023') },
    { id: '3', value: 'Performed', createdAt: new Date('10/4/2023') },
    { id: '1', value: 'Performed', createdAt: new Date('10/2/2023') },
    { id: '2', value: 'Performed', createdAt: new Date('10/3/2023') },
    { id: '3', value: 'Performed', createdAt: new Date('10/4/2023') },
    { id: '1', value: 'Performed', createdAt: new Date('10/2/2023') },
    { id: '2', value: 'Performed', createdAt: new Date('10/3/2023') },
    { id: '3', value: 'Performed', createdAt: new Date('10/4/2023') },
  ];

  const tags = [
    { id: '1', name: 'daily' },
    { id: '2', name: 'life-things' },
  ];

  return (
    <Card>
      <div className='flex flex-row items-center'>
        <CardHeader className='grow'>
          <CardTitle onClick={() => setEditing('title')}>
            {content('title')}
          </CardTitle>
          <CardDescription onClick={() => setEditing('description')}>
            {content('description')}
          </CardDescription>
        </CardHeader>
        <DropdownMenu>
          <DropdownMenuTrigger className='mr-4'>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent className='space-y-1'>
            <Link href={`/habits/${habit.id}`} passHref legacyBehavior>
              <DropdownMenuItem
                className={cn(
                  buttonVariants({ variant: 'default' }),
                  'w-full cursor-pointer text-left',
                )}
                // @todo wrap the menu item in a link with passHref / legacyBehavior
              >
                Details
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className={cn(
                buttonVariants({ variant: 'destructive' }),
                'w-full cursor-pointer',
              )}
            >
              <Trash className='mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      <CardContent>
        <Table>
          <TableCaption>Recent Responses</TableCaption>
          <ScrollArea className='h-[100px]'>
            <TableBody>
              {responses.map((response) => {
                return (
                  <TableRow key={response.id}>
                    <TableCell className='font-medium'>
                      {response.value}
                    </TableCell>
                    <TableCell>{response.createdAt.toDateString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </ScrollArea>
        </Table>
      </CardContent>
      <Separator />
      <CardFooter className='mt-2 items-center justify-between'>
        <div className='flex flex-row space-x-2'>
          {tags.map((tag) => {
            return (
              <Badge id={tag.id} className='flex flex-row p-1'>
                {tag.name}
                <Button variant='ghost' size='xsm' className='ml-2'>
                  <X />
                </Button>
              </Badge>
            );
          })}
        </div>
        <Button onClick={() => {}}>Respond</Button>
      </CardFooter>
    </Card>
  );
}
