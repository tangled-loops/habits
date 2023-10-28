import * as z from 'zod';

import {
  add,
  find,
  findGrouped,
  frequencyBy,
  frequencyBySchema,
  responseCountSince,
  responsesSince,
} from '@/lib/models/response';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';

export const responsesRouter = createTRPCRouter({
  add: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .mutation(async ({ ctx: { db }, input: { habitId } }) => {
      await add({ db, habitId });
    }),
  find: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ ctx: { db }, input: { habitId }}) => {
      return await find({ db, habitId })
    }),
  findGrouped: protectedProcedure
    .input(
      z.object({
        habitId: z.string()
      })
    ).query(async ({ ctx: { db }, input: { habitId }}) => {
      return await findGrouped({ db, habitId })
    }),
  since: protectedProcedure
    .input(frequencyBySchema)
    .query(async ({ ctx: { db }, input: { habitId, since, frequency } }) => {
      return await frequencyBy({
        since,
        frequency,
        callbacks: {
          since: () => responsesSince({ db, habitId, since }),
          frequency: () => responsesSince({ db, habitId, frequency }),
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
          since: () => responseCountSince({ db, habitId, since }),
          frequency: () => responseCountSince({ db, habitId, frequency }),
        },
      });
    }),
});
