import { and, desc, eq, gt, lt, or, sql } from 'drizzle-orm';
import z from 'zod';

import { HasDB } from '.';

import { habits, responses } from '@/server/db/schema';

export type Response = typeof responses.$inferSelect;

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
  userId: string;
}

export async function add({ db, habitId, userId }: AddOptions) {
  await db.insert(responses).values({ habitId, userId });
  const habit = await db.query.habits.findFirst({
    where: eq(habits.id, habitId),
  });
  if (!habit) return;
  await db
    .update(habits)
    .set({
      totalResponseCount: habit.totalResponseCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(habits.id, habitId));
}

export const frequencyBySchema = z.object({
  habitId: z.string(),
  since: z.date().optional(),
  frequency: z.string().optional(),
});
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

export async function find({ db, habitId }: HasDB & { habitId: string }) {
  return await db
    .select()
    .from(responses)
    .where(eq(responses.habitId, habitId))
    .orderBy(desc(responses.createdAt));
}

export async function findGrouped({
  db,
  habitId,
}: HasDB & { habitId: string }) {
  const result = await find({ db, habitId });
  return result.reduce((p: Record<string, Response[]>, n) => {
    const date = new Date(n.createdAt.toISOString()).toLocaleDateString();
    const entry = p[date];
    if (entry) {
      p[date].push(n);
      return p;
    }
    p[date] = [n];
    return p;
  }, {});
}

export async function findAll({
  db,
  userId,
  limit,
}: HasDB & { userId: string; limit: number }) {
  return await db
    .select()
    .from(responses)
    .where(eq(responses.userId, userId))
    .orderBy(desc(responses.createdAt))
    .limit(limit);
}

export interface FrontendResponse {
  id: string;
  name: string;
  createdAt: Date;
}

export async function findAllFrontend({
  db,
  userId,
  limit,
}: HasDB & { userId: string; limit: number }): Promise<FrontendResponse[]> {
  const result = await db
    .select({
      id: responses.id,
      name: habits.name,
      createdAt: responses.createdAt,
    })
    .from(responses)
    .where(eq(responses.userId, userId))
    .innerJoin(habits, eq(habits.id, responses.habitId))
    .orderBy(desc(responses.createdAt))
    .limit(limit);
  return result as FrontendResponse[]
}
