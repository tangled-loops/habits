import { appRouter } from '@/src/server/api/root';
import { db } from '@/src/server/db';
import { Session } from 'next-auth';

export function client(session: Session) {
  return appRouter.createCaller({
    db,
    session,
  });
}
