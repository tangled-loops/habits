import { habitsRouter } from '~/api/routers/habits';
import { createTRPCRouter } from '~/api/trpc';
import { tagsRouter } from './routers/tags';
import { responsesRouter } from './routers/responses';

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  habits: habitsRouter,
  responses: responsesRouter,
});

export type AppRouter = typeof appRouter;
