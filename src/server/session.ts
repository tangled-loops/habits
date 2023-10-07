import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/server/auth';
import { redirect } from 'next/navigation';
import { client } from '@/lib/api';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function getClient() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (!session) redirect('/');
  return client(session);
}
