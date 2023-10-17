'use client';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { Filter, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Select, SelectContent, SelectTrigger } from '../ui/select';

import { SelectItem, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { Button } from '$/ui/button';

export function MenuSelect({
  paramKey,
  value,
  options,
}: {
  paramKey: string;
  value?: string;
  options: { key: string; title: string }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleValue = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    let shouldRefresh = false;
    if (newValue === params.get(paramKey)) {
      params.delete(paramKey);
      shouldRefresh = true;
    } else {
      params.set(paramKey, newValue);
    }
    router.replace(`/habits?${params.toString()}`);
    if (shouldRefresh) router.refresh();
  };
  return (
    <div className='space-x-0.25 flex flex-row items-center'>
      <Select onValueChange={handleValue}>
        <SelectTrigger
          className={cn(
            value === searchParams.get(paramKey) && 'text-primary',
            'mr-0.5 border-0 p-2',
          )}
        >
          <SelectValue>
            <Filter className='mr-2' />
            {value && options.find((fil) => fil.key === value)?.title}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((filtr) => {
            return (
              <SelectItem id={filtr.key} value={filtr.key} className='mr-2'>
                {filtr.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {value && value.length > 0 && (
        <Button
          className='z-50 bg-white text-destructive'
          size='sm'
          variant='outline'
          onClick={() => handleValue(value ?? '')}
        >
          <XCircle />
          <span className='sr-only'>Remove Filter</span>
        </Button>
      )}
    </div>
  );
}
