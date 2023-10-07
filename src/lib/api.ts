import { Session } from 'next-auth';

import { db } from '@/server/db/root';

import { appRouter } from '~/api/root';

export function client(session: Session) {
  return appRouter.createCaller({
    db,
    session,
  });
}
