import { Session } from 'next-auth';

import { appRouter } from '~/api/root';
import { db } from '~/db/drizz';

export function client(session: Session) {
  return appRouter.createCaller({
    db,
    session,
  });
}
