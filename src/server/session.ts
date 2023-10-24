import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

import { client } from '@/lib/api';
import { authOptions } from '@/server/auth';

export async function ensureAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
}

export async function getCurrentUser() {
  const api = await getClient()
  return api.users.findBy({});
}

export async function getClient() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  return client(session);
}
