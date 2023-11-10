import { Header } from './page';

import { Menubar } from '@/components/ui/menubar';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className='flex max-h-screen min-h-full flex-col'>
      <Header />
      <Menubar className='-mx-5 flex flex-row justify-start border-0 border-b' />
      <div className='absolute bottom-0 -mx-4 h-[80vh] md:-mx-2 lg:-mx-4'>
        <div className='px-8 py-2 pb-[200px]'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <div className='h-[200px]'>
              <Skeleton className='bg-secondary' />
            </div>
            <div className='h-[200px]'>
              <Skeleton className='bg-secondary' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
