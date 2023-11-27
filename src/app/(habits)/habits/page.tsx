import { Plus } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { HabitsList } from '@/components/habits/list';
import { MenuSelect } from '@/components/habits/menu-select';
import { SearchInput } from '@/components/habits/search-input';
import { Menubar, MenubarMenu } from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Filter } from '@/lib/models/habit';
import { getClient } from '@/server/session';

import { Tag } from '~/db/schema';

import { Button } from '$/ui/button';

export function Header() {
  return (
    <div className='ml-[85px] h-[63px] border-b p-4'>
      <div className='flex flex-row items-center justify-between'>
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

function FilterMenu({ filter }: { filter?: string }) {
  return (
    <MenuSelect
      paramKey='filter'
      value={filter}
      options={[
        { key: 'archived', title: 'Archived' },
        { key: 'needs-response', title: 'Respond' },
      ]}
    />
  );
}

function SortMenu({ sort }: { sort?: string }) {
  return (
    <MenuSelect
      paramKey='sort'
      value={sort}
      options={[
        { key: 'priority', title: 'Priority' },
        { key: 'created', title: 'Created' },
        { key: 'updated', title: 'Updated' },
      ]}
    />
  );
}

function TagsMenu({ tags, allTags }: { tags?: string; allTags: Tag[] }) {
  return (
    <MenuSelect
      paramKey='tags'
      value={tags}
      options={allTags.map((tag) => ({ key: tag.id, title: tag.name }))}
    />
  );
}

export default async function Habits({
  searchParams,
}: {
  searchParams: {
    page: number;
    search?: string;
    filter?: string;
    sort?: string;
    tags?: string;
    create?: boolean;
  };
}) {
  const client = await getClient();
  if (!client) redirect('/login');
  const allTags = await client.tags.findAll();

  const page = Number(searchParams.page ?? 1);
  const limit = 100;
  const filter = (searchParams.filter ?? 'none') as Filter;
  const sort = searchParams.sort ?? 'none';
  const search = searchParams.search;
  const tags = searchParams.tags ?? '';
  const habits = await client.habits.findAll({
    limit,
    page,
    filter,
    search,
    sort,
    tagId: tags,
  });
  return (
    <div className='relative flex h-full w-full flex-col'>
      <Header />
      <Menubar className='ml-[85.5px] flex flex-row justify-start rounded-none border-0 border-b'>
        <div className='flex flex-row'>
          <FilterMenu filter={searchParams.filter} />
          <SortMenu sort={searchParams.sort} />
          <TagsMenu tags={searchParams.tags} allTags={allTags} />
        </div>
        <MenubarMenu>
          <SearchInput />
        </MenubarMenu>
      </Menubar>
      <ScrollArea className='absolute inset-0 ml-[85.5px] h-screen'>
        <div className='container px-8 py-4 pb-[200px]'>
          <HabitsList habits={habits} />
        </div>
      </ScrollArea>
    </div>
  );
}
