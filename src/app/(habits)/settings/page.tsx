import * as React from 'react';

import SettingsForm from '@/components/settings/settings-form';
// import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';

export default async function Settings() {
  return (
    <div className='rounded-xl border-0'>
      <div>
        <h1 className='p-5 text-2xl'>Settings</h1>
        <Separator className='-mx-10 my-2 w-[100hw]' />
      </div>
      <div className='grid gap-4'>
        <SettingsForm />
      </div>
    </div>
  );
}
