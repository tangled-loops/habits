'use client';

import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { Filter, SortAsc, SortDesc, Tag, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ReactElement } from 'react';

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
  const handleValue = (newValue?: string) => {
    const params = new URLSearchParams(searchParams);

    if (newValue === params.get(paramKey) || newValue === '') {
      params.delete(paramKey);
    } else if (newValue) {
      params.set(paramKey, newValue);
    } else {
      params.delete(paramKey);
    }

    router.replace(`/habits?${params.toString()}`);
    router.refresh();
  };
  return (
    <div className='space-x-0.25 flex flex-row items-center bg-transparent'>
      <Select
        value={searchParams.get(paramKey) ?? ''}
        onValueChange={handleValue}
        defaultValue={searchParams.get(paramKey) ?? ''}
      >
        <SelectTrigger
          className={cn(
            value === searchParams.get(paramKey) && 'text-primary',
            'mr-0.5 border-0 p-2',
          )}
        >
          {paramKey === 'filter' ? (
            <Filter className='mr-2 h-5 w-5' />
          ) : paramKey === 'sort' ? (
            <SortDesc className='mr-2 h-5 w-5' />
          ) : (
            <Tag className='mr-2 h-5 w-5' />
          )}
          <SelectValue>
            {value && options.find((fil) => fil.key === value)?.title}
            {!value && ''}
          </SelectValue>
        </SelectTrigger>
        {value && value.length > 0 && (
          <Button
            className='z-50 bg-transparent text-destructive'
            size='sm'
            variant='ghost'
            onClick={() => handleValue(undefined)}
          >
            <XCircle className='h-5 w-5' />
            <span className='sr-only'>Remove Filter</span>
          </Button>
        )}
        <SelectContent>
          {options.map((filtr) => {
            return (
              <SelectItem
                key={filtr.key}
                id={filtr.key}
                value={filtr.key}
                className='mr-2'
              >
                {filtr.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
