import { eq } from 'drizzle-orm';
import * as z from 'zod';

import { responseCountSince, responsesSince } from '@/lib/models/response';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { habits, responses } from '~/db/schema';

export const responsesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(responses).values({ habitId: input.habitId });
      const habit = await ctx.db.query.habits.findFirst({
        where: eq(habits.id, input.habitId),
      });
      if (!habit) return
      await ctx.db
        .update(habits)
        .set({ responseCount: habit.responseCount + 1 });
    }),
  since: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        since: z.date().optional(),
        frequency: z.string().optional(),
      }),
    )
    .query(async ({ ctx: { db }, input: { habitId, since, frequency } }) => {
      if (!since && frequency) {
        return await responsesSince({ db, habitId, frequency });
      }

      if (!since) {
        throw new Error('need frequency if no since date is provided');
      }

      return responsesSince({ db, habitId, since });
    }),
  allTimeCount: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ ctx: { db }, input: { habitId } }) => {
      
    }),
  countSince: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        since: z.date().optional(),
        frequency: z.string().optional(),
      }),
    )
    .query(async ({ ctx: { db }, input: { habitId, since, frequency } }) => {
      if (!since && frequency) {
        return await responseCountSince({ db, habitId, frequency });
      }

      if (!since) {
        throw new Error('need frequency if no since date is provided');
      }

      return responseCountSince({ db, habitId, since });
    }),
});
