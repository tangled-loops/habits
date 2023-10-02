import Navigation from '@/components/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className='sm:ml-[150px] md:ml-[200px] mt-[44px] p-8 flex flex-col overflow-hidden'>
        {children}
      </main>
    </>
  );
}
