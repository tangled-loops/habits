import { and, desc, eq, gt, lt, or, sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import { habits, responses } from '@/server/db/schema';

import * as schema from '~/db/schema';

interface DateSinceOptions {
  frequency?: string;
  since?: Date;
  at?: string;
}

interface HasDB {
  db: PostgresJsDatabase<typeof schema>;
}

type DateSinceHasDBOptions = DateSinceOptions & HasDB;

export function dateSinceBy({ frequency, since, at }: DateSinceOptions) {
  if (!frequency && !since) {
    throw new Error('Need frequency or since');
  }
  const timeOfDay = at ?? 'start-of-day';
  const timeString = timeOfDay === 'start-of-day' ? '00:00' : '23:59';
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
        date = new Date(`${startOfWeek.toDateString()} ${timeString}`);
        break;
      }
    }
  }
  if (since && !frequency) date = since;
  return date;
}

interface ResponseSinceOptions extends DateSinceHasDBOptions {
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

function makeStartEndQuery() {
  const startOfDay = dateSinceBy({ frequency: 'Daily', at: 'start-of-day' });
  const endOfDay = dateSinceBy({ frequency: 'Daily', at: 'end-of-day' });
  const daily = and(
    gt(responses.createdAt, startOfDay),
    lt(responses.createdAt, endOfDay),
    eq(habits.frequency, 'Daily'),
  );
  const startOfWeek = dateSinceBy({ frequency: 'Daily', at: 'start-of-week' });
  const endOfWeek = dateSinceBy({ frequency: 'Daily', at: 'end-of-week' });
  const weekly = and(
    gt(responses.createdAt, startOfWeek),
    lt(responses.createdAt, endOfWeek),
    eq(habits.frequency, 'Weekly'),
  );
  return { daily, weekly };
}

export async function responseCounts({ db }: HasDB) {
  const { daily, weekly } = makeStartEndQuery();
  const result = await db
    .select({
      habitId: responses.habitId,
      count: sql<number>`count(*)`,
    })
    .from(responses)
    .innerJoin(habits, eq(habits.id, responses.habitId))
    .where(or(daily, weekly))
    .groupBy(habits.id, responses.habitId);
  return result.reduce((pre: Record<string, number>, nxt) => {
    pre[nxt.habitId] = Number(nxt.count);
    return pre;
  }, {});
}

/**
 * @todo make this variable if needed so over goal or under goal etc
 */
export async function habitsBoundedByGoal({
  db,
  type,
}: { type: 'above' | 'below' | 'equal' } & HasDB) {
  const { daily, weekly } = makeStartEndQuery();
  const result = await db
    .select({
      habitId: responses.habitId,
      count: sql<number>`count(*)`,
      goal: habits.goal,
    })
    .from(responses)
    .innerJoin(habits, eq(habits.id, responses.habitId))
    .where(or(daily, weekly))
    .groupBy(habits.goal, responses.habitId);
  return result.reduce((pre: Array<string>, nxt) => {
    switch (type) {
      case 'above':
        if (Number(nxt.count) >= nxt.goal) pre.push(nxt.habitId);
        break;
      case 'below':
        if (Number(nxt.count) < nxt.goal) pre.push(nxt.habitId);
        break;
      case 'equal':
        if (Number(nxt.count) === nxt.goal) pre.push(nxt.habitId);
        break;
    }

    return pre;
  }, []);
}
