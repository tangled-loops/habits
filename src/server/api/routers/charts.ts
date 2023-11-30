import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

import { habits, responses } from '@/server/db/schema';

export const chartsRouter = createTRPCRouter({
  byResponseTime: protectedProcedure.query(async ({ ctx: { db, session } }) => {
    const allResponses = await db
      .select({
        habit: habits.name,
        createdAt: responses.createdAt,
      })
      .from(responses)
      .innerJoin(habits, eq(habits.id, responses.habitId))
      .where(eq(responses.userId, session.user.id));

    return allResponses.map((response) => {
      return {
        habit: response.habit,
        respondedAt: response.createdAt.getHours(),
      };
    });
  }),
  byResponseRate: protectedProcedure.query(async ({ ctx: { db } }) => {
    const rateResponse = z.object({
      habit: z.string(),
      responseRate: z.coerce.number(),
    });
    const schema = z.array(rateResponse);
    const result = await db
      .select({
        habit: habits.name,
        responded: sql`count(habits.name) as responded`,
        goal: sql<number>`max(habits.goal) as goal`,
        responseRate: sql<number>`round((count(habits.name)::numeric(30, 20) / max(habits.goal)::numeric(30, 20)), 2) as percent`,
        doy: sql<number>`extract(DOY from responses.created_at) as doy`,
        year: sql<number>`extract(YEAR from responses.created_at) as year`,
      })
      .from(responses)
      .leftJoin(habits, eq(habits.id, responses.habitId))
      .groupBy(sql`doy, year, habits.name`)
      .orderBy(sql`doy`);
    return schema.parse(result);
  }),
});

