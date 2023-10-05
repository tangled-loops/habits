import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { Session } from "next-auth";

export function client(session: Session) {
  return appRouter.createCaller({
    db,
    session,
  })
}