import { redirect } from 'next/navigation';

import { ListHeader, ListMenubar, ListScrollArea } from './list';

import { HabitsList } from '@/components/habits/list';
import { MenuSelect } from '@/components/habits/menu-select';
import { SearchInput } from '@/components/habits/search-input';
import { MenubarMenu } from '@/components/ui/menubar';
import { Filter } from '@/lib/models/habit';
import { getClient } from '@/server/session';

import { Tag } from '~/db/schema';

function FilterMenu({ filter }: { filter?: string }) {
  return (
    <MenuSelect
      paramKey='filter'
      value={filter}
      options={[
        { key: 'archived', title: 'Archived' },
        { key: 'complete-in-window', title: 'Complete in Window' },
        { key: 'needs-response', title: 'Needs Response' },
        { key: 'needs-response-today', title: 'Needs Response Today' },
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
      <ListHeader />
      <ListMenubar>
        <div className='flex flex-row'>
          <FilterMenu filter={searchParams.filter} />
          <SortMenu sort={searchParams.sort} />
          <TagsMenu tags={searchParams.tags} allTags={allTags} />
        </div>
        <MenubarMenu>
          <SearchInput />
        </MenubarMenu>
      </ListMenubar>
      <ListScrollArea>
        <div className='container px-8 py-4 pb-[200px]'>
          <HabitsList habits={habits} />
        </div>
      </ListScrollArea>
    </div>
  );
}
