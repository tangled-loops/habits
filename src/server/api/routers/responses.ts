import * as z from 'zod';

import { add, frequencyBy, frequencyBySchema, responseCountSince, responsesSince } from '@/lib/models/response';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';

export const responsesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx: { db }, input: { habitId } }) => {
      await add({ db, habitId });
    }),
  since: protectedProcedure
    .input(frequencyBySchema)
    .query(async ({ ctx: { db }, input: { habitId, since, frequency } }) => {
      return await frequencyBy({
        since,
        frequency,
        callbacks: {
          frequency() {
            return responsesSince({ db, habitId, frequency });
          },
          since() {
            return responsesSince({ db, habitId, since });
          },
        },
      });
    }),
  countSince: protectedProcedure
    .input(frequencyBySchema)
    .query(async ({ ctx: { db }, input: { habitId, since, frequency } }) => {
      return await frequencyBy({
        since,
        frequency,
        callbacks: {
          frequency() {
            return responseCountSince({ db, habitId, frequency });
          },
          since() {
            return responseCountSince({ db, habitId, since });
          },
        },
      });
    }),
});
