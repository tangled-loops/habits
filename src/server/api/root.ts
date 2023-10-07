import { habitsRouter } from '@/src/server/api/routers/habits';
import { createTRPCRouter } from '@/src/server/api/trpc';

export const appRouter = createTRPCRouter({
  habits: habitsRouter,
});

export type AppRouter = typeof appRouter;
