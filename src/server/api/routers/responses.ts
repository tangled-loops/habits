import { and, eq, gt, sql } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { responses } from '~/db/schema';
import * as z from 'zod';

export const responsesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(responses).values({ habitId: input.habitId });
    }),
  since: protectedProcedure
    .input(z.object({ habitId: z.string(), since: z.date(), }))
    .query(async ({ ctx: { db, }, input: { habitId, since, } }) => {
      const result = await db.select({ count: sql<number>`count(*)` })
        .from(responses)
        .where(and(eq(responses.habitId, habitId), gt(responses.createdAt, since)))
        .groupBy(responses.habitId)
      if (!result) return { responses: 0 }
      return { responses: result[0].count }
    }),
})