import { and, desc, eq, gt, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { responses } from '@/server/db/schema';

import * as schema from '~/db/schema';


export async function responsesSince(
  db: NodePgDatabase<typeof schema>,
  habitId: string,
  frequency: string | undefined,
  since?: Date | undefined,
) {
  if (!frequency && !since) {
    throw new Error('Need frequency or since');
  }

  let date: Date = new Date();
  if (frequency && !since) {
    const today = new Date();
    switch (frequency) {
      case 'Daily': {
        date = new Date(`${today.toDateString()} 00:00`);
        break;
      }
      case 'Weekly': {
        date = new Date(today.getDate() - today.getDay()); // check that this is correct :)
        break;
      }
    }
  }
  if (since && !frequency) date = since

  return await db
    .select()
    .from(responses)
    .where(and(eq(responses.habitId, habitId), gt(responses.createdAt, date)))
    // eslint-disable-next-line no-undef
    .orderBy(desc(responses.createdAt))
}

export async function responseCountSince(
  db: NodePgDatabase<typeof schema>,
  habitId: string,
  frequency: string | undefined,
  since?: Date | undefined,
) {
  if (!frequency && !since) {
    throw new Error('Need frequency or since');
  }
  let date: Date = new Date();
  if (frequency && !since) {
    const today = new Date();
    switch (frequency) {
      case 'Daily': {
        date = new Date(`${today.toDateString()} 00:00`);
        break;
      }
      case 'Weekly': {
        date = new Date(today.getDate() - today.getDay()); // check that this is correct :)
        break;
      }
    }
  }
  if (since && !frequency) date = since

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(responses)
    .where(and(eq(responses.habitId, habitId), gt(responses.createdAt, date)))
    .groupBy(responses.habitId);
  if (!result || result.length === 0) return 0;
  return result[0].count ;
}
