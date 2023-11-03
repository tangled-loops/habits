import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { ResponseRateChart } from '@/components/dashboard/response-rate-chart';
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart';
import { Days } from '@/components/habits/list/days';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FrontendResponse } from '@/lib/models/response';
import { getClient } from '@/server/session';

import { Separator } from '$/ui/separator';

async function RecentActivityCard({
  responses,
}: {
  responses: FrontendResponse[];
}) {
  const date = (response: FrontendResponse) =>
    new Date(
      response.createdAt.toISOString().replaceAll('T', ' ').replaceAll('Z', ''),
    ).toLocaleDateString();
  const time = (response: FrontendResponse) => {
    const locTime = new Date(
      response.createdAt.toISOString().replaceAll('T', ' ').replaceAll('Z', ''),
    ).toLocaleTimeString();
    const parts = locTime.split(' ');
    const type = parts[1];
    const restNoSec = parts[0]
      .split(':')
      .filter((_x, i, r) => i < r.length - 1)
      .join(':');
    return `${restNoSec} ${type}`;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <Separator className='bg-primary/50' />
      </CardHeader>
      <CardContent>
        <ScrollArea className='-m-2 h-[125px] border-separate flex-col justify-center border border-primary/50 p-0'>
          {responses.length > 0 ? (
            <ul className=''>
              {responses.map((response) => {
                return (
                  <li className='border border-t-0 p-2 hover:bg-secondary hover:shadow'>
                    <div className='flex w-full flex-row justify-between'>
                      <div className='flex flex-row space-x-2'>
                        <Badge variant={'outline'} className='text-primary'>
                          <p>+1</p>
                        </Badge>
                        <p className='text-sm'>{response.name}</p>
                      </div>
                      <p className='text-sm'>
                        <span>{date(response)}</span>
                        {'  '}
                        <span>{time(response)}</span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className='flex-col justify-center p-6'>
              Inspirational quote about doing things, and how you haven
              {"'"}t been
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default async function Dashboard() {
  const api = await getClient();
  if (!api) return;
  const needsResponse = await api.habits.findAll({
    filter: 'needs-response',
    limit: 25,
    page: 0,
    sort: 'updated-at',
  });
  const completedInTimeframe = await api.habits.findAll({
    filter: 'complete-in-window',
    limit: 25,
    page: 0,
    sort: 'updated-at',
  });
  const recentActivity = await api.responses.findAllFrontend({
    limit: 100,
  });
  return (
    <>
      <div className='border-0'>
        <div>
          <h1 className='p-4 text-2xl'>Dashboard</h1>
          <Separator className='-mx-10 mt-2 w-[100hw]' />
        </div>
        <ScrollArea className='h-[85vh] '>
          <div className='grid grid-cols-1 gap-4 p-4'>
            <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
              <RecentActivityCard responses={recentActivity} />
              <Card>
                <CardHeader>
                  <CardTitle>Needs Response</CardTitle>
                  <Separator className='bg-primary/50' />
                </CardHeader>
                <CardContent>
                  <ScrollArea className='-m-2 h-[125px] border-separate flex-col justify-center border border-primary/50 p-0'>
                    {needsResponse.length > 0 ? (
                      <ul className=''>
                        {needsResponse.map((habit) => {
                          return (
                            <li className='cursor-pointer border border-t-0 p-2 hover:bg-secondary hover:shadow'>
                              <Link href={`/habits/${habit.id}`} passHref>
                                <button className='flex w-full flex-row items-center justify-between'>
                                  <p>{habit.name}</p>
                                  <span className='flex flex-row items-center'>
                                    <Days habit={habit} />
                                    <ChevronRight />
                                  </span>
                                </button>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className='p-6'>
                        There{"'"}s nothing here, track some habits.
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Completed in Timeframe</CardTitle>
                  <Separator className='bg-primary/50' />
                </CardHeader>
                <CardContent>
                  <ScrollArea className='-m-2 h-[125px] border-separate flex-col justify-center border border-primary/50 p-0'>
                    {completedInTimeframe.length > 0 ? (
                      <ul className=''>
                        {completedInTimeframe.map((habit) => {
                          return (
                            <li className='cursor-pointer border border-t-0 p-2 hover:bg-secondary hover:shadow'>
                              <Link href={`/habits/${habit.id}`} passHref>
                                <button className='flex w-full flex-row items-center justify-between'>
                                  <p>{habit.name}</p>
                                  <span className='flex flex-row items-center'>
                                    <Days habit={habit} />
                                    <ChevronRight />
                                  </span>
                                </button>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className='flex-col justify-center p-6'>
                        Nothing yet...
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Habits by Response Rate</CardTitle>
                </CardHeader>
                <CardContent className='-mt-10'>
                  <ResponseRateChart />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Habits by Response Time</CardTitle>
                </CardHeader>
                <CardContent className='-m-2 -my-5'>
                  <ResponseTimeChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
