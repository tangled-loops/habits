'use client';

import React, { ReactNode, useEffect } from 'react';

import { HabitCard } from './card';

import { trpc } from '@/lib/trpc';

import { Button } from '$/ui/button';

export function HabitsList() {
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const query = trpc.habits.infiniteHabits.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    },
  );

  const nextPage = async () => {
    if (query.hasNextPage) {
      const result = await query.fetchNextPage();
      setPage(page + 1);
      if (result.data?.pages[page].nextCursor === undefined) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  };

  const renderPages = () => {
    if (query.isLoading || !query.data) return null;

    const cards: Array<ReactNode> = [];

    for (let i = 0; i < page; i++) {
      query.data.pages[i].items.forEach((item) => {
        cards.push(<HabitCard key={item.id} habit={item} />);
      });
    }

    return cards;
  };

  useEffect(() => void nextPage());

  return (
    <>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        {renderPages()}
      </div>
      {hasMore && (
        <div className='mt-5 grid grid-cols-1'>
          <Button onClick={() => void nextPage()}>Load More</Button>
        </div>
      )}
    </>
  );
}
