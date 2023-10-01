import { z } from "zod";
import { users, habits, newHabitSchema } from '../../db/schema';
import { eq, sql } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const habitsRouter = createTRPCRouter({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(habits).where(sql`user_id = ${ctx.session.user.id}`)
  }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return (await ctx.db.select().from(habits).where(eq(habits.id, input.id))).shift()
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string(), }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(habits).values({ ...input, userId: ctx.session.user.id })
    })
});
