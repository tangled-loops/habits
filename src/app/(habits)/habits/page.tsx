import { ChevronUp, Filter, Plus, SortAsc } from 'lucide-react';
import Link from 'next/link';

import { HabitCreate } from '@/components/habits/action-dialogs';
import { HabitsList } from '@/components/habits/list';
import { Input } from '@/components/ui/input';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getClient } from '@/server/session';

import { Button } from '$/ui/button';

function Header() {
  return (
    <div className='-mx-3 -mt-4 border-y p-4 md:-mx-4'>
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

export const filters = ['none', 'archived', 'needs-response'] as const;
export type FilterType = (typeof filters)[number];

function FilterMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger className='ml-10'>
        <Filter />
      </MenubarTrigger>
      <MenubarContent>
        <Link href={`/habits?filter=archived`} passHref>
          <MenubarItem>Archived</MenubarItem>
        </Link>
        <Link href={`/habits?filter=needs-response`} passHref>
          <MenubarItem>Needs Responses</MenubarItem>
        </Link>
        <MenubarSeparator />
        <Link href={`/habits`} passHref>
          <MenubarItem>Clear</MenubarItem>
        </Link>
      </MenubarContent>
    </MenubarMenu>
  );
}

//{ filter }: { filter: FilterType }) {
// const filtersFor = (newFilter: FilterType) => {
//   return `${newFilter},${filters.filter((f) => f !== newFilter).join(',')}`;
// };

function SortMenu() {
  return (
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
  );
}

export default async function Habits({
  searchParams,
}: {
  searchParams: { page: number; filter?: string };
}) {
  const client = await getClient();
  // const total = await client.habits.totalCount({
  //   limit: 100,
  // });
  const page = Number(searchParams.page ?? 1);
  const limit = 100;
  const filter = (searchParams.filter ?? 'none') as FilterType;
  console.log(filter);
  const habits = await client.habits.findAll({ limit, page, filter });
  return (
    <>
      <HabitCreate />
      <div className='flex max-h-screen min-h-full flex-col'>
        <Header />
        <Menubar className='-mx-5 flex flex-row justify-start border-0 border-b'>
          <div className='flex flex-row'>
            <FilterMenu />
            <SortMenu />
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
