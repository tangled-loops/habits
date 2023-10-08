import { habitsRouter } from '~/api/routers/habits';
import { createTRPCRouter } from '~/api/trpc';
import { tagsRouter } from './routers/tags';

export const appRouter = createTRPCRouter({
  tags: tagsRouter,
  habits: habitsRouter,
});

export type AppRouter = typeof appRouter;
