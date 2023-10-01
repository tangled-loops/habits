import { appRouter } from '@/server/api/root';
import { authOptions } from '@/server/auth';
import { db } from '@/server/db';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';

const handler = async (req: Request) => {
  const session = await getServerSession(authOptions);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    /**
     * @todo should this be using some of the context declaration
     *  from the trpc stuff in the server?
     */
    createContext: () => ({ session, db }),
  });
};

export { handler as GET, handler as POST };
