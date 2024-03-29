import { ChevronLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';

import { icon } from '../icon';

import { UIContext } from '@/components/providers/ui';
import { Button } from '@/components/ui/button';
import { borderColor, Color, FrontendHabit, Icon } from '@/lib/models/habit';
import { cn } from '@/lib/utils';

function Header({ habit }: { habit: FrontendHabit }) {
  const { sidebarMargin } = useContext(UIContext);
  return (
    <div
      className={cn(
        'absolute inset-0 z-50 h-[64px] border border-t-primary',
        'bg-background px-8 py-6',
        sidebarMargin,
        borderColor(habit.color as Color),
      )}
    >
      <div className='flex h-full flex-row items-center justify-between'>
        <h2 className='flex flex-row items-center whitespace-nowrap text-sm font-normal md:text-xl lg:text-2xl'>
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
