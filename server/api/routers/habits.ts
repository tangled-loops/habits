import { z } from "zod";
import { users, habits, newHabitSchema } from '../../db/schema';
import { eq, sql, desc } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const habitsRouter = createTRPCRouter({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(habits).where(sql`user_id = ${ctx.session.user.id}`).orderBy(desc(habits.createdAt))
  }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (await ctx.db.select().from(habits).where(eq(habits.id, input.id))).shift()
    }),
  createOrUpdate: protectedProcedure
    .input(z.object({ id: z.string().optional(), title: z.string(), description: z.string(), }))
    .mutation(async ({ ctx, input }) => {
      if (input.id) {
        await ctx.db.update(habits).set(input).where(sql`id = ${input.id}`)
      } else {
        await ctx.db.insert(habits).values({ ...input, userId: ctx.session.user.id })
      }
    }),
});
