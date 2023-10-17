/* eslint-disable no-unused-vars */

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { habits } from '@/server/db/schema';
import { ReactElement } from 'react';
import { Activity, AlarmPlus, Anchor, Box, Binary, Filter } from 'lucide-react';

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
  archived: z.boolean()
});

type FrontendHabit = z.infer<typeof frontendHabitSchema>;

const colors = ['red', 'green', 'blue', 'orange', 'purple'] as const;
type Color = (typeof colors)[number];

const filters = ['none', 'archived', 'needs-response'] as const;
type FilterType = (typeof filters)[number];

/**
 * Can't use string interpolation for class names 
 */

function backgroundColor(color: Color, muted: boolean = false, hover: boolean = false) {
  switch (color as Color) {
    case 'blue': return hover ? 'hover:bg-blue-500/50' : (muted ? 'bg-blue-500/20' : 'bg-blue-500')
    case 'green': return hover ? 'hover:bg-green-500/50' : (muted ? 'bg-green-500/50' : 'bg-green-500')
    case 'orange': return hover ? 'hover:bg-orange-500/50' : (muted ? 'bg-orange-500/50' : 'bg-orange-500')
    case 'purple': return hover ? 'hover:bg-purple-500/50' : (muted ? 'bg-purple-500/50' : 'bg-purple-500')
    case 'red': return hover ? 'hover:bg-red-500/50' : (muted ? 'bg-red-500/50' : 'bg-red-500')
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
  filters,
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
  FrequencyKeys,
  FilterType,
};
