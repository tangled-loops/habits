import { and, desc, eq, ilike, inArray, not, sql } from 'drizzle-orm';
import { z } from 'zod';

import {
  filters,
  findAllSelect,
  frontendHabitSchema,
  handleTags,
  selectDays,
  valuesFor,
} from '@/lib/models/habit';
import {
  habitsBoundedByGoal,
  responseCounts,
  responseCountSince,
} from '@/lib/models/response';
import { tagNamesFor, tagsForHabits } from '@/lib/models/tag';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { habits, habitsTags, responses } from '~/db/schema';
import { selectedDaysByHabit, selectedDaysFor } from '@/lib/models/selected-day';
import { dayNames } from '../../../lib/models/habit';

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
  findById: protectedProcedure
    .input(z.object({ habitId: z.string() }))
    .query(async ({ ctx: { db }, input: { habitId } }) => {
      const habit = (
        await db
          .select(findAllSelect)
          .from(habits)
          .leftJoin(responses, eq(habits.id, responses.habitId))
          .leftJoin(habitsTags, eq(habits.id, habitsTags.habitId))
          .where(eq(habits.id, habitId))
          .groupBy(habits.id)
          .limit(1)
      ).shift();

      if (!habit) throw new Error('invalid habit id passed into trpc findById');

      return frontendHabitSchema.parse({
        ...habit,
        responses: await responseCountSince({
          db,
          habitId,
          frequency: habit.frequency,
        }),
        tags: await tagNamesFor({ db, habitId }),
        selectedDays: await selectedDaysFor({ db, habitId })
      });
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
        console.log(limit, page);
        const parts = [eq(habits.userId, session.user.id)];

        if (search && search.length > 0) {
          parts.push(ilike(habits.name, `%${search}%`));
        }

        if (tagId && tagId.length > 0) {
          parts.push(eq(habitsTags.tagId, tagId));
        }

        // @todo apply filter to only get responses that are in the right window
        //  right now responsesInWindow is really just total responses, which is
        //  similar to `habits.responseCount`

        switch (filter) {
          case 'none': {
            parts.push(eq(habits.archived, false));
            break;
          }
          case 'archived': {
            parts.push(eq(habits.archived, true));
            break;
          }
          case 'needs-response': {
            parts.push(eq(habits.archived, false));

            const counts = await habitsBoundedByGoal({ db, type: 'above' });
            console.log(counts);
            if (counts.length > 0) {
              parts.push(not(inArray(habits.id, counts)));
            }
            if (search && search.length > 0) {
              parts.push(ilike(habits.name, `%${search}%`));
            }
            break;
          }
        }

        const query = db
          .select(findAllSelect)
          .from(habits)
          .leftJoin(responses, eq(habits.id, responses.habitId))
          .leftJoin(habitsTags, eq(habits.id, habitsTags.habitId))
          .where(and(...parts))
          .groupBy(habits.id);

        switch (sort) {
          case 'priority': {
            query.orderBy(sql`last_response asc`);
            break;
          }
          case 'updated': {
            query.orderBy(sql`last_response desc`, desc(habits.updatedAt));
            break;
          }
          case 'created': {
            query.orderBy(desc(habits.createdAt));
            break;
          }
          default:
            query.orderBy(desc(habits.updatedAt), desc(habits.createdAt));
        }

        const items = [];
        const habitsResult = await query;

        const tagHash = await tagsForHabits({ db });
        const responseHash = await responseCounts({ db });
        const selectedDaysHash = await selectedDaysByHabit({ db })

        for (const habit of habitsResult) {
          items.push(
            frontendHabitSchema.parse({
              ...habit,
              tags: tagHash[habit.id] ?? [],
              responses: responseHash[habit.id] ?? 0,
              selectedDays: selectedDaysHash[habit.id] ?? []
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
        .where(eq(habits.userId, session.user.id))
        .limit(limit + 1)
        .orderBy(desc(habits.createdAt))
        .offset(cursor);

      const items = [];
      const tagHash = await tagsForHabits({ db });
      const responseHash = await responseCounts({ db });
        const selectedDaysHash = await selectedDaysByHabit({ db })

      for (const habit of habitsResult) {
        items.push(
          frontendHabitSchema.parse({
            ...habit,
            tags: tagHash[habit.id],
            responses: responseHash[habit.id],
            selectedDays: selectedDaysHash[habit.id],
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
  create: protectedProcedure
    .input(frontendHabitSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      const userId = session.user.id;

      const newHabit = (
        await db.insert(habits).values(valuesFor(input, userId)).returning()
      ).shift();

      if (!newHabit) throw new Error('Habit couldnt be created');

      const habitId = newHabit.id;

      await handleTags({ db, userId, habitId, currentTags: input.tags });
      await selectDays({ db, userId, habitId, dayNames: input.selectedDays ?? [] })
    }),
  update: protectedProcedure
    .input(frontendHabitSchema)
    .mutation(async ({ ctx: { db, session }, input }) => {
      if (!input.id) throw new Error('invalid update call');
      
      const userId = session.user.id
      const habitId = input.id
      
      await db
        .update(habits)
        .set({ updatedAt: new Date(), ...valuesFor(input, session.user.id) })
        .where(eq(habits.id, input.id))
        .returning();

      await handleTags({
        db,
        userId: session.user.id,
        habitId: input.id!,
        currentTags: input.tags,
      });
      await selectDays({ db, userId, habitId, dayNames: input.selectedDays ?? [] })
    }),
  updateField: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        field: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const habitsUpdate = ctx.db.update(habits);
      if (input.field === 'notes') {
        await habitsUpdate
          .set({ updatedAt: new Date(), notes: input.value })
          .where(eq(habits.id, input.id));
      } else {
        await habitsUpdate
          .set({ updatedAt: new Date(), name: input.value })
          .where(eq(habits.id, input.id));
      }
    }),
  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      await db
        .update(habits)
        .set({ updatedAt: new Date(), archived: true })
        .where(eq(habits.id, id));
    }),
  unarchive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { db }, input: { id } }) => {
      await db
        .update(habits)
        .set({ updatedAt: new Date(), archived: false })
        .where(eq(habits.id, id));
    }),
});
