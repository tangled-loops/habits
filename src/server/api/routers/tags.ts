import { eq } from 'drizzle-orm';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { tags } from '~/db/schema';

export const tagsRouter = createTRPCRouter({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const _tags = await ctx.db.query.tags
      .findMany({ where: eq(tags.userId, ctx.session.user.id )})
    return _tags.map(tag => tag.name)
  })
})