/**
 * @see https://github.com/shadcn-ui/ui/issues/66
 */
import { Check, ChevronsUpDown, X } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type OptionType = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: OptionType[];
  selected: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
  className?: string;
  onEmpty?: (
    // eslint-disable-next-line no-unused-vars
    value: string,
    // eslint-disable-next-line no-unused-vars
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactElement;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  className,
  onEmpty,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const handleUnselect = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={`w-full justify-between ${
            selected.length > 1 ? 'h-[70%]' : 'h-9'
          }`}
          onClick={() => setOpen(!open)}
        >
          <div className='flex flex-row flex-wrap gap-1'>
            {selected.map((item) => (
              <Badge
                variant='secondary'
                key={item}
                className='mb-1 mr-1'
                onClick={() => handleUnselect(item)}
              >
                {item}
                <button
                  className='ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(item);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(item)}
                >
                  <X className='text-muted-foreground hover:text-foreground h-3 w-3' />
                </button>
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className='h-3 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command className={className}>
          <CommandInput
            onValueChange={(value) => setValue(value)}
            placeholder='Search ...'
          />
          <CommandEmpty>
            {onEmpty ? onEmpty(value, setOpen) : 'No item found.'}
          </CommandEmpty>
          <CommandGroup className='max-h-64 overflow-auto'>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value],
                  );
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selected.includes(option.value)
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
