import { Button } from '$/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '$/ui/card';
import { Separator } from '$/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '$/ui/table';

export default async function Dashboard() {
  return (
    <>
      <div className='border-1 rounded-xl shadow'>
        <h1 className='p-5 text-center text-2xl'>Recent Updates</h1>
        <Separator className='my-3 ml-[40%] w-[20%]' />
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
