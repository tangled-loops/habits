import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '~/session';

import { UserAuthForm } from '$/user-auth-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default async function Login() {
  const user = await getCurrentUser();
  if (user) redirect('/');

  return (
    <>
      <div className='container relative grid h-[800px] flex-col items-center justify-center'>
        <div className='p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Login or Create Account
              </h1>
              <p className='text-muted-foreground text-sm'>
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm />
            <p className='text-muted-foreground px-8 text-center text-sm'>
              By clicking continue, you agree to our{' '}
              <Link
                href='/terms'
                className='hover:text-primary underline underline-offset-4'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='hover:text-primary underline underline-offset-4'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
