import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { ThemeProvider } from '@/components/providers/theme';

import '@/styles/globals.css';

import { TrpcProvider } from '@/components/providers/trpc';
import { cn } from '@/lib/utils';
import { ensureAuth } from '@/server/session';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habits',
  description: 'Tracking all the Habits',
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureAuth();
  return (
    <html lang='en'>
      <body className={cn(inter.className, 'overflow-hidden')}>
        <TrpcProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
          </ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
