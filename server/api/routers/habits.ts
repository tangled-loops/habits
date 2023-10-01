import { z } from "zod";
import { habits } from '../../db/schema';
import { eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const habitsRouter = createTRPCRouter({
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(habits)
  }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.select().from(habits).where(eq(habits.id, input.id))
    }),
  
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
