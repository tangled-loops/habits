import { habitsRouter } from '~/api/routers/habits';
import { createTRPCRouter } from '~/api/trpc';
import { tagsRouter } from './routers/tags';
import { responsesRouter } from './routers/responses';
import { usersRouter } from './routers/user';

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  users: usersRouter,
  habits: habitsRouter,
  responses: responsesRouter,
});

export type AppRouter = typeof appRouter;
