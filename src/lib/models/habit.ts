/* eslint-disable no-unused-vars */

import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import z from 'zod';

import { habits } from '@/server/db/schema';

export enum Frequency {
  Daily,
  Weekly,
}
export type FrequencyKeys = keyof typeof Frequency;

export function frequencies() {
  return [Frequency.Daily, Frequency.Weekly];
}

export enum Day {
  Monday,
  Tuesday,
  Wednsday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}
export type DayKeys = keyof typeof Day;

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

export type Habit = typeof habits.$inferSelect;
export type NewHabit = typeof habits.$inferInsert;

export const habitsFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  notes: z.string(),
  frequency: z.string(),
  goal: z.number().default(1),
  selectedDays: z.array(z.string()).optional(),
  color: z.string(),
  icon: z.string(),
  tags: z.array(z.string()),
});

export type HabitsFormValues = z.infer<typeof habitsFormSchema>;

export const habitSchema = createSelectSchema(habits);
export const newHabitSchema = createInsertSchema(habits);
