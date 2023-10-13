import * as z from 'zod';

import { responseCountSince, responsesSince } from '@/lib/models/response';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { responses } from '~/db/schema';

export const responsesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(responses).values({ habitId: input.habitId });
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
      return await responsesSince(db, habitId, frequency);
    }
    if (!since) {
      throw new Error("need frequency if no since date is provided")
    }

    return responsesSince(db, habitId, undefined, since)
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
        return await responseCountSince(db, habitId, frequency);
      }
      if (!since) {
        throw new Error("need frequency if no since date is provided")
      }

      return responseCountSince(db, habitId, undefined, since)
    }),
  
});
