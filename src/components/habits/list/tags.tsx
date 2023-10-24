import { Tag } from 'lucide-react';

import { HasColors, HasHabit } from './types';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Color, colorCss } from '@/lib/models/habit';
import { cn } from '@/lib/utils';

function Tags({ habit, className }: HasHabit & { className?: string }) {
  const colors = colorCss(habit.color as Color);
  return (
    <div
      className={cn(
        'h-[40px]',
        'mb-2 flex-1 flex-row items-center space-x-2 space-y-2 pb-4',
        className,
      )}
    >
      {habit.tags &&
        habit.tags.map((tag) => {
          return (
            <Badge
              key={tag}
              className={cn('text-white', colors.background, colors.hover)}
            >
              {tag}
            </Badge>
          );
        })}
    </div>
  );
}

const TagsAccordianItem = ({ habit, colors }: HasHabit & HasColors) => {
  if (habit.tags.length === 0) return null;
  return (
    <AccordionItem value='item-1'>
      {habit.tags.length > 4 ? (
        <>
          <AccordionTrigger>
            <div className='flex flex-row items-center'>
              <Tag className={cn('mr-2', colors.text)} />
              Tags ({habit.tags.length})
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Tags habit={habit} />
          </AccordionContent>
        </>
      ) : (
        <div className='flex flex-col justify-center py-4'>
          <div className='flex flex-row items-center'>
            <Tag className={cn('mr-2', colors.text)} />
            <Tags habit={habit} className='-mb-4 ml-4 space-y-0' />
          </div>
        </div>
      )}
    </AccordionItem>
  );
};

export { Tags, TagsAccordianItem };
