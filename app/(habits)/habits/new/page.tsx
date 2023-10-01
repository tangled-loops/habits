import { Form } from '@/components/habits';
import { db } from '@/server/db';
import { habits, users } from '@/server/db/schema';
import { getCurrentUser } from '@/server/session';
import { sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

export default async function HabitsNew() {
  return <Form />;
}
