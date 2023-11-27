import { Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Separator } from '$/ui/separator';

export default function Loading() {
  return (
    <div className='ml-[85px] border-0'>
      <div className='flex flex-row items-center'>
        <h1 className='h-[62px] p-4 text-2xl'>Dashboard</h1>
        <Separator className='-mx-10 mt-2 w-[100hw]' />
      </div>
      <div className='h-[85vh] '>
        <div className='grid grid-cols-1 gap-4 p-4'>
          <div className='grid gap-4 sm:grid-cols-1 lg:grid-cols-3'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className='-m-2'>
                <div className='flex flex-row justify-center border border-primary p-8'>
                  <Loader2 className='animate-spin' />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Needs Response</CardTitle>
              </CardHeader>
              <CardContent className='-m-2'>
                <div className='flex flex-row justify-center border border-primary p-8'>
                  <Loader2 className='animate-spin' />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Completed In Timeframe</CardTitle>
              </CardHeader>
              <CardContent className='-m-2'>
                <div className='flex flex-row justify-center border border-primary p-8'>
                  <Loader2 className='animate-spin' />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Habits by Response Rate</CardTitle>
              </CardHeader>
              <CardContent className='flex min-h-[250px] flex-col justify-center'>
                <div className='flex h-full flex-row justify-center border border-primary p-24'>
                  <Loader2 className='animate-spin' />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Habits by Response Time</CardTitle>
              </CardHeader>
              <CardContent className='flex min-h-[250px] flex-col justify-center'>
                <div className='flex h-full flex-row justify-center border border-primary p-24'>
                  <Loader2 className='animate-spin' />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
