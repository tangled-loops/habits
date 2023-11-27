import React from 'react';

import { Navigation } from '@/components/navigation';
import { UIProvider } from '@/components/providers/ui';
import { Toaster } from '@/components/ui/toaster';
import { ensureAuth } from '@/server/session';

export default async function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureAuth();
  return (
    <UIProvider>
      <Navigation />
      <main className='mt-[44px] flex flex-col overflow-hidden'>
        {children}
      </main>
      <Toaster />
    </UIProvider>
  );
}
