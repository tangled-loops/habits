import { and, desc, eq, gt, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { responses } from '@/server/db/schema';

import * as schema from '~/db/schema';

interface DateSinceOptions {
  frequency?: string;
  since?: Date;
  at?: string;
}

export function dateSinceBy({ frequency, since, at }: DateSinceOptions) {
  if (!frequency && !since) {
    throw new Error('Need frequency or since');
  }
  const timeOfDay = at ?? 'start-of-day'
  const timeString = timeOfDay === 'start-of-day' ? '00:00' : '23:59'
  let date: Date = new Date();
  if (frequency && !since) {
    const today = new Date();
    switch (frequency) {
      case 'Daily': {
        date = new Date(`${today.toDateString()} ${timeString}`);
        break;
      }
      case 'Weekly': {
        const startOfWeek = new Date(today.getDate() - today.getDay() - 6); // check that this is correct :)
        date = new Date(`${startOfWeek.toDateString()} ${timeString}`)
        break;
      }
    }
  }
  if (since && !frequency) date = since;
  return date;
}

interface ResponseSinceOptions extends DateSinceOptions {
  db: PostgresJsDatabase<typeof schema>;
  habitId: string;
}

export async function responsesSince({
  db,
  habitId,
  frequency,
  since,
}: ResponseSinceOptions) {
  const date = dateSinceBy({ frequency, since });
  return await db
    .select()
    .from(responses)
    .where(and(eq(responses.habitId, habitId), gt(responses.createdAt, date)))
    // eslint-disable-next-line no-undef
    .orderBy(desc(responses.createdAt));
}

export async function responseCountSince({
  db,
  habitId,
  frequency,
  since,
}: ResponseSinceOptions) {
  const date = dateSinceBy({ frequency, since });
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(responses)
    .where(and(eq(responses.habitId, habitId), gt(responses.createdAt, date)))
    .groupBy(responses.habitId);
  if (!result || result.length === 0) return 0;
  return result[0].count;
}
