import { Chart } from '@/components/dashboard/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Separator } from '$/ui/separator';

export default async function Dashboard() {
  return (
    <>
      <div className='rounded-xl border-0'>
        <div>
          <h1 className='p-5 text-2xl'>Dashboard</h1>
          <Separator className='-mx-10 my-2 w-[100hw]' />
        </div>
        <div className='grid grid-cols-1 gap-4 p-4'>
          <div className='grid min-h-[200px] gap-4 sm:grid-cols-1 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex-col justify-center p-6'>
                  Inspirational quote about doing things, and how you haven
                  {"'"}t been
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Needs Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex-col justify-center p-6'>
                  There{"'"}s nothing here, track some habits.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completed in Timeframe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex-col justify-center p-6'>
                  Nothing yet...
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Habits by Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Habits by Response Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
