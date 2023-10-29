import { desc, eq } from 'drizzle-orm';
import * as z from 'zod';

import { createTRPCRouter, protectedProcedure } from '../trpc';

import { journals } from '@/server/db/schema';

export const journalsRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ ctx: { db }, input: { habitId } }) => {
      return db
        .select()
        .from(journals)
        .where(eq(journals.habitId, habitId))
        .orderBy(desc(journals.createdAt));
    }),
  create: protectedProcedure
    .input(
      z.object({ habitId: z.string(), title: z.string(), content: z.string() }),
    )
    .mutation(
      async ({
        ctx: {
          db,
          session: { user },
        },
        input: { habitId, content, title },
      }) => {
        await db
          .insert(journals)
          .values({ habitId, userId: user.id, title, content });
      },
    ),
  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), content: z.string() }))
    .mutation(async ({ ctx: { db }, input: { title, content, id } }) => {
      await db
        .update(journals)
        .set({ title, content })
        .where(eq(journals.id, id!));
    }),
});
