import React from 'react';

import Navigation from '@/components/navigation';
import { Toaster } from '@/components/ui/toaster';
import { ensureAuth } from '@/server/session';

export default async function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureAuth();
  return (
    <>
      <Navigation />
      <main className='mt-[44px] flex flex-col overflow-hidden p-4 sm:ml-[150px] md:ml-[200px]'>
        {children}
      </main>
      <Toaster />
    </>
  );
}
