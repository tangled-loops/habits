import { HabitList } from '@/components/dashboard/habit-list';
import {
  date,
  RecentActivityItem,
  time,
} from '@/components/dashboard/recent-activity-item';
import { ResponseRateChart } from '@/components/dashboard/response-rate-chart';
import { ResponseTimeChart } from '@/components/dashboard/response-time-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FrontendHabit } from '@/lib/models/habit';
import { FrontendResponse } from '@/lib/models/response';
import { getClient } from '@/server/session';

import { Separator } from '$/ui/separator';

async function RecentActivityCard({
  responses,
}: {
  responses: FrontendResponse[];
}) {
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
              {responses.map((response) => (
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
              ))}
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

async function NeedsResponseCard({ habits }: { habits: FrontendHabit[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Needs Response</CardTitle>
        <Separator className='bg-primary/50' />
      </CardHeader>
      <CardContent>
        <HabitList habits={habits} />
      </CardContent>
    </Card>
  );
}

function CompletedInTimeframeCard({ habits }: { habits: FrontendHabit[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed in Timeframe</CardTitle>
        <Separator className='bg-primary/50' />
      </CardHeader>
      <CardContent>
        <HabitList habits={habits} />
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
    <div className='border-0'>
      <div>
        <h1 className='p-4 text-2xl'>Dashboard</h1>
        <Separator className='-mx-10 mt-2 w-[100hw]' />
      </div>
      <ScrollArea className='h-[85vh] '>
        <div className='grid grid-cols-1 gap-4 p-4'>
          <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
            <RecentActivityCard responses={recentActivity} />
            <NeedsResponseCard habits={needsResponse} />
            <CompletedInTimeframeCard habits={completedInTimeframe} />
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
  );
}
