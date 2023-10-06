'use client';

import clsx from 'clsx';
import React from 'react';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Github } from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem } from './ui/form';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const userAuthFormSchema = z.object({
  email: z.string(),
});

type UserAuthFormValues = z.infer<typeof userAuthFormSchema>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<UserAuthFormValues>({
    resolver: zodResolver(userAuthFormSchema),
    defaultValues: {},
  });

  function onSubmit(data: UserAuthFormValues) {
    signIn('email', { ...data });
  }

  return (
    <div className={clsx('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <div className='grid gap-2'>
            <div className='grid gap-1'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='name@example.com'
                        type='email'
                        autoCapitalize='none'
                        autoComplete='email'
                        autoCorrect='off'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit'>Sign In with Email</Button>
          </div>
        </form>
      </Form>
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
      <Button variant='outline' type='button' onClick={() => signIn('github')}>
        <Github className='mr-2 h-4 w-4' />
        Github
      </Button>
    </div>
  );
}
