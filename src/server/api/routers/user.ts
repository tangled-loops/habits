import { eq } from "drizzle-orm";
import { createTRPCRouter } from "../trpc"
import { protectedProcedure } from '~/api/trpc';
import z from "zod";
import { userDefaultsSchema, users } from "@/server/db/schema";

export const usersRouter = createTRPCRouter({
  updateDefaults: protectedProcedure.input(userDefaultsSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      await db
        .update(users)
        .set({ defaults: input })
        .where(eq(users.id, session.user.id))
    }),
  getCurrentUser: protectedProcedure.query(async ({ ctx: { db, session }}) => {
    return db.query.users.findFirst({ where: eq(users.id, session.user.id) })
  }),
  findBy: protectedProcedure.input(
    z.object({
      id: z.string().optional(),
      email: z.string().optional(),
    })
  ).query(async ({ ctx: { db, session }, input: { id, email }}) => {
    let where;
    if (id) {
      where = eq(users.id, id)
    }
    if (email) {
      where = eq(users.email, email)
    }
    if (!id && !email) {
      where = eq(users.id, session.user.id)
    }
    return db.query.users.findFirst({ where })
  })
})