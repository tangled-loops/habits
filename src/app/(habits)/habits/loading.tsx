import { Menubar } from '@/components/ui/menubar';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <>
      <div className='flex max-h-screen min-h-full flex-col'>
        <div className='fixed inset-x-0 top-[45px] border bg-background px-8 py-6 sm:left-[155px] md:left-[200px]'>
          <div className='flex flex-row items-center justify-between'>
            <h2 className='flex flex-row items-center text-xl font-normal'>
              <div className='mx-8'>
                <div className='flex flex-row space-x-6'>Habit Tracker</div>
              </div>
            </h2>
          </div>
        </div>
        <Menubar className='-mx-5 flex flex-row justify-start border-0 border-b'>
          <div className='flex flex-row'></div>
        </Menubar>
      </div>
      <Skeleton />
    </>
  );
}
