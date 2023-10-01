import Link from 'next/link';

import { UserAuthForm } from '@/components/user-auth-form';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getCsrfToken, getProviders, useSession } from 'next-auth/react';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default async function Login() {
  const session = await getServerSession();
  const providers = await getProviders();
  const csrf = await getCsrfToken();
  // console.log(providers)
  if (session) {
    redirect('/');
  }
  if (!providers || !csrf) {
    throw new Error('Issue!!!');
  }
  return (
    <>
      <div className='container relative h-[800px] flex-col items-center justify-center grid'>
        <div className='p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-center'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Login or Create Account
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your email below to create your account
              </p>
            </div>
            <UserAuthForm providers={providers} csrf={csrf} />
            <p className='px-8 text-center text-sm text-muted-foreground'>
              By clicking continue, you agree to our{' '}
              <Link
                href='/terms'
                className='underline underline-offset-4 hover:text-primary'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy'
                className='underline underline-offset-4 hover:text-primary'
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
