'use client';

import { Github, Loader } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import clsx from 'clsx';
import React from 'react';
import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  csrf: string;
}

export function UserAuthForm({
  providers,
  csrf,
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // async function onSubmit(event: React.SyntheticEvent) {
  //   event.preventDefault()
  //   setIsLoading(true)
  //   setTimeout(() => {
  //     setIsLoading(false)
  //   }, 3000)
  // }

  console.log(providers.email.signinUrl);
  return (
    <div className={clsx('grid gap-6', className)} {...props}>
      <form action={providers.email.signinUrl} method='POST'>
        <input type='hidden' name='csrfToken' value={csrf} />
        <input
          type='hidden'
          name='callbackUrl'
          value={providers.email.callbackUrl}
        />
        <div className='grid gap-2'>
          <div className='grid gap-1'>
            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              name='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
            />
          </div>
          <Button type='submit' disabled={isLoading}>
            {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Sign In with Email
          </Button>
        </div>
      </form>
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant='outline'
        type='button'
        disabled={isLoading}
        onClick={() => signIn('github')}
      >
        {isLoading ? (
          <Loader className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Github className='mr-2 h-4 w-4' />
        )}{' '}
        Github
      </Button>
    </div>
  );
}
