import React from 'react';

import { abbrev, Day, days } from '@/lib/models/habit';
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
      {days().map((day) => {
        const sday = Day[day];
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
            {abbrev(sday)}
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
      {days().map((day) => {
        const sday = Day[day];
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
            {abbrev(sday)}
          </Badge>
        );
      })}
    </div>
  );
};

export { DaysInput, DaysField };
