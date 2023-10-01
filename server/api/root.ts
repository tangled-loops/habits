import { habitsRouter } from '@/server/api/routers/habits';
import { createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
  habits: habitsRouter,
});

export type AppRouter = typeof appRouter;
