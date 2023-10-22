import { Plus } from 'lucide-react';
import Link from 'next/link';

import { HabitCreate } from '@/components/habits/action-dialogs';
import { HabitsList } from '@/components/habits/list';
import { MenuSelect } from '@/components/habits/menu-select';
import { SearchInput } from '@/components/habits/search-input';
import { Menubar, MenubarMenu } from '@/components/ui/menubar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilterType } from '@/lib/models/habit';
import { getClient } from '@/server/session';

import { Tag } from '~/db/schema';

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
  };
}) {
  const client = await getClient();
  const allTags = await client.tags.findAll();

  const page = Number(searchParams.page ?? 1);
  const limit = 100;
  const filter = (searchParams.filter ?? 'none') as FilterType;
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
    <>
      <HabitCreate />
      <div className='flex max-h-screen min-h-full flex-col'>
        <Header />
        <Menubar className='-mx-5 flex flex-row justify-start border-0 border-b'>
          <div className='flex flex-row'>
            <FilterMenu filter={searchParams.filter} />
            <SortMenu sort={searchParams.sort} />
            <TagsMenu tags={searchParams.tags} allTags={allTags} />
          </div>
          <MenubarMenu>
            <SearchInput />
          </MenubarMenu>
        </Menubar>
        <ScrollArea className='absolute bottom-0 -mx-4 h-[80vh] md:-mx-2 lg:-mx-4'>
          <div className='px-8 py-2 pb-[200px]'>
            <HabitsList habits={habits} />
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
