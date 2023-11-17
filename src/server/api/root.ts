import { habitsRouter } from '~/api/routers/habits';
import { createTRPCRouter } from '~/api/trpc';
import { tagsRouter } from './routers/tags';
import { responsesRouter } from './routers/responses';
import { usersRouter } from './routers/user';
import { journalsRouter } from './routers/journals';
import { chartsRouter } from './routers/charts';

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  charts: chartsRouter,
  users: usersRouter,
  habits: habitsRouter,
  journals: journalsRouter,
  responses: responsesRouter,
});

export type AppRouter = typeof appRouter;
