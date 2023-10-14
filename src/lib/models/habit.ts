/* eslint-disable no-unused-vars */

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { habits } from '@/server/db/schema';
import { ReactElement } from 'react';
import { Activity, AlarmPlus, Anchor, Box, Binary } from 'lucide-react';

enum Frequency {
  Daily,
  Weekly,
}
type FrequencyKeys = keyof typeof Frequency;

function frequencies() {
  return [Frequency.Daily, Frequency.Weekly];
}

enum Day {
  Monday,
  Tuesday,
  Wednsday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

type DayKeys = keyof typeof Day;

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

type Habit = typeof habits.$inferSelect;
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
});

type FrontendHabit = z.infer<typeof frontendHabitSchema>;

const colors = ['red', 'green', 'blue', 'orange', 'purple'] as const;
type Color = (typeof colors)[number];

/**
 * Can't use string interpolation for class names for some reason...
 */

function backgroundColor(color: Color, muted: boolean = false) {
  switch (color as Color) {
    case 'blue': return muted ? 'bg-blue-500/20' : 'bg-blue-500'
    case 'green': return muted ? 'bg-green-500/20' : 'bg-green-500'
    case 'orange': return muted ? 'bg-orange-500/20' : 'bg-orange-500'
    case 'purple': return muted ? 'bg-purple-500/20' : 'bg-purple-500'
    case 'red': return muted ? 'bg-red-500/20' : 'bg-red-500'
  }
}

function textColor(color: Color) {
  switch (color as Color) {
    case 'blue': return 'text-blue-500'
    case 'green': return 'text-green-500'
    case 'orange': return 'text-orange-500'
    case 'purple': return 'text-purple-500'
    case 'red': return 'text-red-500'
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
  days,
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
  FrequencyKeys
};
