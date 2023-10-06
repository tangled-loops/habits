import { z } from 'zod';
import { users, habits, newHabitSchema } from '../../db/schema';
import { eq, sql, desc } from 'drizzle-orm';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';

export const habitsRouter = createTRPCRouter({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(habits)
      .where(sql`user_id = ${ctx.session.user.id}`)
      .orderBy(desc(habits.createdAt));
  }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (
        await ctx.db.select().from(habits).where(eq(habits.id, input.id))
      ).shift();
    }),
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id && input.id.length > 0) {
        await ctx.db
          .update(habits)
          .set(input)
          .where(sql`id = ${input.id}`);
      } else {
        await ctx.db
          .insert(habits)
          .values({
            title: input.title,
            description: input.description,
            userId: ctx.session.user.id,
          });
      }
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
        description: z.string().optional(),
        title: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const habitsUpdate = ctx.db.update(habits);
      if (input.type === 'description') {
        await habitsUpdate
          .set({ description: input.description })
          .where(sql`id = ${input.id}`);
      } else {
        await habitsUpdate
          .set({ title: input.title })
          .where(sql`id = ${input.id}`);
      }
    }),
});
