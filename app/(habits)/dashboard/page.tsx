import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { authOptions } from '@/server/auth';
import { getServerSession } from 'next-auth';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className='shadow border-1 rounded-xl'>
        <h1 className='p-5 text-2xl text-center'>Recent Updates</h1>
        <Separator className='w-[20%] ml-[40%] my-3' />
        <div className='grid grid-cols-1 gap-4 p-4'>
          <Card className=''>
            <CardHeader>
              <CardTitle>Habits</CardTitle>
              <CardDescription>
                Never put off what can be done today.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Most recently tracked Habits.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px]'>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Performed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key={1}>
                    <TableCell className='font-medium'>Brush Teeth</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className='flex justify-end'>
              <Button>View Habits</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
