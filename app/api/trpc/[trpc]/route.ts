import { appRouter } from "@/server/api/root"
import { db } from "@/server/db";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { getServerSession } from "next-auth";

const handler = async (req: Request) => {
  const session = await getServerSession()
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ session, db }),
  })
}

export { handler as GET, handler as POST };
