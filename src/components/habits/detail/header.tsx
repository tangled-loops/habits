import { ChevronLeft, Edit } from 'lucide-react';
import Link from 'next/link';

import { icon } from '../icon';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  backgroundColor,
  Color,
  FrontendHabit,
  Icon,
} from '@/lib/models/habit';
import { cn } from '@/lib/utils';

function Header({ habit }: { habit: FrontendHabit }) {
  return (
    <div className='fixed inset-x-0 top-[45px] border bg-background px-8 py-6 sm:left-[155px] md:left-[200px]'>
      <div className='flex flex-row items-center justify-between'>
        <h2 className='flex flex-row items-center text-xl font-normal'>
          <Link href={`/habits?page=1`} passHref className='-mx-6'>
            <Button variant='ghostPrimary'>
              <ChevronLeft className='mr-0' />
              Back
            </Button>
          </Link>
          <div className='mx-8'>
            <div className='flex flex-row space-x-6'>
              {icon(habit.icon as Icon, habit.color as Color)}
              {habit.name}
            </div>
            <Separator
              className={cn(
                habit.icon.length > 0 ? 'ml-10' : '',
                backgroundColor(habit.color as Color),
              )}
            />
          </div>
        </h2>
        <Link href={`/habits/${habit.id}?edit=true&id=${habit.id}`} passHref>
          <Button variant='ghostPrimary'>
            <Edit className='mr-2' />
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
}

export { Header };
