'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

import { Input } from '../ui/input';

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  return (
    <Input
      className='w-[40%] border-0 hover:border-0'
      placeholder='Search...'
      onChange={(event) => {
        router.push(
          pathname + '?' + createQueryString('search', event.target.value),
        );
      }}
    />
  );
}
