import { and, desc, eq, gt, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { frontendHabitSchema } from '@/lib/models/habit';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { habits, habitsTags, responses, Tag, tags } from '~/db/schema';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '~/db/schema';

async function responsesSince(db: NodePgDatabase<typeof schema>, habitId: string, frequency: string) {
  let date: Date = new Date();
  const today = new Date()
  switch (frequency) {
    case 'Daily': {
      date = new Date(`${today.toDateString()} 00:00`)
      break;
    }
    case 'Weekly': {
      date = new Date(today.getDate() - today.getDay()) // check that this is correct :)
      break;
    }
  }
  const result = await db.select({ count: sql<number>`count(*)` })
    .from(responses)
    .where(and(eq(responses.habitId, habitId), gt(responses.createdAt, date)))
    .groupBy(responses.habitId)
  if (!result || result.length === 0) return { responses: 0 }
  return { responses: result[0].count }
}

export const habitsRouter = createTRPCRouter({
  findAll: protectedProcedure
    .input(z.object({ limit: z.number() }))
    .query(async ({ ctx: { db, session }, input: { limit } }) => {
      const habitsResult = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, session.user.id))
        .orderBy(desc(habits.createdAt))
        .limit(limit)

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
            responses: (await responsesSince(db, habit.id, habit.frequency)).responses,
            tags: tagsResult.map((t) => t.name),
          }),
        );
      }

      return items;
    }),
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
            responses: (await responsesSince(db, habit.id, habit.frequency)).responses,
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
    .query(async ({ ctx, input }) => {
      const habit = await ctx.db.query.habits.findFirst({
        where: eq(habits.id, input.id),
      });

      const tagsResult = await ctx.db
        .select({ name: tags.name })
        .from(tags)
        .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
        .where(eq(habitsTags.habitId, input.id));

      if (!habit) throw new Error('invalid habit id passed into trpc findById');

      return frontendHabitSchema.parse({
        ...habit,
        responses: (await responsesSince(ctx.db, habit.id, habit.frequency)).responses,
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
          .set(valuesToSet)
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
        console.log('making new tags: ', toCreateTags);

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

        await ctx.db.insert(habitsTags).values(habitsTagsValues);
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

        await ctx.db.insert(habitsTags).values(habitsTagsValues);
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
          .set({ notes: input.notes })
          .where(eq(habits.id, input.id));
      } else {
        await habitsUpdate
          .set({ name: input.name })
          .where(eq(habits.id, input.id));
      }
    }),
});
