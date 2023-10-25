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
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader>
                <CardTitle>Priority Today</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Priority Today</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Priority Today</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Priority Today</CardTitle>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                This should be a list of updates that have happened recently
                maybe we should make a separate table to keep a timeline of
                changes, or could show recently updated / created. I think try
                the timeline thing and see if it works out, what else is the
                point of this project except trying things that may not work
                well to learn from it.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Priority Today</CardTitle>
              </CardHeader>
              <CardContent>
                I guess show all the habits that need responses either because
                the day is selected, or because it hasnt been responded to this
                week.
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
