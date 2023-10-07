import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { ThemeProvider } from '@/components/providers/theme';
import { Toaster } from '@/components/ui/toaster';

import '@/styles/globals.css';

import Navigation from '@/components/navigation';
import { TrpcProvider } from '@/components/providers/trpc';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habits',
  description: 'Tracking all the Habits',
};

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <TrpcProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='light'
            enableSystem
            disableTransitionOnChange
          >
            <Navigation />
            <main className='mt-[44px] flex flex-col overflow-hidden p-8 sm:ml-[150px] md:ml-[200px]'>
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
