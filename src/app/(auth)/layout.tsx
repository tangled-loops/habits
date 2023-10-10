import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';

import { ThemeProvider } from '$/providers/theme';
import { Toaster } from '$/ui/toaster';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Habits',
  description: 'Tracking all the Habits',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
