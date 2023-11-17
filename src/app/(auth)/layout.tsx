import React from 'react';

import { Toaster } from '$/ui/toaster';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
      <Toaster />
    </main>
  );
}
