import { ChevronUp, Filter, Plus, SortAsc } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { HabitCreate } from '@/components/habits/action-dialogs';
import { HabitsList } from '@/components/habits/list';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getClient } from '@/server/session';

import { Button } from '$/ui/button';

function Header() {
  return (
    <div className='-mt-4 border-y p-4 md:-mx-4'>
      <div className='mx-8 flex flex-row items-center justify-between'>
        <h1 className='text-xl font-normal'>Habit Tracker</h1>
        <Link href='/habits?create=true' passHref>
          <Button variant='ghostPrimary'>
            <Plus className='mr-2' />
            New Habit
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function Habits({
  searchParams,
}: {
  searchParams: { page: number };
}) {
  const client = await getClient();
  const total = await client.habits.totalCount({
    limit: 100,
  });
  const habits = await client.habits.findAll({
    limit: 100,
    page: Number(searchParams.page ?? 1),
  });
  return (
    <>
      <HabitCreate />
      <div className='flex max-h-screen min-h-full flex-col'>
        <Header />
        <Menubar className='-mx-5 flex flex-row justify-start border-0 border-b'>
          <div className='flex flex-row'>
            <MenubarMenu>
              <MenubarTrigger className='ml-10'>
                <Filter />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>All</MenubarItem>
                <MenubarItem>Deleted</MenubarItem>
                <MenubarItem>Completed</MenubarItem>
                {/* <MenubarSeparator />
                <MenubarItem>No Responses</MenubarItem>
                <MenubarItem>Needs Response</MenubarItem>
                <MenubarItem>Needs Response Today</MenubarItem>
                <MenubarItem>Needs Response for the Week</MenubarItem> */}
                <MenubarSeparator />
                <MenubarItem>Clear All</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger className='mr-[10px]'>
                <SortAsc />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Priority <ChevronUp className='ml-2' />
                </MenubarItem>
                <MenubarItem>
                  Created <ChevronUp className='ml-2' />
                </MenubarItem>
                <MenubarItem>
                  Updated <ChevronUp className='ml-2' />
                </MenubarItem>
                <MenubarItem>
                  Responses <ChevronUp className='ml-2' />
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Clear All</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </div>
          <MenubarMenu>
            <Input
              className='w-[40%] border-0 hover:border-0'
              placeholder='Search...'
            />
          </MenubarMenu>
        </Menubar>
        <ScrollArea className='absolute bottom-0 -mx-4 h-[87vh] md:-mx-2 lg:-mx-4'>
          <div className='px-8 py-2 pb-[200px]'>
            <HabitsList habits={habits} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
