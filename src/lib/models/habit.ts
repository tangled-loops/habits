/* eslint-disable no-unused-vars */

import { eq, inArray, sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { HasDB } from '.';
import { tagsFor } from './tag';

import { habits, habitsTags, Tag, tags } from '@/server/db/schema';

/**
 * frontend
 */

export enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
}

export enum Day {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednsday = 'Wednsday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export type FrequencyKeys = keyof typeof Frequency;
export type DayKeys = keyof typeof Day;

export function frequencies() {
  return [Frequency.Daily, Frequency.Weekly];
}

export function days() {
  return [
    Day.Monday,
    Day.Tuesday,
    Day.Wednsday,
    Day.Thursday,
    Day.Friday,
    Day.Saturday,
    Day.Sunday,
  ];
}

/**
 * abbreviation for `Day`
 * @param day
 * @returns string
 *
 */
export function abbrev(day: Day) {
  switch (day) {
    case Day.Monday:
      return 'M';
    case Day.Tuesday:
      return 'T';
    case Day.Wednsday:
      return 'W';
    case Day.Thursday:
      return 'Th';
    case Day.Friday:
      return 'F';
    case Day.Saturday:
      return 'S';
    case Day.Sunday:
      return 'Su';
  }
}

/**
 * drizzle `select *` representation
 */
export type Habit = typeof habits.$inferSelect;

/**
 * drizzle `insert` representation
 */
export type NewHabit = typeof habits.$inferInsert;

export const frontendHabitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  notes: z.string(),
  frequency: z.string(),
  goal: z.coerce.number().default(1),
  selectedDays: z.array(z.string()).optional(),
  color: z.string(),
  icon: z.string(),
  tags: z.array(z.string()),
  responses: z.coerce.number().nullish(),
  totalResponses: z.coerce.number().optional(),
  archived: z.boolean(),
});

/**
 * The frontend representation of the habit, used in forms as well as the main
 * source of truth for a given habit in the UI
 */
export type FrontendHabit = z.infer<typeof frontendHabitSchema>;

/**
 * user selectable color scheme options
 */
export const colors = ['red', 'green', 'blue', 'orange', 'purple'] as const;

/**
 * `colors` union type
 */
export type Color = (typeof colors)[number];

/**
 * habit list filter options
 */
export const filters = ['none', 'archived', 'needs-response'] as const;

/**
 * `filters` union type
 */
export type Filter = (typeof filters)[number];

/**
 * all of the possible css classes associated with a Color
 */
export interface ColorCssResult {
  text: string;
  muted: string;
  hover: string;
  background: string;
}

/**
 * combination of all the color options
 * @param color
 * @returns ColorCssResult
 */
export function colorCss(color: Color): ColorCssResult {
  return {
    text: textColor(color),
    muted: backgroundColor(color, true),
    hover: backgroundColor(color, false, true),
    background: backgroundColor(color),
  };
}

/**
 * background color variations mapped to tailwind classes
 * @param color background color
 * @param muted 20% of the color
 * @param hover 50% of the color on hover
 * @returns string
 */
export function backgroundColor(
  color: Color,
  muted: boolean = false,
  hover: boolean = false,
) {
  switch (color as Color) {
    case 'blue':
      return hover
        ? 'hover:bg-blue-500/50'
        : muted
        ? 'bg-blue-500/20'
        : 'bg-blue-500';
    case 'green':
      return hover
        ? 'hover:bg-green-500/50'
        : muted
        ? 'bg-green-500/50'
        : 'bg-green-500';
    case 'orange':
      return hover
        ? 'hover:bg-orange-500/50'
        : muted
        ? 'bg-orange-500/50'
        : 'bg-orange-500';
    case 'purple':
      return hover
        ? 'hover:bg-purple-500/50'
        : muted
        ? 'bg-purple-500/50'
        : 'bg-purple-500';
    case 'red':
      return hover
        ? 'hover:bg-red-500/50'
        : muted
        ? 'bg-red-500/50'
        : 'bg-red-500';
  }
}

export function textColor(color: Color) {
  switch (color as Color) {
    case 'blue':
      return 'text-blue-500';
    case 'green':
      return 'text-green-500';
    case 'orange':
      return 'text-orange-500';
    case 'purple':
      return 'text-purple-500';
    case 'red':
      return 'text-red-500';
  }
}

export const icons = ['activity', 'alarm', 'anchor', 'box', 'binary'] as const;
export type Icon = (typeof icons)[number];

export const habitSchema = createSelectSchema(habits);
export const newHabitSchema = createInsertSchema(habits);

/**
 * backend
 */

export const findAllSelect = {
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
};

export function valuesFor(input: FrontendHabit, userId: string) {
  return {
    name: input.name,
    notes: input.notes,
    frequency: input.frequency,
    selectedDays: input.selectedDays,
    icon: input.icon,
    color: input.color,
    goal: input.goal,
    userId: userId,
  };
}

interface HandleTagsToCreateOpts extends HasDB {
  userId: string;
  habitId: string;
  allTags: { id: string; name: string }[];
  usersTags: Tag[];
  currentTags: string[];
}

export async function handleTagsToCreate({
  db,
  userId,
  habitId,
  allTags,
  usersTags,
  currentTags,
}: HandleTagsToCreateOpts) {
  const allNames = allTags.map((atoh) => atoh.name);
  const userTagsNames = usersTags.map((ut) => ut.name);

  const toCreateTags = currentTags
    .filter((tag) => !allNames.includes(tag) && !userTagsNames.includes(tag))
    .map((name) => ({ userId, name }));

  const toCreateHabitTags = usersTags.filter(
    (tag) => !allNames.includes(tag.name) && currentTags.includes(tag.name),
  );

  let newTags: Tag[] = [];
  if (toCreateTags.length > 0) {
    newTags = await db.insert(tags).values(toCreateTags).returning();
  }

  const habitsTagsValues = [...newTags, ...toCreateHabitTags].map((tag) => ({
    habitId,
    tagId: tag.id,
  }));

  if (habitsTagsValues.length === 0) return;

  await db.insert(habitsTags).values(habitsTagsValues);
}

interface HandleTagsToDeleteOpts extends HasDB {
  allTags: { id: string; name: string }[];
  currentTags: string[];
}

export async function handleTagsToDelete({
  db,
  allTags,
  currentTags,
}: HandleTagsToDeleteOpts) {
  const toDelete = allTags
    .filter((tag) => !currentTags.includes(tag.name))
    .map((tag) => tag.id);
  if (toDelete.length === 0) return;
  await db.delete(habitsTags).where(inArray(habitsTags.tagId, toDelete));
}

interface HandleTagsOpts extends HasDB {
  userId: string;
  habitId: string;
  currentTags: string[];
}

export async function handleTags({
  db,
  userId,
  habitId,
  currentTags,
}: HandleTagsOpts) {
  const usersTags = await db.query.tags.findMany({
    where: eq(tags.userId, userId),
  });

  const allTags = await tagsFor({ db, habitId });
  await handleTagsToDelete({ db, allTags, currentTags });
  await handleTagsToCreate({
    db,
    userId,
    habitId,
    allTags,
    currentTags,
    usersTags,
  });
}
