import { and, desc, eq, gt, lt, or, sql } from 'drizzle-orm';

import { HasDB } from '.';

import { habits, responses } from '@/server/db/schema';
import z from 'zod';

export type Response = typeof responses.$inferSelect

interface DateSinceOptions {
  frequency?: string;
  since?: Date;
  at?: string;
}

type DateSinceHasDBOptions = DateSinceOptions & HasDB;

export function dateSinceBy({ frequency, since, at }: DateSinceOptions) {
  if (!frequency && !since) {
    throw new Error('Need frequency or since');
  }
  if (since && !frequency) return since;

  const timeOfDay = at ?? 'start-of-day';
  const timeString = timeOfDay === 'start-of-day' ? '00:00' : '23:59';
  let date: Date = new Date();
  if (frequency && !since) {
    const today = new Date();
    switch (frequency) {
      case 'Daily': {
        date = new Date(`${today.toLocaleDateString()} ${timeString}`);
        break;
      }
      case 'Weekly': {
        const startOfWeek = new Date(today.getDate() - today.getDay() - 6); // check that this is correct :)
        date = new Date(`${startOfWeek.toLocaleDateString()} ${timeString}`);
        break;
      }
    }
  }
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

export async function habitsBoundedByGoal({
  db,
  type,
}: { type: 'above' | 'below' | 'equal' } & HasDB) {
  const { daily, weekly } = makeStartEndQuery();
  const result = await db
    .select({
      habitId: responses.habitId,
      count: sql<number>`count(responses)`,
      goal: sql<number>`max(habits.goal) as goal`,
    })
    .from(responses)
    .innerJoin(habits, eq(habits.id, responses.habitId))
    .where(or(daily, weekly))
    .orderBy(sql`goal`)
    .groupBy(responses.habitId);
  console.log(result)
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

interface AddOptions extends HasDB {
  habitId: string;
}

export async function add({ db, habitId }: AddOptions) {
  await db.insert(responses).values({ habitId: habitId });
  const habit = await db.query.habits.findFirst({
    where: eq(habits.id, habitId),
  });
  if (!habit) return;
  await db
    .update(habits)
    .set({ responseCount: habit.responseCount + 1, updatedAt: new Date() });
}

export const frequencyBySchema = z.object({
  habitId: z.string(),
  since: z.date().optional(),
  frequency: z.string().optional(),
})
export interface FrequencyByOptions<T> {
  since?: Date;
  frequency?: string;
  callbacks: {
    since: () => T;
    frequency: () => T;
    error?: () => void;
  };
}

export async function frequencyBy<T>({
  since,
  frequency,
  callbacks,
}: FrequencyByOptions<T>) {
  if (!since && frequency) {
    return callbacks.frequency?.();
  }
  if (!since) {
    if (callbacks.error) {
      callbacks.error?.();
      return;
    }
    throw new Error('need frequency if no since date is provided');
  }
  return callbacks.since?.();
}
