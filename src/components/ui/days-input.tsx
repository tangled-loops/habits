import React from 'react';

import { Day, days } from '@/lib/models/habit';
import { cn } from '@/lib/utils';

import { Badge } from '$/ui/badge';

interface DaysFieldProps {
  className?: string;
  selected: string[];
}

const DaysField = ({ selected, className, ...props }: DaysFieldProps) => {
  return (
    <div
      className={cn('grid cursor-pointer grid-cols-7 gap-0.5', className)}
      {...props}
    >
      {days().map((day, i) => {
        const sday = Day[day];
        const sliceTo = i === (Day.Thursday || Day.Sunday) ? 2 : 1;
        return (
          <Badge
            variant={selected.includes(sday) ? 'secondary' : 'outline'}
            className={cn(
              selected.includes(sday)
                ? 'bg-primary text-background hover:bg-primary/50'
                : 'text-foreground',
              'flex flex-row items-center justify-center',
            )}
          >
            {sday.slice(0, sliceTo)}
          </Badge>
        );
      })}
    </div>
  );
};

interface DaysInputProps {
  className?: string;
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

const DaysInput = ({
  onChange,
  selected,
  className,
  ...props
}: DaysInputProps) => {
  return (
    <div
      className={cn('grid cursor-pointer grid-cols-7 gap-0.5', className)}
      {...props}
    >
      {days().map((day, i) => {
        const sday = Day[day];
        const sliceTo = i === (Day.Thursday || Day.Sunday) ? 2 : 1;
        return (
          <Badge
            variant={selected.includes(sday) ? 'secondary' : 'outline'}
            className={cn(
              selected.includes(sday)
                ? 'bg-primary text-background hover:bg-primary/50'
                : 'text-foreground',
              'flex flex-row items-center justify-center',
            )}
            onClick={() =>
              onChange(
                selected.includes(sday)
                  ? selected.filter((item) => item !== sday)
                  : [...selected, sday],
              )
            }
          >
            {sday.slice(0, sliceTo)}
          </Badge>
        );
      })}
    </div>
  );
};

export { DaysInput, DaysField };
