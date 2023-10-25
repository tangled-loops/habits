/* eslint-disable no-unused-vars */

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { habits } from '@/server/db/schema';

enum Frequency {
  Daily = 'Daily',
  Weekly = 'Weekly',
}

enum Day {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednsday = 'Wednsday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

type FrequencyKeys = keyof typeof Frequency;
type DayKeys = keyof typeof Day;

function frequencies() {
  return [Frequency.Daily, Frequency.Weekly];
}

function days() {
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
 * Abbreviation for `Day`
 * @param day 
 * @returns string
 */
function abbrev(day: Day) {
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
 * Drizzle `select *` representation
 */
type Habit = typeof habits.$inferSelect;

/**
 * Drizzle `insert` representation
 */
type NewHabit = typeof habits.$inferInsert;

const frontendHabitSchema = z.object({
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
type FrontendHabit = z.infer<typeof frontendHabitSchema>;

/**
 * User selectable color scheme options
 */
const colors = ['red', 'green', 'blue', 'orange', 'purple'] as const;

/**
 * `colors` union type
 */
type Color = (typeof colors)[number];

/**
 * Habit list filter options
 */
const filters = ['none', 'archived', 'needs-response'] as const;

/**
 * `filters` union type
 */
type Filter = (typeof filters)[number];

/**
 * All of the possible css classes associated with a Color
 */
interface ColorCssResult {
  text: string;
  muted: string;
  hover: string;
  background: string;
}

/**
 * Combination of all the color options
 * @param color
 * @returns ColorCssResult
 */
function colorCss(color: Color): ColorCssResult {
  return {
    text: textColor(color),
    muted: backgroundColor(color, true),
    hover: backgroundColor(color, false, true),
    background: backgroundColor(color),
  };
}

/**
 * Background color variations mapped to tailwind classes
 * @param color background color
 * @param muted 20% of the color
 * @param hover 50% of the color on hover
 * @returns string
 */
function backgroundColor(
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

function textColor(color: Color) {
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

const icons = ['activity', 'alarm', 'anchor', 'box', 'binary'] as const;
type Icon = (typeof icons)[number];

export const habitSchema = createSelectSchema(habits);
export const newHabitSchema = createInsertSchema(habits);

export {
  Day,
  Frequency,
  icons,
  colors,
  filters,
  days,
  abbrev,
  colorCss,
  frequencies,
  backgroundColor,
  textColor,
  frontendHabitSchema,
};

export type {
  Habit,
  NewHabit,
  FrontendHabit,
  Icon,
  Color,
  DayKeys,
  FrequencyKeys,
  Filter,
  ColorCssResult,
};
