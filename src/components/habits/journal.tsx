import { BookOpen } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Table, TableCell, TableRow } from '../ui/table';

export function Journal() {
  return (
    <div className='space-8 mx-8 -mt-5 grid h-full grid-cols-1 gap-4 p-4'>
      <Card className='h-[300px]'>
        <CardHeader>
          <CardTitle className='flex flex-row items-center justify-between'>
            Journal
            <Button>
              <BookOpen className='mr-2' />
              Write
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableRow>
              <TableCell>Hello</TableCell>
              <TableCell>Something something</TableCell>
            </TableRow>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
