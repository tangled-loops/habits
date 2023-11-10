import { Badge } from '../ui/badge';

import { FrontendResponse } from '@/lib/models/response';

export function date(item: { createdAt: Date }) {
  return new Date(
    item.createdAt.toISOString().replaceAll('T', ' ').replaceAll('Z', ''),
  ).toLocaleDateString();
}

export function time(item: { createdAt: Date }) {
  const locTime = new Date(
    item.createdAt.toISOString().replaceAll('T', ' ').replaceAll('Z', ''),
  ).toLocaleTimeString();
  const parts = locTime.split(' ');
  const type = parts[1];
  const restNoSec = parts[0]
    .split(':')
    .filter((_x, i, r) => i < r.length - 1)
    .join(':');
  return `${restNoSec} ${type}`;
}

export function RecentActivityItem({
  response,
}: {
  response: FrontendResponse;
}) {
  return (
    <li className='border border-t-0 p-2 hover:bg-secondary hover:shadow'>
      <div className='flex w-full flex-row justify-between'>
        <div className='flex flex-row space-x-2'>
          <Badge variant={'outline'} className='text-primary'>
            <p>+1</p>
          </Badge>
          <p className='text-sm'>{response.name}</p>
        </div>
        <p className='text-sm'>
          <span>{date(response)}</span>
          {'  '}
          <span>{time(response)}</span>
        </p>
      </div>
    </li>
  );
}
