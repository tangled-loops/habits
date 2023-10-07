import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { getServerSession } from 'next-auth';

import { db } from '@/server/db/root';

import { appRouter } from '~/api/root';
import { authOptions } from '~/auth';

const handler = async (req: Request) => {
  const session = await getServerSession(authOptions);
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({ session, db }),
  });
};

export { handler as GET, handler as POST };
