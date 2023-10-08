import { desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { Frequency, habitsFormSchema } from '@/lib/models/habit';

import { createTRPCRouter, protectedProcedure } from '~/api/trpc';
import { Tag, habits, habitsTags, tags } from '~/db/schema';

export const habitsRouter = createTRPCRouter({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const _habits = await ctx.db
      .select()
      .from(habits)
      .where(eq(habits.userId, ctx.session.user.id))
      .orderBy(desc(habits.createdAt));

    const res = [];

    for (const habit of _habits) {
      const _tags = await ctx.db
        .select({ name: tags.name })
        .from(tags)
        .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
        .where(eq(habitsTags.habitId, habit.id));

      // to make sure the domain is correct
      res.push({
        id: habit.id,
        name: habit.name,
        notes: habit.notes || '',
        frequency: habit.frequency as unknown as string,
        goal: habit.goal,
        color: habit.color || '',
        icon: habit.icon || '',
        tags: _tags.map((t) => t.name),
      });
    }

    return res;
  }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const habit = await ctx.db.query.habits.findFirst({
        where: eq(habits.id, input.id),
        with: { responses: true },
      });
      const _tags = await ctx.db
        .select({ name: tags.name })
        .from(tags)
        .innerJoin(habitsTags, eq(tags.id, habitsTags.tagId))
        .where(eq(habitsTags.habitId, input.id));

      if (!habit) throw new Error('invalid habit id passed into trpc findById');

      return {
        ...habit,
        notes: habit.notes || '',
        goal: habit.goal,
        icon: habit.icon || '',
        color: habit.color || '',
        selectedDays: habit.selectedDays || [],
        frequency: habit.frequency as unknown as string,
        tags: _tags.map((tag) => tag.name),
      };
    }),
  /**
   * probably would have been easier to separate these, or maybe put some
   * stuff into a model or some shit
   */
  createOrUpdate: protectedProcedure
    .input(habitsFormSchema)
    .mutation(async ({ ctx, input }) => {
      const valuesToSet = {
        name: input.name,
        notes: input.notes,
        frequency: input.frequency as unknown as Frequency,
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
        const usersTags = await ctx.db.query
          .tags
          .findMany({ where: eq(tags.userId, ctx.session.user.id )})

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
        const usersTagsNames = usersTags.map(ut => ut.name)
        
        const toCreateTags = input.tags.filter(tag => !allTagNames.includes(tag) && !usersTagsNames.includes(tag))
        console.log('making new tags: ', toCreateTags)

        let newTags: Array<Tag> = []
        if (toCreateTags.length > 0){
          newTags = await ctx.db
            .insert(tags)
            .values(toCreateTags.map((tc) => ({ userId: ctx.session.user.id, name: tc })))
            .returning();
        }
        
        const toCreateHabitTags = usersTags.filter(tag => !allTagNames.includes(tag.name) && input.tags.includes(tag.name))
        const allHabitsTagsToCreate = [...newTags, ...toCreateHabitTags]     
        const habitsTagsValues = allHabitsTagsToCreate.map((tag) => ({
          habitId: input.id!,
          tagId: tag.id,
        }));
        console.log('making habit tags: ', habitsTagsValues)
        await ctx.db.insert(habitsTags).values(habitsTagsValues);
      } else {
        const newHabit = (
          await ctx.db.insert(habits).values(valuesToSet).returning()
        ).shift();

        if (!newHabit) throw new Error('PROBLEM 3o2u40923');

        const usersTags = await ctx.db.query
          .tags
          .findMany({ where: eq(tags.userId, ctx.session.user.id )})
        const usersTagsNames = usersTags.map(ut => ut.name)
        
        const tagsValues = input.tags
          .filter(tag => !usersTagsNames.includes(tag))
          .map((tag) => ({
            userId: ctx.session.user.id,
            name: tag,
          }));
        
        let newTags: Array<Tag> = []
        if (tagsValues.length > 0) {
          newTags = await ctx.db
            .insert(tags)
            .values(tagsValues)
            .returning();
        }

        const toCreateHabitTags = usersTags.filter(tag => input.tags.includes(tag.name))
        const allHabitsTagsToCreate = [...newTags, ...toCreateHabitTags]     
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
          .where(sql`id = ${input.id}`);
      } else {
        await habitsUpdate
          .set({ name: input.name })
          .where(sql`id = ${input.id}`);
      }
    }),
});
