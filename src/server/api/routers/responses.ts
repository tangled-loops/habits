import * as z from 'zod';

import {
  add,
  find,
  findAll,
  findAllFrontend,
  findFrontendGrouped,
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
    .mutation(async ({ ctx: { db, session: { user: { id } } }, input: { habitId } }) => {
      await add({ db, habitId, userId: id });
    }),
  find: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ ctx: { db }, input: { habitId }}) => {
      return find({ db, habitId })
    }),
  findAll: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx: { db, session: { user: { id }} }, input: { limit }}) => {
      return findAll({ db, userId: id, limit })
    }),
  findAllFrontend: protectedProcedure
  .input(z.object({ limit: z.number() }))
  .query(async ({ ctx: { db, session: { user: { id }} }, input: { limit }}) => {
    return findAllFrontend({ db, userId: id, limit })
  }),
  findGrouped: protectedProcedure
    .input(
      z.object({
        habitId: z.string()
      })
    ).query(async ({ ctx: { db }, input: { habitId }}) => {
      return findGrouped({ db, habitId })
    }),
  findFrontendGrouped: protectedProcedure
    .input(
      z.object({
        habitId: z.string()
      })
    )
    .query(async ({ ctx: { db, session }, input: { habitId }}) => {
      return findFrontendGrouped({ db, userId: session.user.id, habitId })
    }),
  since: protectedProcedure
    .input(frequencyBySchema)
    .query(async ({ ctx: { db }, input: { habitId, since, frequency } }) => {
      return frequencyBy({
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
      return frequencyBy({
        since,
        frequency,
        callbacks: {
          since: () => responseCountSince({ db, habitId, since }),
          frequency: () => responseCountSince({ db, habitId, frequency }),
        },
      });
    }),
});
