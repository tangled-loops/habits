import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  not,
  sql,
} from 'drizzle-orm';
import { z } from 'zod';

import { filters, frontendHabitSchema } from '@/lib/models/habit';
import {
  habitsBoundedByGoal,
  responseCounts,
  responseCountSince,
} from '@/lib/models/response';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { habits, habitsTags, responses, Tag, tags } from '~/db/schema';

/**
 * @todo start moving chunks of functionality to the habit model and consolodate
 * @todo improve efficiency by reducing the number of queries
 * @todo implement some form of pagination for the main list page
 */
export const habitsRouter = createTRPCRouter({
  totalCount: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx: { db, session }, input: { limit } }) => {
      const habitsResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(habits)
        .where(eq(habits.userId, session.user.id))
        .groupBy(habits.userId)
        .limit(1);
      return Math.round(habitsResult[0].count / limit);
    }),
  findAll: protectedProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
        filter: z.enum(filters),
        search: z.string().nullish(),
        sort: z.string().nullish(),
        tagId: z.string().nullish(),
      }),
    )
    .query(
      async ({
        ctx: { db, session },
        input: { limit, page, filter, search, sort, tagId },
      }) => {
        const select = {
          id: habits.id,
          name: habits.name,
          notes: habits.notes,
          goal: habits.goal,
          icon: habits.icon,
          color: habits.color,
          archived: habits.archived,
          responses: habits.responseCount,
          frequency: habits.frequency,
          totalResponses: habits.responseCount,
          selectedDays: habits.selectedDays,
          tagsCount: sql<number>`count(habits_tags)::integer as tags_count`,
          lastResponse: sql<number>`max(responses.created_at) as last_response`,
          responsesInWindow: sql<number>`count(responses.created_at) as responses_in_window`,
        }
       
        const parts = [eq(habits.userId, session.user.id)]

        if (search && search.length > 0) {
          parts.push(ilike(habits.name, `%${search}%`))
        }

        if (tagId && tagId.length > 0) {
          parts.push(eq(habitsTags.tagId, tagId))
        }

        // @todo apply filter to only get responses that are in the right window
        //  right now responsesInWindow is really just total responses, which is
        //  similar to `habits.responseCount`

        switch (filter) {
          case 'none': {
            parts.push(eq(habits.archived, false))
            break;
          }
          case 'archived': {
            parts.push(eq(habits.archived, true))
            break;
          }
          case 'needs-response': {
            parts.push(eq(habits.archived, false))
            
            const counts = await habitsBoundedByGoal({ db, type: 'above' })
            console.log(counts)
            if (counts.length > 0) {
              parts.push(not(inArray(habits.id, counts)));
            }
            if (search && search.length > 0) {
              parts.push(ilike(habits.name, `%${search}%`))
            }
            break;
          }
        }

        const query = db
          .select(select)
          .from(habits)
          .leftJoin(responses, eq(habits.id, responses.habitId))
          .leftJoin(habitsTags, eq(habits.id, habitsTags.habitId))
          .where(and(...parts))
          .groupBy(habits.id)

        switch (sort) {
          case 'priority': {
            query.orderBy(sql`last_response asc`) //, asc(responses.createdAt))
            break;
          }
          case 'updated': {
            query.orderBy(sql`last_response desc`, desc(habits.updatedAt))
            break;
          }
          case 'created': {
            query.orderBy(desc(habits.createdAt))
            break;
          }
          default: 
            query.orderBy(desc(habits.updatedAt), desc(habits.createdAt))
        }
        console.log(limit)
        console.log(page)
        
        const items = [];
        const habitsResult = await query;

        const tagsResult = await db
          .select({ name: tags.name, habitId: habitsTags.habitId })
          .from(tags)
          .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
          .groupBy(tags.id, habitsTags.habitId);

        const tagHash = tagsResult.reduce(
          (prv: Record<string, Array<string>>, nxt) => {
            if (prv[nxt.habitId]) {
              prv[nxt.habitId].push(nxt.name);
            } else {
              prv[nxt.habitId] = [nxt.name];
            }
            return prv;
          },
          {},
        );

        const responseHash = await responseCounts({ db });

        for (const habit of habitsResult) {
          items.push(
            frontendHabitSchema.parse({
              ...habit,
              tags: tagHash[habit.id] ?? [],
              responses: responseHash[habit.id] ?? 0,
            }),
          );
        }

        return items;
      },
    ),
  infiniteHabits: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx: { db, session }, input }) => {
      const limit = input.limit ?? 5;
      const cursor = input.cursor ?? 0;
      const habitsResult = await db
        .select()
        .from(habits)
        .orderBy(desc(habits.createdAt))
        .where(eq(habits.userId, session.user.id))
        .limit(limit + 1)
        .offset(cursor);

      const items = [];

      for (const habit of habitsResult) {
        const tagsResult = await db
          .select({ name: tags.name })
          .from(tags)
          .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
          .where(eq(habitsTags.habitId, habit.id));

        items.push(
          frontendHabitSchema.parse({
            ...habit,
            responses: await responseCountSince({
              db,
              habitId: habit.id,
              frequency: habit.frequency,
            }),
            tags: tagsResult.map((t) => t.name),
          }),
        );
      }

      let nextCursor: typeof cursor | undefined = undefined;
      if (habitsResult.length > limit) {
        nextCursor = cursor + habitsResult.length;
      }

      return {
        items,
        nextCursor,
      };
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      const habit = await db.query.habits.findFirst({
        where: eq(habits.id, input.id),
      });

      const tagsResult = await db
        .select({ name: tags.name })
        .from(tags)
        .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
        .where(eq(habitsTags.habitId, input.id));

      if (!habit) throw new Error('invalid habit id passed into trpc findById');

      return frontendHabitSchema.parse({
        ...habit,
        responses: await responseCountSince({
          db,
          habitId: habit.id,
          frequency: habit.frequency,
        }),
        tags: tagsResult.map((t) => t.name),
      });
    }),
  /**
   * probably would have been easier to separate these, or maybe put some
   * stuff into a model or some shit
   */
  createOrUpdate: protectedProcedure
    .input(frontendHabitSchema)
    .mutation(async ({ ctx, input }) => {
      const valuesToSet = {
        name: input.name,
        notes: input.notes,
        frequency: input.frequency,
        selectedDays: input.selectedDays,
        icon: input.icon,
        color: input.color,
        goal: input.goal,
        userId: ctx.session.user.id,
      };

      if (input.id && input.id.length > 0) {
        // update the habit
        await ctx.db
          .update(habits)
          .set({ updatedAt: new Date(), ...valuesToSet })
          .where(eq(habits.id, input.id))
          .returning();

        // get all the users tags
        const usersTags = await ctx.db.query.tags.findMany({
          where: eq(tags.userId, ctx.session.user.id),
        });

        // get all the tags currently tagged
        const allTagsOnHabit = await ctx.db
          .select({ id: tags.id, name: tags.name })
          .from(tags)
          .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
          .where(eq(habitsTags.habitId, input.id));

        const toDelete = allTagsOnHabit.filter(
          (tag) => !input.tags.includes(tag.name),
        );

        if (toDelete.length > 0) {
          await ctx.db.delete(habitsTags).where(
            inArray(
              habitsTags.tagId,
              toDelete.map((tag) => tag.id),
            ),
          );
        }

        // names of all the tags for a user and all the tags on this habit
        const allTagNames = allTagsOnHabit.map((atoh) => atoh.name);
        const usersTagsNames = usersTags.map((ut) => ut.name);

        const toCreateTags = input.tags.filter(
          (tag) => !allTagNames.includes(tag) && !usersTagsNames.includes(tag),
        );

        let newTags: Array<Tag> = [];
        if (toCreateTags.length > 0) {
          newTags = await ctx.db
            .insert(tags)
            .values(
              toCreateTags.map((tc) => ({
                userId: ctx.session.user.id,
                name: tc,
              })),
            )
            .returning();
        }

        const toCreateHabitTags = usersTags.filter(
          (tag) =>
            !allTagNames.includes(tag.name) && input.tags.includes(tag.name),
        );
        const allHabitsTagsToCreate = [...newTags, ...toCreateHabitTags];
        const habitsTagsValues = allHabitsTagsToCreate.map((tag) => ({
          habitId: input.id!,
          tagId: tag.id,
        }));
        if (habitsTagsValues.length > 0) {
          await ctx.db.insert(habitsTags).values(habitsTagsValues);
        }
      } else {
        const newHabit = (
          await ctx.db.insert(habits).values(valuesToSet).returning()
        ).shift();

        if (!newHabit) throw new Error('Habit couldnt be created');

        const usersTags = await ctx.db.query.tags.findMany({
          where: eq(tags.userId, ctx.session.user.id),
        });
        const usersTagsNames = usersTags.map((ut) => ut.name);

        const tagsValues = input.tags
          .filter((tag) => !usersTagsNames.includes(tag))
          .map((tag) => ({
            userId: ctx.session.user.id,
            name: tag,
          }));

        let newTags: Array<Tag> = [];
        if (tagsValues.length > 0) {
          newTags = await ctx.db.insert(tags).values(tagsValues).returning();
        }

        const toCreateHabitTags = usersTags.filter((tag) =>
          input.tags.includes(tag.name),
        );
        const allHabitsTagsToCreate = [...newTags, ...toCreateHabitTags];
        const habitsTagsValues = allHabitsTagsToCreate.map((tag) => ({
          habitId: newHabit.id,
          tagId: tag.id,
        }));
        if (habitsTagsValues.length > 0) {
          await ctx.db.insert(habitsTags).values(habitsTagsValues);
        }
      }
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.string(),
        notes: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const habitsUpdate = ctx.db.update(habits);
      if (input.type === 'notes') {
        await habitsUpdate
          .set({ updatedAt: new Date(), notes: input.notes })
          .where(eq(habits.id, input.id));
      } else {
        await habitsUpdate
          .set({ updatedAt: new Date(), name: input.name })
          .where(eq(habits.id, input.id));
      }
    }),
  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      await db.update(habits).set({ updatedAt: new Date(), archived: true }).where(eq(habits.id, id));
    }),
  unarchive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      await db.update(habits).set({ updatedAt: new Date(), archived: false }).where(eq(habits.id, id));
    }),
});
