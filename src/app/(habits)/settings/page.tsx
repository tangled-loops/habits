import * as React from 'react';

import SettingsForm from '@/components/settings/settings-form';

export default async function Settings() {
  return (
    <div className='ml-[85px] rounded-xl border-0'>
      <div className='h-[63px] border-b'>
        <h1 className='p-5 text-2xl'>Settings</h1>
      </div>
      <div className='container grid gap-4'>
        <SettingsForm />
      </div>
    </div>
  );
}
