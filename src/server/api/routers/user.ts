import { eq } from "drizzle-orm";
import { createTRPCRouter } from "../trpc"
import { protectedProcedure } from '~/api/trpc';
import z from "zod";
import { users } from "@/server/db/schema";

export const usersRouter = createTRPCRouter({
  findBy: protectedProcedure.input(
    z.object({
      id: z.string().optional(),
      email: z.string().optional(),
    })
  ).query(({ ctx: { db, session }, input: { id, email }}) => {
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