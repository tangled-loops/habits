import { habitsRouter } from '~/api/routers/habits';
import { createTRPCRouter } from '~/api/trpc';

export const appRouter = createTRPCRouter({
  habits: habitsRouter,
});

export type AppRouter = typeof appRouter;
