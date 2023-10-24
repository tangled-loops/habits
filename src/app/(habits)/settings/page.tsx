import * as React from 'react';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';

export default async function Settings() {
  return (
    <div className='rounded-xl border-0'>
      <div>
        <h1 className='p-5 text-2xl'>Settings</h1>
        <Separator className='-mx-10 my-2 w-[100hw]' />
      </div>
      <div className='grid gap-4'>
        <div className='grid grid-cols-2'>
          <span>Create Form</span>
          <div className='grid gap-4'>
            <div>days input</div>
            <div>Default color in create form</div>
            <div>Default icon in create form</div>
          </div>
        </div>
        <div>Require journal entry when habit is responded to? (toggle)</div>
        <div>Hide sidebar always (toggle)</div>
        <div>
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
